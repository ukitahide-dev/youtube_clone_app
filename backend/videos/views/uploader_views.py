from rest_framework.response import Response
from rest_framework import viewsets, permissions, generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action


from ..models import (  Subscription
)

from ..serializers import UploaderDetailSerializer, UploaderSerializer

from users.models import User






#  userに関する処理を書く。
class UploaderViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]



    def get_serializer_class(self):
        if self.action == 'retrieve':
            return UploaderDetailSerializer
        return UploaderSerializer



    # チャンネル登録・解除を切り替える処理。チャンネルとは User のこと。だからチャンネル登録切り替えは UploaderViewSet に書く。
    @action(detail=True, methods=['post'], url_path='toggle-subscription')
    def toggle_subscription(self, request, pk=None):
        user = request.user   # ログイン中のユーザー(登録する側)
        uploader = self.get_object()   # pk で指定された「登録される側のユーザー」

        if user == uploader:
            return Response(
                {"detail": "自分自身をチャンネル登録することはできません。"},
                status=400
            )


        subscription, created = Subscription.objects.get_or_create(
            subscriber=user,
            subscribed_to=uploader,
        )


        if not created:  # すでに登録済み → 解除
            subscription.delete()
            is_subscribed=False
        else:
            is_subscribed=True


        # 登録者数を返す
        subscriber_count = Subscription.objects.filter(subscribed_to=uploader).count()

        return Response({
            "is_subscribed": is_subscribed,  # フロントにチャンネルの登録状態を返す
            "subscriber_count": subscriber_count  # フロントにチャンネルの登録数を返す
        })


