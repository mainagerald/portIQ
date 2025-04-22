from django.urls import path
from .views import (
    StockListCreateAPIView, StockDetailAPIView,
    PortfolioListCreateAPIView, PortfolioDetailAPIView,
    CommentListCreateAPIView, CommentDetailAPIView,
)

urlpatterns = [
    # Stock endpoints
    path('stocks/', StockListCreateAPIView.as_view(), name='stock-list-create'),
    path('stocks/<int:pk>/', StockDetailAPIView.as_view(), name='stock-detail'),
    # Portfolio endpoints
    path('portfolios/', PortfolioListCreateAPIView.as_view(), name='portfolio-list-create'),
    path('portfolios/<int:pk>/', PortfolioDetailAPIView.as_view(), name='portfolio-detail'),
    # Comment endpoints
    path('comments/', CommentListCreateAPIView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', CommentDetailAPIView.as_view(), name='comment-detail'),
]
