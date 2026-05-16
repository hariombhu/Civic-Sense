from rest_framework.permissions import BasePermission


class IsCitizen(BasePermission):
    """Permission check for citizen role."""
    message = "You must be a citizen to perform this action."
    
    def has_permission(self, request, view):
        """Check if user has citizen role."""
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'citizen'
        )


class IsAuthority(BasePermission):
    """Permission check for authority role."""
    message = "You must be an authority to perform this action."
    
    def has_permission(self, request, view):
        """Check if user has authority role."""
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'authority'
        )


class IsAdmin(BasePermission):
    """Permission check for admin role."""
    message = "You must be an admin to perform this action."
    
    def has_permission(self, request, view):
        """Check if user is admin."""
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.role == 'admin'
        )


class IsIssueCreatorOrAuthority(BasePermission):
    """Permission to edit issue only if creator or assigned authority."""
    message = "You can only edit your own issues or issues assigned to you."
    
    def has_object_permission(self, request, view, obj):
        """Check if user can edit the object."""
        return (
            obj.created_by == request.user or 
            obj.assigned_to == request.user or 
            request.user.role == 'admin'
        )
