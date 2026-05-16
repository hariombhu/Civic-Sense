import logging
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from django.contrib.auth import get_user_model
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Issue
from .serializers import IssueSerializer
from .email_utils import send_issue_report_email
from dashboard.models import Notification

User = get_user_model()
logger = logging.getLogger(__name__)


class IssueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing civic issues.
    
    Features:
    - Create, list, retrieve, update issues
    - Assign issues to authorities
    - Real-time WebSocket updates
    - Email notifications
    """
    queryset = Issue.objects.all().order_by('-created_at')
    serializer_class = IssueSerializer
    permission_classes = []
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filterset_fields = ('status', 'category', 'assigned_to')
    search_fields = ('title', 'description', 'address')
    ordering_fields = ('created_at', 'status', 'category')

    def perform_create(self, serializer):
        """Send email notification when issue is created."""
        issue = serializer.save()
        try:
            send_issue_report_email(issue)
        except Exception as e:
            logger.error(f"Failed to send email for issue {issue.id}: {e}")

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """
        Assign an issue to an authority.
        
        Expects: {'user_id': <user_id>}
        """
        issue = self.get_object()
        user_id = request.data.get('user_id')

        if not user_id:
            return Response(
                {"error": "user_id is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            authority = User.objects.get(id=user_id, role='authority')
            issue.assigned_to = authority
            issue.save()

            # Create notification for authority
            Notification.objects.create(
                user=authority,
                notification_type='assignment',
                message=f"Issue #{issue.id} - {issue.title} has been assigned to you"
            )

            # Send WebSocket update
            self._broadcast_issue_update(issue)

            return Response(
                {
                    "message": "Issue assigned successfully",
                    "assigned_to": authority.username
                }
            )
        except User.DoesNotExist:
            return Response(
                {"error": "Authority not found"},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the status of an issue.
        
        Expects: {'status': <status>}
        """
        issue = self.get_object()
        new_status = request.data.get('status')

        if not new_status:
            return Response(
                {"error": "status is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_status not in dict(Issue.STATUS_CHOICES):
            return Response(
                {"error": f"Invalid status. Choose from {[s[0] for s in Issue.STATUS_CHOICES]}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        old_status = issue.status
        issue.status = new_status

        if new_status == 'resolved':
            issue.mark_resolved()
        else:
            issue.save()

        # Notify the issue creator
        if issue.created_by:
            Notification.objects.create(
                user=issue.created_by,
                notification_type='issue',
                message=f"Issue #{issue.id} status updated from {old_status} to {new_status}"
            )

        # Broadcast update
        self._broadcast_issue_update(issue)

        return Response(
            {
                "message": "Status updated successfully",
                "new_status": new_status
            }
        )

    def _broadcast_issue_update(self, issue):
        """Broadcast issue update via WebSocket."""
        try:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "issues",
                {
                    "type": "send_issue_update",
                    "data": {
                        "id": str(issue.id),
                        "status": issue.status,
                        "title": issue.title,
                        "updated_at": issue.updated_at.isoformat()
                    }
                }
            )
        except Exception as e:
            logger.warning(f"Failed to broadcast WebSocket update: {e}")
