from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated


from django.db.models import Count, Sum
from django.db.models.functions import TruncMonth
from dateutil.relativedelta import relativedelta  # ← これを使うと月単位の計算が安全


from users.models import User
from ..models import Video, History, Subscription


from videos .serializers import ChannelStatesSerializer


from django.utils import timezone
from datetime import timedelta



class ChannelAnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]


    @action(detail=True, methods=['get'])
    def channel_status(self, request, pk=None):
        uploader = User.objects.get(pk=pk)
        today = timezone.now()
        one_year_ago = today - timedelta(days=365)


        # 過去1年の月リストを作成
        months = []
        for i in range(12):
            month = (today - relativedelta(months=i)).replace(day=1)
            months.append(month)
        months = sorted(months)  # 昇順


        # 集計クエリ
        watch_time_qs = (
            History.objects
            .filter(video__uploader=uploader, watched_at__gte=one_year_ago)
            .annotate(month=TruncMonth('watched_at'))
            .values('month')
            .annotate(total_duration=Sum('watch_duration'))
        )


        subscribers_qs = (
            Subscription.objects
            .filter(subscribed_to=uploader, subscribed_at__gte=one_year_ago)
            .annotate(month=TruncMonth('subscribed_at'))
            .values('month')
            .annotate(count=Count('id'))
        )


        # 再生回数
        views_qs = (
            History.objects
            .filter(video__uploader=uploader, watched_at__gte=one_year_ago)
            .annotate(month=TruncMonth('watched_at'))
            .values('month')
            .annotate(count=Count('id'))
        )


        # dict に変換
        watch_time_dict = {x['month'].strftime('%Y-%m'): x['total_duration'] for x in watch_time_qs}
        subscribers_dict = {x['month'].strftime('%Y-%m'): x['count'] for x in subscribers_qs}
        views_dict = {x['month'].strftime('%Y-%m'): x['count'] for x in views_qs}


        # すべての月にデフォルト値0を入れる
        data = []
        for m in months:
            key = m.strftime('%Y-%m')  # 各月を整形
            data.append({
                'month': key,
                'watch_time': watch_time_dict.get(key, 0),
                'subscribers': subscribers_dict.get(key, 0),
                'views': views_dict.get(key, 0),
            })

        return Response(data)




