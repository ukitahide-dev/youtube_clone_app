# Reactから叩かれるURLと、呼び出すビュー（VideoDetailAPIViewなど）を紐づける場所
# このurlにアクセスしたら、このviewを実行しろと指令を出す場所。


from rest_framework import routers
from django.urls import path
from django.conf.urls import include
from . import views




from rest_framework.routers import DefaultRouter
from .views import (
    VideoViewSet, CommentViewSet, PlaylistViewSet, LikedVideosViewSet,
    HistoryViewSet, SubscriptionViewSet, CommentReactionViewSet,
    UploaderViewSet, UploaderPlaylistViewSet, ChannelAnalyticsViewSet,
    CategoryViewSet, TagViewSet,
)



router = DefaultRouter()    # DRF の Routers（ルーター）を使うと、自動でurlを生成してくれる。
router.register(r'videos', VideoViewSet)   # エンドポイントの先頭部分を /videos/ にする。あとは DRF が自動で /videos/ に色んなルートを生やしてくれる。
router.register(r'comments', CommentViewSet)
router.register(r'playlists', PlaylistViewSet)
router.register(r'history', HistoryViewSet)
router.register(r'subscriptions', SubscriptionViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'comment-reactions', CommentReactionViewSet)
router.register(r'liked-videos', LikedVideosViewSet, basename='liked-videos')
router.register(r'uploaders', UploaderViewSet, basename='uploader')
router.register(r'uploader-playlists', UploaderPlaylistViewSet)
router.register(r'analytics/channel', ChannelAnalyticsViewSet, basename='channel-analytics')


urlpatterns = router.urls  # これで router が生成した全ての URL パターンを Django に登録する。結果として、React から /api/videos/ や /api/videos/<id>/like/ などにアクセスできる。



# routerを使うと、こんなurlが自動生成される

# POST /videos/ → 動画投稿（ログイン必須）
# GET /videos/ → 動画一覧（誰でも可）
# GET /videos/<id>/ → 動画詳細
# PUT /videos/<id>/ → 動画編集（投稿者のみ）
# DELETE /videos/<id>/ → 動画削除（投稿者のみ）
