from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

class User(AbstractUser):
    is_admin = models.BooleanField(default=False)
    is_finance = models.BooleanField(default=True)

    def __str__(self):
        return self.username

class Profile(models.Model):
    ADMIN = 'ADMIN'
    FINANCE = 'FINANCE'
    ROLES = [
        (ADMIN, 'Church Treasurer'),
        (FINANCE, 'Finance Team'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLES, default=FINANCE)
    phone_number = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()