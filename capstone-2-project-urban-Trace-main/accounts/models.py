from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Extended User model for UrbanTrace.
    Supports different roles: citizen, authority, and admin.
    """
    ROLE_CHOICES = (
        ('citizen', 'Citizen'),
        ('authority', 'Authority'),
        ('admin', 'Admin'),
        ('ngo', 'NGO / Organisation'),
    )
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='citizen',
        help_text="User role in the UrbanTrace system"
    )
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Organization(models.Model):
    """Registered NGO / organisation — pending until authority verifies."""

    FOCUS_CHOICES = (
        ('civic', 'Civic Rights'),
        ('environment', 'Environment'),
        ('infrastructure', 'Infrastructure'),
        ('welfare', 'Welfare'),
    )

    name = models.CharField(max_length=255)
    email = models.EmailField()
    contact_email = models.EmailField(blank=True)
    registration_id = models.CharField(max_length=100)
    focus_area = models.CharField(max_length=50, choices=FOCUS_CHOICES, default='civic')
    description = models.TextField(blank=True)
    verified = models.BooleanField(default=False)
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='organization_profile',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({'verified' if self.verified else 'pending'})"