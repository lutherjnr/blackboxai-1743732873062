from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Profile

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(
        choices=Profile.ROLES,
        write_only=True,
        required=False
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password2',
            'role',
            'first_name',
            'last_name'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."}
            )
        return attrs

    def create(self, validated_data):
        role = validated_data.pop('role', Profile.FINANCE)
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        
        if role == Profile.ADMIN:
            user.is_admin = True
            user.is_finance = False
        user.save()
        
        profile = user.profile
        profile.role = role
        profile.save()
        
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Profile
        fields = [
            'username',
            'email',
            'role',
            'phone_number',
            'first_name',
            'last_name'
        ]

class UserListSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source='profile.role')
    phone_number = serializers.CharField(source='profile.phone_number')

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'role',
            'phone_number',
            'is_active'
        ]

class RoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['role']