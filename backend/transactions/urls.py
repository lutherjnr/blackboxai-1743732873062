from django.urls import path
from rest_framework import routers
from .views import (
    TransactionViewSet,
    ReceiptView,
    MPesaCallbackView,
    TransactionStatsView
)

router = routers.DefaultRouter()
router.register(r'', TransactionViewSet, basename='transactions')

urlpatterns = [
    path('receipts/<int:pk>/', ReceiptView.as_view(), name='receipt-detail'),
    path('mpesa/callback/', MPesaCallbackView.as_view(), name='mpesa-callback'),
    path('stats/', TransactionStatsView.as_view(), name='transaction-stats'),
] + router.urls