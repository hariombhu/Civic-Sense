import logging
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from issues.models import Issue
from .models import Notification

from config.mongo_utils import MongoDBHealthCheck

logger = logging.getLogger(__name__)


class HealthCheckView(APIView):
    """
    Health check endpoint for monitoring backend and MongoDB status.
    """
    permission_classes = []

    def get(self, request):
        """Perform system health check."""
        health = MongoDBHealthCheck.check()
        status_code = 200 if health['status'] == 'healthy' else 503
        return Response(health, status=status_code)


class StatsView(APIView):
    """
    API endpoint for dashboard statistics.
    Returns counts of issues by status.
    """
    permission_classes = []

    def get(self, request):
        """Get issue statistics."""
        try:
            stats = {
                "total": Issue.objects.count(),
                "pending": Issue.objects.filter(status='pending').count(),
                "in_progress": Issue.objects.filter(status='in_progress').count(),
                "resolved": Issue.objects.filter(status='resolved').count(),
                "closed": Issue.objects.filter(status='closed').count(),
            }
            return Response(stats)
        except Exception as e:
            logger.error(f"Error fetching stats: {e}")
            return Response(
                {"error": "Failed to fetch statistics"},
                status=500
            )


class NotificationView(APIView):
    """
    API endpoint for user notifications.
    Handles fetching and marking notifications as read.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Get user's unread notifications."""
        try:
            notifications = Notification.objects.filter(
                user=request.user,
                is_read=False
            ).order_by('-created_at')

            data = [
                {
                    "id": str(n.id),
                    "type": n.notification_type,
                    "message": n.message,
                    "created_at": n.created_at.isoformat()
                }
                for n in notifications
            ]
            return Response(data)
        except Exception as e:
            logger.error(f"Error fetching notifications: {e}")
            return Response(
                {"error": "Failed to fetch notifications"},
                status=500
            )

    def post(self, request):
        """Mark notification as read."""
        notification_id = request.data.get('notification_id')
        mark_all = request.data.get('mark_all', False)

        try:
            if mark_all:
                Notification.objects.filter(
                    user=request.user,
                    is_read=False
                ).update(is_read=True)
                return Response({"message": "All notifications marked as read"})
            elif notification_id:
                notification = Notification.objects.get(id=notification_id, user=request.user)
                notification.mark_as_read()
                return Response({"message": "Notification marked as read"})
            else:
                return Response(
                    {"error": "notification_id or mark_all is required"},
                    status=400
                )
        except Notification.DoesNotExist:
            return Response(
                {"error": "Notification not found"},
                status=404
            )
