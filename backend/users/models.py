from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid
from django.conf import settings



# create_user メソッドは、Django のカスタムユーザーモデルで「通常のユーザー」を登録（作成）する関数。
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields): # 通常のユーザー（一般ユーザー）を作成するメソッド。email と password を受け取り、user を作成して保存。extra_fields はオプションのフィールド（たとえば username, first_name など）を渡せる。**extra_fields は、Python の関数引数の一種で、「その他のキーワード引数をまとめて受け取る」**ための仕組み。このケースでは、User モデルの email や password 以外のフィールドを受け取るために使われている。
        if not email:  # メールが無ければエラー。Django のデフォルトユーザーは username を使うけど、このアプリは email を代わりに使ってる。
            raise ValueError('Email address is must')

        user = self.model(email=self.normalize_email(email), **extra_fields) # User モデルのインスタンスを作る。self.normalize_email(email) は Django のユーティリティ関数で、メールの大文字を小文字に変換したりして整形してくれる。
        user.set_password(password)  # set_password() を使うと、ハッシュ化された安全なパスワードとして保存してくれる。
        user.save(using=self._db)
        return user


    def create_superuser(self, email, password):  # python manage.py createsuperuserをターミナルで書いたときに、内部的にこの create_superuser() 関数が呼ばれる。
        user = self.create_user(email, password)  # まず、普通のユーザーを作る（create_user() を呼び出してる）。この時点では is_staff=False, is_superuser=False の一般ユーザー。
        user.is_staff = True   # is_staff=True → 管理画面に入れる権限
        user.is_superuser = True  # is_superuser=True → 全権限を持つ「神モード」
        user.save(using=self._db)  # ユーザーの変更内容をデータベースに保存
        return user






class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False) # ユーザーのIDにUUID（ユニークな識別子）を使っている。セキュリティや一意性の観点から、推測しにくい ID にしたいときに便利。連番（1, 2, 3...）だとユーザーの合計数や順番がバレるリスクがある。
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, blank=True)   # ユーザー名を保存するフィールド（任意）。空でもOK。


    is_active = models.BooleanField(default=True)  # アカウントの有効・無効を判定するフラグ。
    is_staff = models.BooleanField(default=False)  # 管理サイトにアクセスできるかどうかを示すフラグ。

    objects = UserManager()  # このモデル専用のマネージャー（UserManager クラス）を指定している。User.objects.create_user(...) やUser.objects.create_superuser(...)などで呼び出される処理を、この UserManager に委ねる、という意味。
    USERNAME_FIELD = 'email' # Djangoに「認証に使うフィールドは email ですよ」と教えている。

    # ローカル(開発)用
    profile_icon = models.ImageField(upload_to='profile-icons/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='profile-covers/', blank=True, null=True)

    # render(本番)用
    profile_icon_url = models.URLField(blank=True, null=True)
    cover_image_url = models.URLField(blank=True, null=True)


    def __str__(self):
        return self.email
