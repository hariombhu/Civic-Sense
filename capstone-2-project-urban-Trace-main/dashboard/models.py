from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Notification(models.Model):
    """
    Notification model for user alerts.
    Stores notifications for issues and system events.
    """
    NOTIFICATION_TYPES = (
        ('issue', 'Issue Update'),
        ('assignment', 'Issue Assignment'),
        ('system', 'System Message'),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='notifications',
        help_text="User receiving the notification"
    )
    notification_type = models.CharField(
        max_length=20,
        choices=NOTIFICATION_TYPES,
        default='system',
        help_text="Type of notification"
    )
    message = models.TextField(help_text="Notification message")
    is_read = models.BooleanField(default=False, help_text="Whether user has read this")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"Notification for {self.user.username} - {self.message[:50]}"

    def mark_as_read(self):
        """Mark notification as read."""
        self.is_read = True
        self.save()