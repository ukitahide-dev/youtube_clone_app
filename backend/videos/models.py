from django.db import models
import uuid

from users.models import User
from django.core.exceptions import ValidationError
from django.conf import settings




def load_path_video(instance, filename):   # instance → このファイルを持つ モデルのインスタンス（ここだと Video オブジェクト)。filename → ユーザーがアップロードした元のファイル名（例: myvideo.mp4）。
    ext = filename.split('.')[-1]   # 元のファイル名の末尾の拡張子を取得。例: myvideo.mp4 → mp4。
    return f'video/{uuid.uuid4()}.{ext}'  # uuid.uuid4() で ランダムなユニークID を生成。ァイル名を video/ランダムID.mp4 にする。


def load_path_thum(instance, filename):
    ext = filename.split('.')[-1]
    return f'thum/{uuid.uuid4()}.{ext}'



class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name



class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)

    def __str__(self):
        return self.name




class Video(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_videos', null=True)   # 動画投稿者
    title = models.CharField(max_length=30, blank=False, db_index=True)

    like = models.PositiveIntegerField(default=0)      # 各動画に対するいいねの総数
    dislike = models.PositiveIntegerField(default=0)
    views = models.PositiveIntegerField(default=0)     # 再生数
    duration = models.PositiveIntegerField(default=0)   # 秒単位で動画の長さ
    description = models.TextField(blank=True)   # 動画の説明
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True, db_index=True)   # アップロード日時  「新着動画順」などの並び替えができる。
    updated_at = models.DateTimeField(auto_now=True)


    # 開発用
    video = models.FileField(upload_to=load_path_video, blank=True, null=True)  # 動画ファイル自体。必須。upload_to=load_path_video で保存先を指定。
    thum = models.ImageField(upload_to=load_path_thum, blank=True, null=True)  # 動画のサムネイル画像。必須。保存先は load_path_thum で指定。

    # 本番用
    video_url = models.URLField(blank=True, null=True)
    thumbnail_url = models.URLField(blank=True, null=True)


    def __str__(self):
        return self.title




class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # ForeignKey(User) → どのユーザーが押したか」を記録 User（ユーザー）側が「1」。Like側が「多」。誰がLikeしたかわかるようになる。
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='likes')  # ForeignKey(Video) → 「どの動画に対して押したか」を記録 Video モデルから Like モデルへの逆参照(親→子の参照)は video.likes.all() になる。
    is_liked = models.BooleanField()  # TrueならLike、FalseならDislike
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'video'], name='unique_like')
        ]






class Comment(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # User側が「1」。Comment側が「多」。Userが消えたら、そのユーザーが書いてたコメントも消える。
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='replies')

    def __str__(self):
        return f"{self.user.email} - {self.text[:20]}"  # userはインスタンス(Userモデルから作られたインスタンス)だから、user.emailみたいに、Userモデルのフィールドを取得できる。




class CommentReaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   # ForeignKey はデフォルトで null=False だから、必須フィールド。
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    is_liked = models.BooleanField()    # True: いいね, False: わるいね  BooleanField も null=False がデフォルト。
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # 同じ人が同じコメントに複数回リアクションできないようにする。
        constraints = [
            models.UniqueConstraint(fields=['user', 'comment'], name='unique_comment_reaction')
        ]





class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)   # User（ユーザー）側が「1」。Favorite（お気に入り登録）側が「多」。1人のユーザーは複数のFavorite（お気に入り）を持てる。1つのFavoriteは1人のユーザーに属している。
    video = models.ForeignKey(Video, on_delete=models.CASCADE) # Video（動画）が「1」側。Favorite（お気に入り登録）が「多」側。1つの動画は複数のFavoriteに登録されることができる（複数のユーザーにお気に入りされる）。1つのFavoriteは1つの動画に属する。
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'video'],
                name='unique_favorite'
            )
        ]




# --- 視聴者が作る再生リスト（自由に追加できる） ---
class Playlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Userが1、Playlistが多。
    name = models.CharField(max_length=50)
    videos = models.ManyToManyField(Video, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name






# --- 投稿者が作る再生リスト（自分の動画だけ） ---
class UploaderPlaylist(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploader_playlists')
    name = models.CharField(max_length=100)
    videos = models.ManyToManyField(Video, blank=True, related_name='in_uploader_playlists')
    description = models.TextField(blank=True, max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        ordering = ['-created_at']




    def __str__(self):
        return f"{self.uploader.username} - {self.name}"




# 「動画の視聴履歴」を記録する
class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE)
    watched_at = models.DateTimeField(auto_now=True)
    watch_duration = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-watched_at']




# チャンネル登録モデル
class Subscription(models.Model):
    subscriber = models.ForeignKey(User, related_name='subscriptions', on_delete=models.CASCADE)  # 登録「する」側のユーザー。たとえば「あなた」が他のチャンネルを登録したとき、ここが「あなた」になる。related_name='subscriptions' によって、user.subscriptions.all() で「あなたが登録しているユーザー一覧」が取れる。
    subscribed_to = models.ForeignKey(User, related_name='subscribers', on_delete=models.CASCADE)  # 登録「される」側のユーザー（チャンネル主）。related_name='subscribers' で、user.subscribers.all() で「自分をフォローしてる人一覧」が取れる。
    subscribed_at = models.DateTimeField(auto_now_add=True)


    class Meta:  # 「1人のユーザーが、同じ相手を2回以上フォローできないようにする制約」
        constraints = [
            models.UniqueConstraint(
                fields=['subscriber', 'subscribed_to'],
                name='unique_subscription'
            )
        ]

    def __str__(self):  # subscriber は ForeignKey で User モデルを参照してる。つまり、self.subscriber は Userモデルのインスタンス。だから、self.subscriber.email、こんな書き方ができる。
        return f"{self.subscriber.email} subscribed to {self.subscribed_to.email}"
