

from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers



from ..models import Comment, CommentReaction
from ..serializers import CommentSerializer, CommentReactionSerializer
from ..permissions import IsCommentOwnerOrReadOnly



class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at') #  このViewSetは Comment モデルを扱います宣言。
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCommentOwnerOrReadOnly]


    # コメントを投稿したときに呼ばれるメソッド。フロントから POST リクエストが送られて呼ばれる。urlはpostメソッドで、api/videos/comments/
    def perform_create(self, serializer):  # perform_createは Django REST Framework の特別なメソッド。新しいデータを保存するときに、追加の処理をしたいならここに書いてねというもの。.create()実行時に自動で呼ばれる。CommentViewSet において コメントを新規作成（POST）する時の「自動的なユーザー紐づけ処理」 を行うためのカスタムメソッド。
        serializer.save(user=self.request.user)  # フロントが何を送ってきても無視して、必ず 今ログインしているユーザー を user にセットできる。これにより、なりすましが防げる。REST APIで「不正に他人のIDを使ってPOSTされる」リスクを防ぐ。ログインユーザーを自動で user フィールドに保存。セキュリティ的にこうした方が良い。コメントを投稿した人（＝リクエストしたユーザー、ログイン中のユーザー）を自動で user フィールドに保存できる。




class CommentReactionViewSet(viewsets.ModelViewSet):
    queryset = CommentReaction.objects.all()
    serializer_class = CommentReactionSerializer
    permission_classes = [permissions.IsAuthenticated]


    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



    @action(detail=False, methods=['post'], url_path='toggle')  # detail=False:「特定の1つのオブジェクト」ではなく、「一覧 or 全体向け」のAPIにしたい。 URL の末尾が /toggle/ になるように設定
    def toggle_reaction(self, request):
        user = request.user
        comment_id = request.data.get('comment_id')  # React側からPOSTされたデータの中から comment_id の値を取り出して、それを comment_id という変数に代入する。
        is_liked = request.data.get('is_liked')  # request.data は、Reactなどから送られてきたJSONデータのこと。DRFでは、POSTリクエストのときに送られてきたデータは request.data に格納されている。request.data は DRFが用意してくれていて、JSONリクエストボディを Python の dict として扱える。


        # 型変換
        if is_liked in [True, 'true', 'True', 1, '1']:
            is_liked = True
        elif is_liked in [False, 'false', 'False', 0, '0']:
            is_liked = False
        else:
            return Response({'error': 'Invalid is_liked value'}, status=400)



        if comment_id is None or is_liked is None:
            return Response({'error': 'comment_id and is_liked are required'}, status=400)

        try:
            comment = Comment.objects.get(id=comment_id)  # Commentモデルのidカラムの値と、ユーザーがリアクションしたCommentモデルのidカラムの値が一致するものを抽出。
        except Comment.DoesNotExist:
            return Response({'error': 'Comment not found'}, status=404)

        # 自分のコメントにはリアクション禁止
        if comment.user == user:
             raise serializers.ValidationError("自分のコメントにはリアクションできません。")


        obj, created = CommentReaction.objects.get_or_create(  # obj:そのユーザーとコメントに紐づく CommentReaction インスタンス（既存 or 新規）
            user=user,       #  ← 検索条件、かつ新規作成時も必ずセット
            comment=comment, #  ← 検索条件、かつ新規作成時も必ずセット
            defaults={       # ← 新規作成時にだけ使う追加フィールド。新規作成時に入る値
                'is_liked': is_liked
            }
        )


        if not created:  # ユーザーがすでに対象のコメントにリアクションしていた場合
            if obj.is_liked == is_liked: # 今react側から送られてきたリアクションと、すでに登録されているリアクションが同じか？obj.is_liked: そのリアクションが「いいね」か「わるいね」か（True = いいね, False = わるいね）。is_liked: フロント（React）から送られてきた新しいリアクションの意図（True または False）
                obj.delete()
                return Response({'status': 'removed'})  # react側に返すJsonデータ。コンソールで表示できる。
            else:
                obj.is_liked = is_liked
                obj.save()
                return Response({'status': 'updated'})  # react側に返すJsonデータ。コンソールで表示できる。
        else: # ユーザーが新規で対象のコメントにリアクションした場合
            obj.is_liked = is_liked
            obj.save()
            return Response({'status': 'created'})  # react側に返すJsonデータ。コンソールで表示できる。
