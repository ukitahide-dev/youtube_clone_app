# serializers.pyはフロントがどんなデータを受け取れるかを決める。
# 「API がどんなデータを返す（または受け取る）か」を決めるもの。
# フロントエンド（Reactなど）は、APIから受け取ったJSONの中身を元に画面を表示する。



from rest_framework import serializers


from .models import (
    Video, Category, Tag, Comment, Favorite, Like,
    Playlist, History, Subscription, CommentReaction, UploaderPlaylist
)

from users.models import User  # SubscriptionやUploaderSerializerで使う






class CategorySerializer(serializers.ModelSerializer): # CategorySerializer は シリアライザ（serializer）クラス。ModelSerializer を継承しており、Category モデルのフィールド情報を自動で使ってくれる便利なクラス。
    class Meta:  # DjangoやDRFでは「どのモデルを使うのか」「どのフィールドを対象にするのか」などの設定を Meta クラスでまとめて書く。
        model = Category
        fields = ['id', 'name']  # JSONに含めたいフィールドを指定する。Category モデルのうち、id と name のフィールドだけをシリアライズ（JSON変換）します」という意味。他のフィールドがあってもここに書かれていないものは出力されない。





class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']



# 基本的な動画情報をシリアライズする。つまり、動画の一覧表示用とかに使うやつ。
class VideoSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  # Video モデルにある category（外部キー）をJSON 上では id（主キー）だけでやり取りできるようにする。serializers.PrimaryKeyRelatedField：外部キーや多対多関係を「ID（主キー）」でやり取りするためのフィールド。
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True)
    uploader_name = serializers.CharField(source='uploader.username', read_only=True)  # これで「uploader（Userモデル）の username を uploader_name という名前で JSON に含める」と指定している。「誰が投稿したか」をフロントで見せるため。
    uploader_icon = serializers.ImageField(source='uploader.profile_icon', read_only=True)
    subscriber_count = serializers.SerializerMethodField()   # Videoモデルに存在しないフィールド(カラム)を自分で作り、フロント側で表示できるようにする。

    video = serializers.FileField(required=False)
    thum = serializers.ImageField(required=False)

    class Meta:
        model = Video
        fields = [  # fieldsはJSON に含めるフィールド一覧。リアクト側でconsole.log(response.data)すると、ここに書かれた項目がオブジェクトのキー名になってる。
            'id', 'title', 'video', 'thum', 'uploader', 'uploaded_at','description',
            'like', 'dislike', 'views',
            'category', 'tags', 'uploaded_at', 'updated_at', 'uploader_name', 'subscriber_count',
            'uploader_icon',
        ]

        # read_only_fields → 受信時は無視される（クライアントから値を入れられない）。例：uploader はログインユーザーから自動で設定するから、フロントからは送らせない。
        read_only_fields = ['uploader', 'uploaded_at']


    def get_subscriber_count(self, obj):   # obj は今シリアライズしている Video モデルのインスタンス（1つの動画）。obj.uploader は動画を投稿したユーザー（＝Userモデルのインスタンス）。obj.uploader.subscribers は Subscription モデルの related_name="subscribers" でつながったリレーション。だから最終的に .count() で「この投稿者のチャンネル登録者数」を返している、ということ。
        return obj.uploader.subscribers.count()


    # Django REST Framework（DRF）で「PATCH」や「PUT」リクエストが来たときに呼ばれるメソッド」
    def update(self, instance, validated_data):   # instance → もともとのVideoオブジェクト。validated_data → フロントから送られてきたデータ（タイトル・タグなど）。
        tags = validated_data.pop('tags', None)
        instance = super().update(instance, validated_data)

        if tags is not None:
            instance.tags.set(tags)  # 既存のタグを置き換える

        instance.save()
        return instance




class CommentSerializer(serializers.ModelSerializer):
    # これらは、CommentSerializerが返すJSONに追加情報を付けるためのフィールド。
    user_name = serializers.CharField(source='user.username', read_only=True)  # source='user.username' → Comment モデルの user（ForeignKey）から username を取り出す。read_only=True → フロントからリクエストする際に送られてこなくてもOK、サーバー側で自動的に値が入る。
    video_title = serializers.CharField(source='video.title', read_only=True)
    replies = serializers.SerializerMethodField()  # 親コメントに対する返信コメント（子コメント）をまとめて返す。SerializerMethodField() → 自分で書いた get_replies(self, obj) メソッドが自動で呼ばれる。
    like_count = serializers.SerializerMethodField()  # 自分で書いたdef get_like_count(self, obj)メソッドが自動で呼ばれる。
    dislike_count = serializers.SerializerMethodField()


    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'video', 'text', 'like_count', 'dislike_count',
                'created_at', 'updated_at', 'video_title', 'parent', 'replies']    # このシリアライザで 扱うフィールドはこれだけという意味。モデル側で、対象のフィールドが null=False、blank=FalseやForeignKeyなら必須項目になる。reactからリクエストするときに、サーバーに送らないといけない項目になる。

        read_only_fields = ['user']  # シリアライザでそのフィールドは「読み取り専用」にする という指定。こう書くと、フロントから user を送らなくてもエラーにならず、サーバー側(views.py)で serializer.save(user=self.request.user) のように自動で値をセットできる。


    def get_like_count(self, obj):  # obj は その時シリアライズしている1件の Comment モデルのインスタンス。
        print('いいねが押された')

        # あるコメント(1件のCommentモデルのインスタンス)に付けられた『いいね』の数」を取得している。
        return obj.commentreaction_set.filter(is_liked=True).count()  # いいねの数をカウント。CommentReaction モデルには comment = models.ForeignKey(Comment) があります。Djangoでは、ForeignKeyで関連付けられたモデルに対して、自動的に 逆参照用のマネージャ が作られます。デフォルトでは <小文字のモデル名>_set という名前になります。ここでは commentreaction_set がそれにあたります。つまり obj.commentreaction_set は「このコメントに関連する CommentReaction の全リスト」を表しています。


    def get_dislike_count(self, obj):
        print('わるいねが押された')
        return obj.commentreaction_set.filter(is_liked=False).count()  # obj.commentreaction_set: objはCommentモデルのインスタンス。


    def get_replies(self, obj):  # obj.replies.all() を使って、そのコメントの子コメントを取得してシリアライズする。
        if obj.parent is None:   # 親コメントのときだけ返す
            replies = obj.replies.all().order_by('created_at')
            return CommentSerializer(replies, many=True).data

        return []



class CommentReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentReaction
        fields = ['id', 'user', 'comment', 'is_liked', 'created_at']
        read_only_fields = ['user']





# VideoSerializer を継承。VideoSerializer にあるフィールドをそのまま使いつつ、さらにコメントやお気に入り情報も追加する。
class VideoDetailSerializer(VideoSerializer):
    comments = CommentSerializer(many=True, read_only=True, source='comment_set')  # many=True にすると、複数のコメントを配列にして返す。動画に対するすべてのコメント（＝コメント一覧）を、JSONに含めるようにしてる。動画に紐づいたコメント一覧をフロントに一緒に返す**っていう目的のコード。source='comment_set' → Videoモデルの逆参照（videoに紐づく全コメント）を使う。VideoモデルからCommentモデルへの逆参照。CommentモデルでVideoモデルをForeignKeyに設定したからできる。

    is_favorited = serializers.SerializerMethodField()  # serializers.SerializerMethodField()は自動で、def get_is_favorited(self, obj):を呼び出す。
    is_subscribed = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    dislike_count = serializers.SerializerMethodField()


    class Meta(VideoSerializer.Meta):
        fields = VideoSerializer.Meta.fields + ['comments', 'is_favorited', 'is_subscribed', 'like_count', 'dislike_count']  # 'comments'をキー、値を配列として、その配列の中にCommentSerializerで定義したfieldsがオブジェクトとして入ってる。



    def get_like_count(self, obj):
        return Like.objects.filter(video=obj, is_liked=True).count()


    def get_dislike_count(self, obj):
        return Like.objects.filter(video=obj, is_liked=False).count()


    def get_is_favorited(self, obj): # obj は Videoモデルのインスタンスを指す。VideoDetailSerializerはVideoSerializerを継承していて、VideoSerializerがVideoモデルを使うと指定しているから。
        user = self.context['request'].user # 今このAPIを叩いてる人（ユーザー）」を取り出してる。
        if not user.is_authenticated:
            return False

        return Favorite.objects.filter(user=user, video=obj).exists() # このAPIを見ているユーザーが、いま表示してる動画をお気に入りに登録しているか？」をチェックして、結果を is_favorited という項目(真偽値)で返してる。


    # 今ログインしてるユーザーが、この動画の投稿者（チャンネル）を登録しているかどうか？」を調べて、True / False を返す関数
    def get_is_subscribed(self, obj):
        user = self.context['request'].user
        if not user.is_authenticated:
            return False

        uploader = obj.uploader  # obj は Videoインスタンス だから、obj.uploader で「この動画を投稿した人（チャンネル主）」が取れる。
        return Subscription.objects.filter(subscriber=user, subscribed_to=uploader).exists() # DBの Subscription モデル（チャンネル登録情報）を検索して、subscriber=user→ 視聴者が、subscribed_to=uploader→ この投稿者を登録しているかどうか？をチェックしてる。







class FavoriteSerializer(serializers.ModelSerializer):
    video_title = serializers.CharField(source='video.title', read_only=True) # フロント(React)に動画のタイトルを渡したいから書く。これを書かないと、React側で動画のタイトルを取得できず、結果として、ブラウザで動画タイトルを出力できなくなる。

    class Meta:
        model = Favorite
        fields = ['id', 'user', 'video', 'video_title', 'added_at']




# 視聴用プレイリスト
class PlaylistSerializer(serializers.ModelSerializer):
    videos = serializers.PrimaryKeyRelatedField(   # serializers.PrimaryKeyRelatedField: DRFが用意してる「外部キー（リレーション先）を ID でやりとりするためのフィールド」。
        queryset=Video.objects.all(),  # ← どの Video ID が有効かを決める（バリデーション用）
        many=True,       # ← 複数の ID をリストで送れる
    )


    # 読み取り用 (動画の詳細情報)  サーバー → フロントに返すときに使うフィールド。VideoSerializer を使って、実際の動画データを展開して JSON に変換する。
    video_details = VideoSerializer(
        source='videos',   # ← Playlist.videos (ManyToManyField) を使う。
        many=True,        # ← 複数動画だからリスト
        read_only=True    # ← 出力専用（書き込みには使わない）
    )

    user = serializers.ReadOnlyField(source='user.id')


    class Meta:
        model = Playlist
        fields = ['id', 'user', 'name', 'videos', 'created_at', 'updated_at', 'video_details']  # videosがwrite_only=Trueなら、ここに書いても、レスポンスには表示されない。UserPlaylistPage.jsxのfetchPlaylists関数のconsole.log(res.data)で確認できる。






class PlaylistUpdateSerializer(serializers.ModelSerializer):
    video_details = VideoSerializer(
        source='videos',   # ← Playlist.videos (ManyToManyField) を使う。
        many=True,         # ← 複数動画だからリスト
        read_only=True     # ← 出力専用（書き込みには使わない）
    )

    class Meta:
        model = Playlist
        fields = ['id', 'name', 'videos', 'video_details']




# 投稿用プレイリスト
class UploaderPlaylistSerializer(serializers.ModelSerializer):
    videos = serializers.PrimaryKeyRelatedField(
        queryset=Video.objects.all(),
        many=True,
        # write_only=True   # クライアントから送信専用。ブラウザ側(コンソール)で表示されなくなる。こうしてたけど、viewer/PlaylistDetailPage.jsxから開くときに使うからやめた。
    )

    video_details = VideoSerializer(source='videos', many=True, read_only=True)  # サーバーから返信専用

    class Meta:
        model = UploaderPlaylist
        fields = ['id', 'name', 'description', 'videos', 'created_at', 'video_details']



    def validate_videos(self, videos):
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        if not user or not user.is_authenticated:
            raise serializers.ValidationError("認証されていません")

        for video in videos:
            if video.uploader != user:
                raise serializers.ValidationError('他人の動画は追加できません')
        return videos






class HistorySerializer(serializers.ModelSerializer):
    video_title = serializers.CharField(source='video.title', read_only=True)

    class Meta:
        model = History
        fields = ['id', 'user', 'video', 'watched_at', 'video_title', 'watch_duration ']





class SubscriptionSerializer(serializers.ModelSerializer):
    subscriber_email = serializers.EmailField(source='subscriber.email', read_only=True)
    subscribed_to_email = serializers.EmailField(source='subscribed_to.email', read_only=True)

    class Meta:
        model = Subscription
        fields = ['id', 'subscriber', 'subscriber_email', 'subscribed_to', 'subscribed_to_email', 'subscribed_at']







# 投稿者情報用シリアライザ。シンプルに「投稿者の基本情報だけ」を返す用。ユーザー一覧に表示するときなど。
class UploaderSerializer(serializers.ModelSerializer):
    subscriber_count = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'profile_icon', 'cover_image', 'subscriber_count',
                  'is_subscribed',
                ]


    def get_subscriber_count(self, obj):   # obj は今処理している「User」インスタンス。
        return obj.subscribers.count()     # Subscriptionモデルのrelated_name='subscribers'を利用。あるチャンネル（User）に対して、そのチャンネルを登録している人たち（Subscriptionの集まり）」にアクセスし、その数をカウントしている。


    def get_is_subscribed(self, obj):
        user = self.context["request"].user

        if user.is_anonymous:
            return False

        return Subscription.objects.filter(
            subscriber=user,
            subscribed_to=obj
        ).exists()




class UploaderDetailSerializer(serializers.ModelSerializer):
    videos = serializers.SerializerMethodField()
    subscriber_count = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()
    uploader_playlists = serializers.SerializerMethodField()



    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_icon', 'cover_image', 'videos',
                    'subscriber_count', 'is_subscribed', 'uploader_playlists',
                ]


    def get_videos(self, obj):
        videos = Video.objects.filter(uploader=obj).order_by('-uploaded_at')
        return VideoSerializer(videos, many=True, context=self.context).data


    def get_uploader_playlists(self, obj):
        uploader_playlists = UploaderPlaylist.objects.filter(uploader=obj).order_by('-created_at')
        return UploaderPlaylistSerializer(uploader_playlists, many=True, context=self.context).data


    def get_subscriber_count(self, obj):
        return obj.subscribers.count()


    def get_is_subscribed(self, obj):
        user = self.context["request"].user

        if user.is_anonymous:
            return False

        return Subscription.objects.filter(
            subscriber=user,
            subscribed_to=obj
        ).exists()





class MonthlyWatchTimeSerializer(serializers.Serializer):
    month = serializers.DateTimeField()
    total_duration = serializers.IntegerField()


class MonthlySubscribersSerializer(serializers.Serializer):
    month = serializers.DateTimeField()
    count = serializers.IntegerField()


class MonthlyViewsSerializer(serializers.Serializer):
    month = serializers.DateTimeField()
    count = serializers.IntegerField()


class ChannelStatesSerializer(serializers.Serializer):
    monthly_watch_time = MonthlyWatchTimeSerializer(many=True)
    monthly_subscribers = MonthlySubscribersSerializer(many=True)
    monthly_views = MonthlyViewsSerializer(many=True)
