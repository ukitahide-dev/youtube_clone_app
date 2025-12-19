# viewsフォルダの中にある全部の view を
# まとめて読み込んで、外から使えるようにしてる


from .analytics_views import *
from .video_views import *    # . → 今のフォルダ（views）  video_views → video_views.py   import * → そのファイルの中の全部
from .comment_views import *
from .playlist_views import *
from .subscription_views import *
from .uploader_views import *
from .history_views import *
from .category_views import *
from .tag_views import *
