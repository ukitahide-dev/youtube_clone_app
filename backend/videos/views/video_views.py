# views.pyの役割:「APIの中身（＝どんな処理をするか）」を決める場所


from datetime import timedelta
from django.core.exceptions import ValidationError


from rest_framework import viewsets, permissions, serializers, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.utils import timezone




from ..models import Video, Like, History, Subscription, Favorite
from ..serializers import VideoSerializer, VideoDetailSerializer
from ..permissions import IsVideoOwnerOrReadOnly





# 新着順で動画を一覧取得できるAPI。動画の投稿・編集・削除ができるAPI（ログインユーザーのみ）。
class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all().order_by('-uploaded_at')  # 用途：一覧取得や retrieve の対象データを決める。動画投稿自体には直接関係しない。このViewSetは Video モデルを扱います宣言。どの動画を対象にするか。Video.objects.all() → すべての動画を取得。.order_by('-uploaded_at') → アップロード日時の新しい順に並び替え。つまり、「動画を新着順で一覧に出す」 ということ。
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsVideoOwnerOrReadOnly]  # 誰がアクセスできるか決める。これは「アクセス権限（誰がこのAPIを使えるか）」を定義。ログインしてない人（匿名ユーザー）読み取り（GET）だけできる。ログインしている人は書き込み（POST、PUT、DELETEなど）もできる。つまり、誰でも動画を見ることはできるけど、動画を投稿・編集・削除できるのはログインユーザーだけ という仕様。
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description', 'uploader__username']



    # このViewSetで使うシリアライザを返すメソッド。get_serializer_class() は 「どのクラスを使うかを返すだけ。ModelViewSetの親が標準で持っているget_serializer_classメソッドをオーバーライドしてる。VideoViewSetから見ると、親の親つまり、じっちゃん。
    def get_serializer_class(self):  # 用途：どのシリアライザで JSON を返すか決める。
        if self.action == 'retrieve':  # retrieve（1本の動画詳細取得）は VideoDetailSerializer。DRFでは VideoViewSet を router.register('videos', VideoViewSet) でルーティングしていると、/videos/<pk>/ に GET リクエストが来ると自動的に retrieve メソッド が呼ばれる。
            print('VideoDetailSerializerがVideoViewSetから返された')
            return VideoDetailSerializer   # returnで、このクラスを使ってくださいと DRF に伝えているだけ。実際の JSON 生成や保存処理は、その後 DRF が自動的に呼ぶ serializer = serializer_class(...) で実行。

        return VideoSerializer




    # 新しい動画を作るときに自動で呼ばれる特別なメソッド。フロントから POST リクエストが送られて呼ばれる。
    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(uploader=self.request.user)  # ログインユーザーを自動で投稿者にセット。DBに保存される。
        else:
            raise ValidationError("ログインしていないため、動画を投稿できません")



    # 再生数 + 履歴追加API
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])   # VideoPlayerSection.jsxから呼ばれる
    def increment_views(self, request, pk=None):
        video = self.get_object()
        user = request.user

        # --- 再生数（views）の不正防止  直近1時間以内に同じユーザーが同じ動画を視聴していないか確認する処理---
        recent_watch = History.objects.filter(
            user=user, video=video,
            watched_at__gte=timezone.now() - timedelta(hours=1)
        ).exists()


        if not recent_watch:
            video.views += 1  # video.viewsは視聴者用の再生数表示。信頼性優先だから、不正な連続再生をはじく。
            video.save(update_fields=['views'])


        # --- 履歴は毎回作成 履歴は行動・傾向分析重視だから短時間内の連続再生もすべて記録する。 ---
        watch_duration = int(request.data.get('watch_duration', 0))

        History.objects.create(
            user=user,
            video=video,
            watch_duration=watch_duration
        )



        return Response(
            {'message': 'View count incremented', 'views': video.views},
        )




    # いいねAPI
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def like(self, request, pk=None):
        video = self.get_object()
        user = request.user

        if video.uploader == user:
            raise serializers.ValidationError("自分の動画はリアクションできません。")

        like_obj, created = Like.objects.get_or_create(  # 検索条件に該当する場合、Likeモデルからその1レコードを取得する。該当しない場合、1レコードを新しく作る。
            user=user,
            video=video,
            defaults={'is_liked': True}  # ← これがないと新規作成時にNOT NULL違反になる
        )

        if not created:  # すでに対象のレコードが存在する場合。つまり新規作成でない場合。
            if like_obj.is_liked:  # is_likedカラムがtrueの場合。つまり、いいねをしていた場合。
                like_obj.delete()  # Likeモデルからそのレコードを削除する。
                video.like = max(video.like - 1, 0)
            else:  # is_likedカラムがfalseの場合。つまり、わるいねをしていた場合。
                like_obj.is_liked = True
                like_obj.save()
                video.like += 1
                video.dislike = max(video.dislike - 1, 0)
        else:
            video.like += 1

        video.save()


        return Response({
            'liked': True,
            'like_count': video.like,
            'dislike_count': video.dislike,
        })



    # わるいねAPI
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def dislike(self, request, pk=None):
        video = self.get_object()
        user = request.user

        if video.uploader == user:
            raise serializers.ValidationError("自分の動画にはリアクションできません。")


        like_obj, created = Like.objects.get_or_create(
            user=user,
            video=video,
            defaults={'is_liked': False}  # ← これがないと新規作成時にNOT NULL違反になる
        )

        if not created:
            if not like_obj.is_liked:
                like_obj.delete()
                video.dislike = max(video.dislike - 1, 0)
            else:
                like_obj.is_liked = False
                like_obj.save()
                video.dislike += 1
                video.like = max(video.like - 1, 0)
        else:
            video.dislike += 1

        video.save()


        return Response({
            'disliked': not like_obj.is_liked,
            'like_count': video.like,
            'dislike_count': video.dislike,
        })



    # 登録チャンネル一覧API。自分が登録したチャンネル(ユーザー)の動画を取得する。   services/videos.jsxから呼ばれる。
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def subscribed_videos(self, request):

        user = request.user   # 今ログインしているユーザーを取得。
        subscribed_users = Subscription.objects.filter(subscriber=user).values_list('subscribed_to', flat=True)
        videos = Video.objects.filter(uploader__in=subscribed_users).order_by('-uploaded_at')
        serializer = self.get_serializer(videos, many=True, context={'request': request})

        return Response(serializer.data)



    # お気に入りトグルAPI
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated]) # detail=Trueで/videos/<uuid>/toggle_favorite/というurlが自動で生成される
    def toggle_favorite(self, request, pk=None):
        video = self.get_object()  # URLに入っている <uuid> を使って、対象の動画（Videoモデル）をデータベースから1つ取り出す。Django REST Framework（DRF）では、ViewSet の中で self.get_object() を呼ぶと：video = Video.objects.get(pk=uuid)と 同じこと をしてくれる。
        user = request.user # 今リクエストを送ってきたユーザーを取得。request.user は Django の認証システムによって、自動的に「ログイン中のユーザー」が入ってくる。

        favorite, created = Favorite.objects.get_or_create(user=user, video=video) # すでにお気に入りがあればそれを取得。なければ新しく作るという 取得＋作成のワンセット処理。favorite：取得または作成された Favorite オブジェクトが入る。created：新しく作られたなら True、既存なら(対象の動画がすでにお気に入り登録済みなら) Falseが入る。

        if not created: # すでにお気に入りに登録していた場合: createdはFalse。
            favorite.delete()  # Favorite テーブルの中から、指定された行（userとvideoの組み合わせ）を物理的に削除する。
            return Response({'favorited': False})  # クライアント（Reactなど）に返す「JSONレスポンス」を定義している。お気に入りを外しましたよ！今はお気に入り状態ではありません」ということをフロント（React）に伝えている。フロント（React）はこのレスポンスを使って：favorited: false → ハートをグレーに戻す。favorited: true → ハートを赤く塗る。などの UI変更のトリガー に使う。

        return Response({'favorited': True})




    # 自分が投稿した動画一覧を取得するAPI
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='my-videos')
    def my_videos(self, request):
        user = request.user
        videos = Video.objects.filter(uploader=user).order_by('-uploaded_at')
        serializer = self.get_serializer(videos, many=True, context={'request': request})
        return Response(serializer.data)



    # 関連動画を表示するAPI
    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated])
    def related_videos(self, request, pk=None):
        video = self.get_object()   # URLに入っている <uuid> を使って、対象の動画（Videoモデル）をデータベースから1つ取り出す。Django REST Framework（DRF）では、ViewSet の中で self.get_object() を呼ぶと：video = Video.objects.get(pk=uuid)と 同じこと をしてくれる。

        # 現在の動画と同じカテゴリの動画を全部取得する
        queryset = Video.objects.filter(category=video.category)  # 左辺の category は Video モデルのフィールド名。右辺の video.category は、現在再生中の動画のカテゴリを取得している。

        # カテゴリ一致 queryset に、タグ一致の動画も追加している
        if video.tags.exists():
            queryset = (queryset | Video.objects.filter(tags__in=video.tags.all()))

        queryset = queryset.exclude(id=video.id).distinct()  # 自分自身を関連動画リストから外す。
        queryset = queryset.order_by('-uploaded_at')

        serializer = VideoSerializer(queryset, many=True, context={'request': request})  # querysetは関連動画のQuerySet（複数の Video インスタンス）。many=True は「複数オブジェクトをシリアライズする」ことを指定。複数件の QuerySet を渡すと、リスト形式で JSON に変換される。
        return Response(serializer.data)





class LikedVideosViewSet(viewsets.ModelViewSet):
    serializer_class = VideoSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        user = self.request.user
        liked_video_ids = Like.objects.filter(user=user, is_liked=True).values_list('video_id', flat=True)
        return Video.objects.filter(id__in=liked_video_ids).order_by('-uploaded_at')
