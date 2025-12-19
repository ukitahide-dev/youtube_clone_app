from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.permissions import BasePermission, SAFE_METHODS




class IsFieldOwnerOrReadOnly(BasePermission):
    owner_field = 'user'

    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:  # SAFE_METHODS とは → ('GET', 'HEAD', 'OPTIONS') のこと。つまり、読み取り系のリクエストは誰でも許可するって意味。
            return True

        owner = getattr(obj, self.owner_field)
        return owner == request.user




class IsVideoOwnerOrReadOnly(IsFieldOwnerOrReadOnly):
    owner_field = 'uploader'



class IsCommentOwnerOrReadOnly(IsFieldOwnerOrReadOnly):
    owner_field = 'user'




