from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import User



class UserSerializer(serializers.ModelSerializer):
    subscriber_count = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()   # get_user_model() を呼ぶと、Django で設定したカスタムユーザーモデル（users.User）を使うことになる。
        fields = ('email', 'password', 'username', 'id',
                'profile_icon', 'cover_image', 'subscriber_count',
                'profile_icon_url', 'cover_image_url')
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}


    def create(self, validated_data):  # 新規ユーザー登録のときだけ実行される。
        user = get_user_model().objects.create_user(**validated_data)

        return user
    

    def get_subscriber_count(self, obj):
        return obj.subscribers.count()


