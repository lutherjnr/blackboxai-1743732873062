from rest_framework import serializers
from .models import Transaction
from users.models import Profile

class TransactionSerializer(serializers.ModelSerializer):
    recorded_by_name = serializers.CharField(
        source='recorded_by.user.get_full_name',
        read_only=True
    )
    status_display = serializers.CharField(
        source='get_status_display',
        read_only=True
    )
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    payment_type_display = serializers.CharField(
        source='get_payment_type_display',
        read_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            'id',
            'member_name',
            'phone_number',
            'amount',
            'category',
            'category_display',
            'payment_type',
            'payment_type_display',
            'status',
            'status_display',
            'recorded_by',
            'recorded_by_name',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'status',
            'recorded_by',
            'created_at',
            'updated_at'
        ]

    def validate(self, data):
        if data.get('payment_type') == Transaction.MPESA and not data.get('phone_number'):
            raise serializers.ValidationError(
                {"phone_number": "Phone number is required for M-Pesa transactions."}
            )
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            profile = Profile.objects.get(user=request.user)
            validated_data['recorded_by'] = profile
        return super().create(validated_data)