from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

from .models import Organization

User = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
    id = serializers.CharField(read_only=True)

    class Meta:
        model = Organization
        fields = (
            'id', 'name', 'email', 'contact_email', 'registration_id',
            'focus_area', 'description', 'verified', 'created_at',
        )
        read_only_fields = ('id', 'verified', 'created_at')


class OrganizationRegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    name = serializers.CharField(max_length=255)
    registration_id = serializers.CharField(max_length=100)
    focus_area = serializers.ChoiceField(choices=Organization.FOCUS_CHOICES)
    description = serializers.CharField(required=False, allow_blank=True)
    contact_email = serializers.EmailField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({'username': 'Username already taken'})
        if User.objects.filter(email__iexact=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'Email already registered'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        org_name = validated_data.pop('name')
        reg_id = validated_data.pop('registration_id')
        focus = validated_data.pop('focus_area')
        description = validated_data.pop('description', '')
        contact_email = validated_data.pop('contact_email', '')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=password,
            first_name=org_name,
            role='ngo',
        )

        organization = Organization.objects.create(
            name=org_name,
            email=validated_data['email'],
            contact_email=contact_email or validated_data['email'],
            registration_id=reg_id,
            focus_area=focus,
            description=description,
            user=user,
            verified=False,
        )
        return organization
