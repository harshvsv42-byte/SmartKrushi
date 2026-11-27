from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
from .models import FarmerProfile


class FarmerProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    email = serializers.ReadOnlyField(source='user.email')
    profile_image_url = serializers.SerializerMethodField()

    class Meta:
        model = FarmerProfile
        fields = [
            'id', 'username', 'email', 'full_name', 'phone_number',
            'role', 'state', 'district', 'taluka', 'village',
            'farm_size', 'primary_crops', 'preferred_language',
            'profile_image', 'profile_image_url',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'username', 'email', 'profile_image_url', 'created_at', 'updated_at']

    def get_profile_image_url(self, obj):
        if obj.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return f"http://127.0.0.1:8000{obj.profile_image.url}"
        return None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    full_name = serializers.CharField(required=True)
    phone_number = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    state = serializers.CharField(required=False, default='Gujarat')
    district = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    taluka = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    village = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    farm_size = serializers.FloatField(required=False, default=1.0)
    preferred_language = serializers.CharField(required=False, default='en')

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'full_name', 'phone_number', 'state', 'district',
            'taluka', 'village', 'farm_size', 'preferred_language'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        phone = attrs.get('phone_number')
        if phone and FarmerProfile.objects.filter(phone_number=phone).exists():
            raise serializers.ValidationError({"phone_number": "A farmer profile with this phone number already exists."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        full_name = validated_data.pop('full_name')
        phone_number = validated_data.pop('phone_number', None) or None
        state = validated_data.pop('state', 'Gujarat')
        district = validated_data.pop('district', None) or None
        taluka = validated_data.pop('taluka', None) or None
        village = validated_data.pop('village', None) or None
        farm_size = validated_data.pop('farm_size', 1.0)
        preferred_language = validated_data.pop('preferred_language', 'en')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )

        FarmerProfile.objects.create(
            user=user,
            full_name=full_name,
            phone_number=phone_number,
            state=state,
            district=district,
            taluka=taluka,
            village=village,
            farm_size=farm_size,
            preferred_language=preferred_language
        )

        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
