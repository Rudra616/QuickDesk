from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from rest_framework.generics import ListCreateAPIView, ListAPIView
from .models import User, Ticket, Category, TicketComment
from .serializers import UserSerializer, TicketSerializer, CategorySerializer, TicketCommentSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from .serializers import RegisterSerializer



class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": serializer.data,
            "message": "User created successfully",
        }, status=201)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

class CurrentUserView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class CategoryListCreateView(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'category']
    search_fields = ['subject', 'description']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        user = self.request.user
        if user.role in ['agent', 'admin']:
            return Ticket.objects.all()
        return Ticket.objects.filter(created_by=user)

    def perform_create(self, serializer):
        ticket = serializer.save(created_by=self.request.user)
        self._send_ticket_creation_email(ticket)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        ticket = self.get_object()
        if request.user.role not in ['agent', 'admin']:
            return Response(
                {'error': 'Only staff can assign tickets'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        ticket.assigned_to = request.user
        ticket.status = 'in_progress'
        ticket.save()
        return Response({'status': 'ticket assigned'})

    @action(detail=True, methods=['post'])
    def upvote(self, request, pk=None):
        ticket = self.get_object()
        ticket.upvotes.add(request.user)
        return Response({'status': 'upvoted'})

    @action(detail=True, methods=['post'])
    def downvote(self, request, pk=None):
        ticket = self.get_object()
        ticket.downvotes.add(request.user)
        return Response({'status': 'downvoted'})

    def _send_ticket_creation_email(self, ticket):
        send_mail(
            subject=f'Ticket Created: {ticket.subject}',
            message=(
                f"Hello {self.request.user.username},\n\n"
                f"Your ticket has been successfully created with status: {ticket.status}.\n\n"
                f"Subject: {ticket.subject}\n"
                f"Category: {ticket.category.name if ticket.category else 'N/A'}\n\n"
                f"Thank you,\nQuickDesk Support Team"
            ),
            from_email='support@quickdesk.com',
            recipient_list=[self.request.user.email],
            fail_silently=False,
        )

class TicketCommentViewSet(viewsets.ModelViewSet):
    serializer_class = TicketCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TicketComment.objects.filter(ticket_id=self.kwargs['ticket_pk'])

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user, 
            ticket_id=self.kwargs['ticket_pk']
        )

class MyTicketsView(ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Ticket.objects.filter(created_by=self.request.user)