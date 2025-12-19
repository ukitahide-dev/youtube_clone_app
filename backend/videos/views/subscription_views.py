from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response



from ..models import Subscription
from ..serializers import SubscriptionSerializer, UploaderSerializer
from users.models import User







class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all().order_by('-subscribed_at')
    serializer_class = SubscriptionSerializer   # 通常の CRUD用（list/retrieve/create/update/delete）” のデフォルトのserializer。
    permission_classes = [permissions.IsAuthenticated]


    # ログインユーザーの登録だけを返す。ログインユーザー自身が登録したサブスクのみを返す。これがないと、全ユーザーの全チャンネル登録情報 が返ってきてしまう。フロントで「このユーザーは登録してる？」を判定するときに、他人の登録まで混ざってしまい、バグ（登録してないのに「登録済み」と表示される）が起きやすくなる。
    def get_queryset(self):
        return Subscription.objects.filter(subscriber=self.request.user).order_by('-subscribed_at')


    # フロントからpostメソッド時に実行される。ModelViewSetの標準メソッドをオーバーライド。
    def perform_create(self, serializer):
        serializer.save(subscriber=self.request.user)  # 登録した人（subscriber）」をリクエスト送信者に自動でセット。React などフロントエンドから「誰をフォローするか（subscribed_to）」だけ送ればよくて、誰がフォローしたか（subscriber）」はサーバー側で自動的にセットされる。subscriber（誰がフォローしたか）は、必ずログイン中のユーザー（self.request.user）であるべき。だからフロントから送らせず、サーバー側で強制的にセットするのが安全。




    # 自分がフォローしてるチャンネル一覧を取得するための専用API
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_path='subscribed-channels')
    def subscribed_channels(self, request):
        user = request.user  # 現在ログイン中のユーザー

        channels = User.objects.filter(subscribers__subscriber=user).distinct()    # Subscriptionの中で、subscriber（登録した人）が自分になってるようなUser（＝登録された相手）」を探してる。
        serializer = UploaderSerializer(channels, many=True, context={'request': request})  # このカスタムメソッドが実行された場合は、UploaderSerializerが使われる。
        return Response(serializer.data, status=status.HTTP_200_OK)


