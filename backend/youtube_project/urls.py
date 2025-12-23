
from django.contrib import admin
from django.urls import path


# 追記
from django.conf.urls import include
from django.conf.urls.static import static
from django.conf import settings




urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('videos.urls')),  # api/にアクセスしたら、videosアプリのurls.pyに処理を任せる
    path('users/', include('users.urls')),
    # path('authen/', include('djoser.urls.jwt')),

    #  ここ重要
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),

]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
