# helpdesk/serializers.py
from rest_framework import serializers
from .models import User, Category, Ticket, TicketComment

# serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2', 'role')
        extra_kwargs = {
            'role': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']
        read_only_fields = ['id', 'role']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TicketCommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TicketComment
        fields = '__all__'
        read_only_fields = ['user', 'ticket']

class TicketSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    comments = TicketCommentSerializer(many=True, read_only=True)
    upvote_count = serializers.SerializerMethodField()
    downvote_count = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = '__all__'

    def get_upvote_count(self, obj):
        return obj.upvotes.count()

    def get_downvote_count(self, obj):
        return obj.downvotes.count()


    def validate_status(self, value):
        valid_transitions = {
            'open': ['in_progress'],
            'in_progress': ['resolved'],
            'resolved': ['closed']
        }
        if self.instance and value not in valid_transitions.get(self.instance.status, []):
            raise serializers.ValidationError("Invalid status transition")
        return value