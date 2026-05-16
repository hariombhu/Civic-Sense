from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Issue

User = get_user_model()


class UserSimpleSerializer(serializers.ModelSerializer):
    """Simplified user serializer for nested use."""
    id = serializers.CharField(read_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role')
        read_only_fields = fields


class IssueSerializer(serializers.ModelSerializer):
    """
    Serializer for Issue model.
    Provides nested user data and validates image uploads.
    """
    id = serializers.CharField(read_only=True)
    created_by = UserSimpleSerializer(read_only=True)
    assigned_to = UserSimpleSerializer(read_only=True)
    created_by_id = serializers.CharField(write_only=True, required=False)
    assigned_to_id = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Issue
        fields = (
            'id', 'title', 'description', 'image',
            'latitude', 'longitude', 'address',
            'category', 'status',
            'created_by', 'created_by_id',
            'assigned_to', 'assigned_to_id',
            'created_at', 'updated_at', 'resolved_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'resolved_at')

    def validate_latitude(self, value):
        """Validate latitude is within valid range."""
        if not -90 <= value <= 90:
            raise serializers.ValidationError("Latitude must be between -90 and 90")
        return value

    def validate_longitude(self, value):
        """Validate longitude is within valid range."""
        if not -180 <= value <= 180:
            raise serializers.ValidationError("Longitude must be between -180 and 180")
        return value

    def create(self, validated_data):
        """Create issue and handle user assignment."""
        created_by_id = validated_data.pop('created_by_id', None)
        assigned_to_id = validated_data.pop('assigned_to_id', None)

        issue = Issue.objects.create(**validated_data)

        if created_by_id:
            try:
                issue.created_by = User.objects.get(id=created_by_id)
            except User.DoesNotExist:
                pass

        if assigned_to_id:
            try:
                issue.assigned_to = User.objects.get(id=assigned_to_id)
            except User.DoesNotExist:
                pass

        issue.save()
        return issue
