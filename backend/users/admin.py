




from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _


from django.contrib import admin
from .models import User



# Register your models here.



# このコードは、Django管理画面に自作のUserモデルを正しく表示・管理できるようにする設定。Djangoでは、ユーザーモデルを自作（＝AbstractBaseUserを継承）した場合、管理画面でそのモデルを使うにはカスタム管理クラス（UserAdmin）が必要になる。
class UserAdmin(BaseUserAdmin):
    ordering = ['id'] # 管理画面でユーザー一覧を表示するときの並び順。ここでは「id（UUID）」で昇順に並べる設定。
    list_display = ['email', 'username', 'profile_icon_preview', 'cover_image_preview'] # ユーザー一覧ページで、どの項目を一覧に表示するか。ここでは email と username を表示。
    fieldsets = (  # ユーザー詳細編集画面で、表示されるフィールドの「グループ化・並び順」を決める。
        (None, {'fields': ('email', 'password')}), # グループ名なし。表示される項目email、password。
        (_('Personal Info'), {'fields': ('username', 'profile_icon', 'cover_image')}), #グループ名Personal Info。表示される項目username
        (
            _('Permissions'),  # グループ名Permissions。表示される項目is_active、is_staff、is_superuser。
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login',)}),  # グループ名Important dates。表示される項目last_login。
    )
    add_fieldsets = (  # ユーザー追加画面で使うレイアウト。password1 と password2 → パスワードの確認用（2回入力して一致チェック）
        (None, {
            'classes': ('wide',),  #  フォームを横幅広く表示
            'fields': ('email', 'password1', 'password2')  # この設定によって、ユーザー追加画面での2回パスワード確認（同じパスワードを2回入力）もサポート。
        }),
    )

    #（管理画面で画像をプレビュー表示）
    def profile_icon_preview(self, obj):
        if obj.profile_icon:
            return f'<img src="{obj.profile_icon.url}" width="50" height="50" style="border-radius: 50%;" />'
        return 'なし'
    profile_icon_preview.allow_tags = True
    profile_icon_preview.short_description = 'プロフィール画像'

    def cover_image_preview(self, obj):
        if obj.cover_image:
            return f'<img src="{obj.cover_image.url}" width="100" height="50" />'
        return 'なし'

    cover_image_preview.allow_tags = True
    cover_image_preview.short_description = 'カバー画像'





admin.site.register(User, UserAdmin)  # このUserモデルはこのUserAdminで表示してとDjangoに教えている。
