import logging
from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import escape

logger = logging.getLogger(__name__)


def send_issue_report_email(issue):
    """
    Send email notification when a new issue is reported.
    
    Args:
        issue: Issue instance to notify about
    """
    # Skip email if no recipient configured
    if not settings.REPORT_RECIPIENT_EMAIL:
        logger.info(f"Skipping email for Issue #{issue.id} - no recipient configured")
        return

    category_labels = {
        'road': '🛣️ Road Damage',
        'sanitation': '🗑️ Sanitation Issue',
        'electricity': '⚡ Electricity Problem',
        'water': '💧 Water Supply Issue',
        'other': '❓ Other Issue',
    }
    category_display = category_labels.get(issue.category, issue.category.title())

    subject = f"[UrbanTrace] New Issue Reported — {category_display} | #{issue.id}"

    # Create HTML email
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #1a73e8; border-bottom: 2px solid #1a73e8; padding-bottom: 10px;">
                    UrbanTrace — Issue Alert
                </h2>
                
                <p>A new civic issue has been submitted and requires attention.</p>
                
                <h3 style="color: #1a73e8;">Issue Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #f5f5f5;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Issue ID</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">#{issue.id}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Title</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{escape(issue.title)}</td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Category</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{category_display}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Status</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">
                            <span style="background-color: #fff3cd; padding: 5px 10px; border-radius: 3px;">Pending Review</span>
                        </td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Reported At</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{issue.created_at.strftime("%d %B %Y, %I:%M %p")}</td>
                    </tr>
                </table>
                
                <h3 style="color: #1a73e8;">Description</h3>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1a73e8;">
                    {escape(issue.description)}
                </p>
                
                <h3 style="color: #1a73e8;">Location</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr style="background-color: #f5f5f5;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Latitude</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{issue.latitude}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Longitude</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{issue.longitude}</td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Address</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{escape(issue.address) if issue.address else 'N/A'}</td>
                    </tr>
                </table>
                
                <p style="margin-top: 20px;">
                    <a href="https://www.google.com/maps?q={issue.latitude},{issue.longitude}" 
                       style="display: inline-block; padding: 10px 20px; background-color: #1a73e8; color: white; text-decoration: none; border-radius: 5px;">
                        View on Map
                    </a>
                </p>
                
                <h3 style="color: #1a73e8;">Action Required</h3>
                <p style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #4caf50;">
                    Please review and assign this issue to the concerned department at the earliest 
                    to avoid further inconvenience to citizens.
                </p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                
                <p style="color: #999; font-size: 12px; text-align: center;">
                    This is an automated alert from UrbanTrace Civic Portal.<br>
                    Do not reply to this email.
                </p>
            </div>
        </body>
    </html>
    """

    plain_text_message = f"""
UrbanTrace — Issue Alert
{'=' * 50}

A new civic issue has been submitted and requires attention.

Issue Details:
- Issue ID: #{issue.id}
- Title: {issue.title}
- Category: {category_display}
- Status: Pending Review
- Reported At: {issue.created_at.strftime("%d %B %Y, %I:%M %p")}

Description:
{issue.description}

Location:
- Latitude: {issue.latitude}
- Longitude: {issue.longitude}
- Address: {issue.address if issue.address else 'N/A'}
- View on Map: https://www.google.com/maps?q={issue.latitude},{issue.longitude}

Action Required:
Please review and assign this issue to the concerned department at the earliest 
to avoid further inconvenience to citizens.

{'=' * 50}
This is an automated alert from UrbanTrace Civic Portal.
Do not reply to this email.
"""

    try:
        send_mail(
            subject=subject,
            message=plain_text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.REPORT_RECIPIENT_EMAIL],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"✅ Email sent successfully for Issue #{issue.id}")
    except Exception as e:
        logger.error(f"❌ Failed to send email for Issue #{issue.id}: {e}", exc_info=True)


def send_status_update_email(issue, old_status):
    """
    Send email notification when issue status is updated.
    
    Args:
        issue: Issue instance
        old_status: Previous status
    """
    if not issue.created_by or not issue.created_by.email:
        return

    subject = f"[UrbanTrace] Issue #{issue.id} Status Updated"
    
    message = f"""
Your reported issue has been updated!

Issue: {issue.title}
Previous Status: {old_status.upper()}
New Status: {issue.status.upper()}
Updated At: {issue.updated_at.strftime("%d %B %Y, %I:%M %p")}

View Issue: https://urbantrace.local/issues/{issue.id}

Thank you for helping improve our city!

This is an automated notification from UrbanTrace Civic Portal.
"""

    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[issue.created_by.email],
            fail_silently=False,
        )
        logger.info(f"✅ Status update email sent for Issue #{issue.id}")
    except Exception as e:
        logger.error(f"❌ Failed to send status update email for Issue #{issue.id}: {e}")