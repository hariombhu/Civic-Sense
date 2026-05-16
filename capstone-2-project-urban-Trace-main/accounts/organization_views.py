import logging

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Organization
from .organization_serializers import OrganizationSerializer, OrganizationRegisterSerializer

logger = logging.getLogger(__name__)


class OrganizationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    List organisations and handle registration / verification.
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new organisation (stored as pending until verified)."""
        serializer = OrganizationRegisterSerializer(data=request.data)
        if serializer.is_valid():
            org = serializer.save()
            return Response(
                {
                    'message': 'Organisation registered successfully. Awaiting authority verification.',
                    'organization': OrganizationSerializer(org).data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Mark an organisation as verified (authority action)."""
        org = self.get_object()
        org.verified = True
        org.save(update_fields=['verified'])
        return Response({
            'message': 'Organisation verified',
            'organization': OrganizationSerializer(org).data,
        })
