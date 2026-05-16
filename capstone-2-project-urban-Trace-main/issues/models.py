from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class Issue(models.Model):
    """
    Civic issue model for UrbanTrace.
    Represents reported issues by citizens and tracked by authorities.
    """
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    )

    CATEGORY_CHOICES = (
        ('road', 'Road Damage'),
        ('sanitation', 'Sanitation'),
        ('electricity', 'Electricity'),
        ('water', 'Water Supply'),
        ('other', 'Other'),
    )

    # Issue Details
    title = models.CharField(max_length=255, help_text="Brief title of the issue")
    description = models.TextField(help_text="Detailed description of the issue")
    image = models.ImageField(
        upload_to='issues/%Y/%m/%d/',
        null=True,
        blank=True,
        help_text="Image evidence of the issue"
    )

    # Location Information
    latitude = models.FloatField(help_text="Geographic latitude")
    longitude = models.FloatField(help_text="Geographic longitude")
    address = models.CharField(
        max_length=255,
        blank=True,
        help_text="Street address of the issue location"
    )

    # Classification
    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES,
        default='other',
        help_text="Category of the issue"
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Current status of the issue"
    )

    # User References (Anonymous submissions allowed)
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reported_issues',
        help_text="User who reported this issue"
    )
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_issues',
        help_text="Authority assigned to this issue"
    )

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['category', 'status']),
        ]

    def __str__(self):
        return f"#{self.id} - {self.title} ({self.status})"

    def mark_resolved(self):
        """Mark the issue as resolved with timestamp."""
        self.status = 'resolved'
        self.resolved_at = timezone.now()
        self.save()
