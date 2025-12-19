from django.urls import path
from . import views
from django.conf.urls import include
from rest_framework_simplejwt.views import TokenBlacklistView
from .views import CreateUserView, UserMeView



urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create'),
    path('me/', UserMeView.as_view(), name='me'),
    path('logout/', TokenBlacklistView.as_view(), name='logout'),  # SimpleJWT が用意してる TokenBlacklistView クラスを呼び出す。TokenBlacklistView の役割は、受け取った Refresh Token をブラックリストに入れて無効化すること。→ つまりログアウト API。

]
