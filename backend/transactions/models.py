from django.db import models
from django.core.validators import MinValueValidator
from users.models import Profile

class Transaction(models.Model):
    CASH = 'CASH'
    MPESA = 'MPESA'
    PAYMENT_TYPES = [
        (CASH, 'Cash'),
        (MPESA, 'M-Pesa'),
    ]

    TITHE = 'TITHE'
    OFFERING = 'OFFERING'
    BUILDING = 'BUILDING'
    CATEGORIES = [
        (TITHE, 'Tithe'),
        (OFFERING, 'Offering'),
        (BUILDING, 'Church Building'),
    ]

    PENDING = 'PENDING'
    COMPLETED = 'COMPLETED'
    STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (COMPLETED, 'Completed'),
    ]

    member_name = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=15, blank=True)
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    category = models.CharField(max_length=20, choices=CATEGORIES)
    payment_type = models.CharField(max_length=5, choices=PAYMENT_TYPES)
    receipt = models.FileField(upload_to='receipts/')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=PENDING)
    recorded_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.member_name} - {self.amount} - {self.get_category_display()}"

    class Meta:
        ordering = ['-created_at']