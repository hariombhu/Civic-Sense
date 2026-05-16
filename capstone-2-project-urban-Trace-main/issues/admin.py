from django.contrib import admin
from .models import Issue


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    """Admin interface for Issues."""
    
    list_display = (
        'id', 'title', 'category', 'status',
        'created_by', 'assigned_to', 'created_at'
    )
    list_filter = ('status', 'category', 'created_at', 'assigned_to')
    search_fields = ('title', 'description', 'address')
    readonly_fields = ('id', 'created_at', 'updated_at', 'resolved_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Issue Details', {
            'fields': ('id', 'title', 'description', 'image')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'address')
        }),
        ('Classification', {
            'fields': ('category', 'status')
        }),
        ('Assignment', {
            'fields': ('created_by', 'assigned_to')
        }),
        ('Timeline', {
            'fields': ('created_at', 'updated_at', 'resolved_at'),
            'classes': ('collapse',)
        }),
    )
    
    actions = ['mark_as_pending', 'mark_as_in_progress', 'mark_as_resolved', 'mark_as_closed']
    
    def mark_as_pending(self, request, queryset):
        """Mark selected issues as pending."""
        count = queryset.update(status='pending')
        self.message_user(request, f"{count} issue(s) marked as pending.")
    mark_as_pending.short_description = "Mark as Pending"
    
    def mark_as_in_progress(self, request, queryset):
        """Mark selected issues as in progress."""
        count = queryset.update(status='in_progress')
        self.message_user(request, f"{count} issue(s) marked as in progress.")
    mark_as_in_progress.short_description = "Mark as In Progress"
    
    def mark_as_resolved(self, request, queryset):
        """Mark selected issues as resolved."""
        count = queryset.update(status='resolved')
        self.message_user(request, f"{count} issue(s) marked as resolved.")
    mark_as_resolved.short_description = "Mark as Resolved"
    
    def mark_as_closed(self, request, queryset):
        """Mark selected issues as closed."""
        count = queryset.update(status='closed')
        self.message_user(request, f"{count} issue(s) marked as closed.")
    mark_as_closed.short_description = "Mark as Closed"
