from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator


class FarmerProfile(models.Model):
    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('gu', 'Gujarati'),
        ('hi', 'Hindi'),
        ('mr', 'Marathi'),
        ('ta', 'Tamil'),
        ('te', 'Telugu'),
        ('kn', 'Kannada'),
    ]

    ROLE_CHOICES = [
        ('FARMER', 'Farmer'),
        ('AGRI_EXPERT', 'Agricultural Officer / Expert'),
        ('ADMIN', 'System Administrator'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farmer_profile')
    full_name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20, unique=True, null=True, blank=True)

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='FARMER')

    state = models.CharField(max_length=100, default='Gujarat', db_index=True)
    district = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    taluka = models.CharField(max_length=100, blank=True, null=True)
    village = models.CharField(max_length=100, blank=True, null=True)

    farm_size = models.FloatField(
        default=1.0,
        validators=[MinValueValidator(0.0)],
        help_text="Farm size in hectares"
    )
    primary_crops = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Cotton, Wheat, Groundnut")
    preferred_language = models.CharField(max_length=10, choices=LANGUAGE_CHOICES, default='en')
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'farmer_profiles'
        ordering = ['full_name']

    def __str__(self):
        return f"{self.full_name} ({self.district}, {self.state}) - {self.phone_number or self.user.username}"
