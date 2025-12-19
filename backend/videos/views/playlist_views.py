from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404


from ..models import Playlist, Video, UploaderPlaylist
from ..serializers import (
    PlaylistSerializer, PlaylistUpdateSerializer,
    UploaderPlaylistSerializer
)





class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all().order_by('-created_at')
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]


    # GET /api/playlists/   DRF の ModelViewSet.list() が呼ばれる。その中で self.get_queryset() が実行される。そのクエリセットを serializer_class (PlaylistSerializer) に渡してシリアライズ。JSON がレスポンスとして返る。React の res.data に入る。
    def get_queryset(self):
        return Playlist.objects.filter(user=self.request.user).order_by('-created_at')  #  ログイン中ユーザーのプレイリストだけ返す


    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:  # フロントからhttpで、PUTかPATCHで通信された場合
            return PlaylistUpdateSerializer
        else:
            return PlaylistSerializer



    # POST api/playlists/ で新規プレイリスト作成するときに実行される。
    def perform_create(self, serializer):   # perform_create は、DRF の ModelViewSet が持ってる標準のフックメソッド。
        serializer.save(user=self.request.user)   # serializer.save() は DB に新しいレコードを保存する処理。引数 user=self.request.user を渡すことで、プレイリストの user フィールドには、リクエストを送ってきたログインユーザーを自動でセットする。



    # プレイリストに動画を追加、削除する処理
    @action(detail=True, methods=['post'], url_path='toggle-video')
    def toggle_video(self, request, pk=None):
        playlist = self.get_object()    # self.get_object() は、URLに含まれる pk をもとに Playlist オブジェクトを取得するDRFの関数。URLの pk から対象の Playlist オブジェクトを取得。/playlists/3/add-video/ なら id=3 のプレイリストが playlist に入る。
        video_id = request.data.get('video_id')    # フロントから送られた POST データから video_id を取り出す。どの動画を追加、削除するかを指定するため。

        try:
            video = Video.objects.get(id=video_id)  # そのIDの動画が存在するかチェック。
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=404)


        if playlist.videos.filter(id=video_id).exists():
            playlist.videos.remove(video)
            return Response({'status': 'removed', 'playlist_id': playlist.id, 'video_id': video_id})
        else:
            playlist.videos.add(video)  # プレイリストの videos（ManyToManyフィールド）に動画を追加。プレイリストに動画を追加
            return Response({'status': 'added', 'playlist_id': playlist.id, 'video_id': video_id})




# 投稿用プレイリスト
class UploaderPlaylistViewSet(viewsets.ModelViewSet):
    queryset = UploaderPlaylist.objects.all().order_by('-created_at')
    serializer_class = UploaderPlaylistSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        # GET /uploader-playlists/<id>/ の場合 → どのユーザーの playlist でも閲覧可。retrieve は GET /uploader-playlists/<pk>/ のときだけ発動する。つまり 全 UploaderPlaylist を対象にして、その中から pk に一致する1件を取得する という動作になる。
        if self.action == 'retrieve':
            return UploaderPlaylist.objects.all()

        # GET /uploader-playlists/ の一覧 → 自分のプレイリストのみ
        return UploaderPlaylist.objects.filter(uploader=self.request.user)




    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)




    @action(detail=True, methods=['post'], url_path='toggle-video', permission_classes=[permissions.IsAuthenticated])
    def toggle_video(self, request, pk=None):
        playlist = self.get_object()
        video_id = request.data.get('video_id')

        # 自分のプレイリストかチェック
        if playlist.uploader != request.user:
            return Response({'error': '他人のプレイリストは編集できません'}, status=403)

        try:
            video = Video.objects.get(id=video_id)
        except Video.DoesNotExist:
            return Response({'error': 'Video not found'}, status=404)


        # 自分の動画しか追加できない制約
        if video.uploader != request.user:
            return Response({'error': '他人の動画は追加できません'}, status=403)


        if playlist.videos.filter(id=video_id).exists():
            playlist.videos.remove(video)
            return Response({'status': 'removed', 'playlist_id': playlist.id, 'video_id': video_id})
        else:
            playlist.videos.add(video)
            return Response({'status': 'added', 'playlist_id': playlist.id, 'video_id': video_id})







