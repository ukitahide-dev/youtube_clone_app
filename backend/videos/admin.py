# admin.py は「Django管理画面に、どのモデルを表示させるか決める場所」
# 運営・開発者が使う画面。


from django.contrib import admin

# Register your models here.

from .models import (
    Video, Favorite, Playlist, Comment, Category,
    Tag, History, Subscription,
)




admin.site.register(Video)
admin.site.register(Favorite)
admin.site.register(Playlist)
admin.site.register(Comment)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(History)
admin.site.register(Subscription)
