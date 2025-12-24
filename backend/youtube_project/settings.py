
from pathlib import Path

# 追記
import os
from datetime import timedelta

import dj_database_url
from dotenv import load_dotenv


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent  #  今のファイルの場所から2階層上（backend）のパスを取得。つまり：backend フォルダのパス。


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/6.0/howto/deployment/checklist/



# ----追記 .envから読み込む----
load_dotenv(BASE_DIR / ".env")

# .envに書いた合鍵を読み込む
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG") == "True"


# ----ALLOWED_HOSTS-----
# Django「このURLからのアクセスだけ信用する」。
ALLOWED_HOSTS = os.getenv(
    "ALLOWED_HOSTS",
    "localhost,127.0.0.1,.onrender.com"
).split(",")



# ----CORS----
# 開発中（DEBUG=True）。全部許す。ローカル開発用（Vite / React / localhost）
if DEBUG:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
# .env / Render環境変数 に書いたURLだけ許す。本番用（Render）
else:
    CORS_ALLOW_ALL_ORIGINS = False
    CORS_ALLOWED_ORIGINS = os.getenv(
        "CORS_ALLOWED_ORIGINS",
        ""
    ).split(",")
    CORS_ALLOW_CREDENTIALS = True




# RenderのURLからの「ログイン操作」を信用する。なりすまし攻撃を防ぐための最終関門。
CSRF_TRUSTED_ORIGINS = [
    "https://*.onrender.com",
]





# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # 追記
    # 外部パッケージ
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    'djoser',   # ユーザー認証まわりをほぼ全部用意してくれるライブラリ



    # 自作アプリ
    'users',
    'videos',
]



# 追記
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,   # 任意。登録時にパスワード確認を追加できる
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserSerializer',  # カスタムUserSerializerを使う
        'user': 'users.serializers.UserSerializer',
    },
}



# 追記  Django で「独自のユーザーモデルを使うときに必要になる設定」。
AUTH_USER_MODEL = 'users.User'  #  Django、ユーザーモデルは users アプリ内の User クラスを使う。


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # 追記
    'django.middleware.common.CommonMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]




ROOT_URLCONF = 'youtube_project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'youtube_project.wsgi.application'


# 追記  API にアクセスするためのルール（誰が・どうやってアクセスできるか）を定める設定
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',  # 全ての API がログイン必須 になる。
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',  # JWT（JSON Web Token）を使って認証するという意味。
    ],
}


# 追記 「JWT認証トークンのルール」を細かく設定
# 開発用
if DEBUG:
    SIMPLE_JWT = {
        'AUTH_HEADER_TYPES': ('Bearer',),  # これは、HTTPリクエストのヘッダーで、どんな形式でトークンを送るかを指定する。
        'ACCESS_TOKEN_LIFETIME': timedelta(hours=24), # JWTのアクセストークンの有効期限。1日。
    }
# 本番用
else:
    SIMPLE_JWT = {
        'AUTH_HEADER_TYPES': ('Bearer',),
        'ACCESS_TOKEN_LIFETIME': timedelta(minutes=30),  # 30分
        'REFRESH_TOKEN_LIFETIME': timedelta(days=7),     # 7日
    }


# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases


DATABASES = {
    "default": dj_database_url.config(
        default=f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
    )
}




# Password validation
# https://docs.djangoproject.com/en/6.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/6.0/topics/i18n/

LANGUAGE_CODE = 'ja'

TIME_ZONE = 'Asia/Tokyo'

USE_I18N = True

USE_TZ = True




# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/6.0/howto/static-files/

STATIC_URL = '/static/'


# ----追記----

# 開発用。本番ではmediaは使わない。
if DEBUG:
    MEDIA_ROOT = os.path.join(BASE_DIR, 'media')  # アップロードされたファイルを保存する場所（フォルダ）。backend/media/というフォルダを作って、そこに画像や動画を保存するという意味。
    MEDIA_URL = "/media/"  # フロント側からアクセスするときのURLの頭部分（パス）。http://localhost:8000/media/xxx.jpg


# 本番用の static ファイル置き場（Renderで collectstatic 用）
STATIC_ROOT = BASE_DIR / "staticfiles"
