from django.shortcuts import render



from rest_framework import viewsets, generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response


from .serializers import UserSerializer





# 新規ユーザー登録用のview。CreateAPIView は「新規作成用の汎用 View」。
class CreateUserView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)  # 誰でもアクセス可能（ログインしていない状態でも登録できる）




# 自分のユーザー情報を返すView。今ログインしているユーザーの情報を返すAPI。
class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)  # request.user → Django が自動でセットするログイン中ユーザー。
        return Response(serializer.data)  # JSON としてフロントに返す。React 側では axios.get('/users/me/') でこれを受け取れる。




# ファイルアップロード(開発用)
class UpdateProfileIconView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        file = request.FILES.get('profile_icon')

        if not file:
            return Response(
                {'error': 'profile_icon is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.profile_icon = file
        user.profile_icon_url = None
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)




# URL入力(本番用)
class UpdateProfileIconByUrlView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        url = request.data.get('profile_icon_url')

        if not url:
            return Response(
                {'error': 'profile_icon_url is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.profile_icon_url = url
        user.profile_icon = None
        user.save()

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)
