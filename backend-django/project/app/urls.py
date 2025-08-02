from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    TicketViewSet,
    CategoryViewSet,
    TicketCommentViewSet,
    CurrentUserView,
    MyTicketsView,
    UserViewSet,
    CategoryListCreateView,
    RegisterView
)

# Create main router
router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='tickets')
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'users', UserViewSet, basename='users')  # For user management

# Create nested router for comments
nested_router = NestedDefaultRouter(router, r'tickets', lookup='ticket')
nested_router.register(r'comments', TicketCommentViewSet, basename='ticket-comments')

urlpatterns = [
    # JWT Authentication
    path('auth/jwt/create/', TokenObtainPairView.as_view(), name='jwt-create'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='jwt-refresh'),
    
    # User endpoints
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    
    # Ticket endpoints
    path('tickets/my-tickets/', MyTicketsView.as_view(), name='my-tickets'),
    
    # Category endpoints (both ViewSet and ListCreate)
    path('categories/list/', CategoryListCreateView.as_view(), name='category-list'),
    
    # Include all ViewSet URLs
    path('', include(router.urls)),
    path('', include(nested_router.urls)),
    
    # Djoser endpoints (if using)
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

    path('auth/register/', RegisterView.as_view(), name='register'),  # Add this

]