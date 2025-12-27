# アプリの設定ファイル。Djangoに「このアプリはこういう名前です」と教える
# 管理者をRender環境で自動作成する処理は apps.py に書く



from django.apps import AppConfig
from django.contrib.auth import get_user_model
from django.db.models.signals import post_migrate

import os


# DBのマイグレーションが全部終わったあとに、 管理者ユーザーが存在しなければ自動で1人作る

def create_superuser(sender, **kwargs):
    User = get_user_model()

    # Renderの環境変数を読む
    email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
    password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

    if not email or not password:
        return

    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(email=email, password=password)



class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        post_migrate.connect(create_superuser, sender=self)


