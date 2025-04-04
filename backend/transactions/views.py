from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from django.http import HttpResponse
from weasyprint import HTML
from .models import Transaction
from .serializers import TransactionSerializer
from users.models import Profile
import tempfile
import os

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin:
            return Transaction.objects.all()
        return Transaction.objects.filter(recorded_by=user.profile)

    def perform_create(self, serializer):
        serializer.save(recorded_by=self.request.user.profile)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        transaction = self.get_object()
        if transaction.status != Transaction.PENDING:
            return Response(
                {"error": "Transaction is already completed."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate receipt
        receipt_path = self.generate_receipt(transaction)
        transaction.receipt = receipt_path
        transaction.status = Transaction.COMPLETED
        transaction.save()
        
        # Send SMS notification
        if transaction.phone_number:
            self.send_sms_notification(transaction)
        
        return Response(
            {"status": "Transaction completed successfully."},
            status=status.HTTP_200_OK
        )

    def generate_receipt(self, transaction):
        html_string = render_to_string(
            'receipt.html',
            {'transaction': transaction}
        )
        
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as output:
            HTML(string=html_string).write_pdf(output.name)
            return output.name

    def send_sms_notification(self, transaction):
        # Implementation would use Africa's Talking API
        pass

class ReceiptView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        transaction = get_object_or_404(Transaction, pk=pk)
        if not request.user.is_admin and transaction.recorded_by != request.user.profile:
            return Response(status=status.HTTP_403_FORBIDDEN)
        
        with open(transaction.receipt.path, 'rb') as pdf:
            response = HttpResponse(pdf.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'inline; filename=receipt_{pk}.pdf'
            return response

class MPesaCallbackView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # Process M-Pesa callback and create transaction
        pass

class TransactionStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        # Return transaction statistics
        pass