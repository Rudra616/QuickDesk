# helpdesk/admin.py
from django.contrib import admin
from .models import User, Ticket, Category, TicketComment

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'is_staff', 'is_superuser']
    list_filter = ['role', 'is_active']
    search_fields = ['username', 'email']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['id', 'subject', 'status', 'category', 'created_by', 'assigned_to', 'created_at']
    list_filter = ['status', 'category']
    search_fields = ['subject', 'description']
    ordering = ['-created_at']
    autocomplete_fields = ['created_by', 'assigned_to']
    raw_id_fields = ['upvotes', 'downvotes']

@admin.register(TicketComment)
class TicketCommentAdmin(admin.ModelAdmin):
    list_display = ['ticket', 'user', 'message', 'created_at']
    search_fields = ['message']
    autocomplete_fields = ['ticket', 'user']
