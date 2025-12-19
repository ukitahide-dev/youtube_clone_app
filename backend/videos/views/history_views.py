
from rest_framework import viewsets, permissions, generics, serializers
from rest_framework.permissions import IsAuthenticated

from ..models import (
    Video, Comment, Favorite, Playlist, UploaderPlaylist,
    History,
)

from ..serializers import HistorySerializer





class HistoryViewSet(viewsets.ModelViewSet):
    queryset = History.objects.all().order_by('-watched_at')
    serializer_class = HistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
