
from rest_framework import viewsets


from ..models import Category
from ..serializers import CategorySerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    http_method_names = ['get']  # ← これで「一覧取得(GET)」と「詳細取得(GET /:id)」のみ許可
