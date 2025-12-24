# アプリの設定ファイル。Djangoに「このアプリはこういう名前です」と教える
# 管理者をRender環境で自動作成する処理は apps.py に書く



from django.apps import AppConfig
from django.db.utils import OperationalError
from django.contrib.auth import get_user_model
import os



class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    # アプリ起動時に1回だけ実行される処理を書く場所（初期化や自動処理）。readyメソッド。
    def ready(self):
        User = get_user_model()

        # Renderの環境変数を読む
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not email or not password:
            return

        try:
            if not User.objects.filter(email=email).exists():
                User.objects.create_superuser(email=email, password=password)
        except OperationalError:
            # マイグレーション前はスキップ
            pass
