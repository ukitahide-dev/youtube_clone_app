from django.shortcuts import render



from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response


from .serializers import UserSerializer



# Create your views here.


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

