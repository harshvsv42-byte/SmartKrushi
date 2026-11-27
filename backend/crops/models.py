from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Preserved legacy CropData model
class CropData(models.Model):
    crop_record_id = models.AutoField(primary_key=True)
    state = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    crop_name = models.CharField(max_length=100)
    growing_season = models.CharField(max_length=50)
    crop_duration_days = models.PositiveIntegerField()
    illustrative_yield_kg_ha = models.FloatField()

    def __str__(self):
        return f"{self.crop_name} - {self.district}"

    class Meta:
        db_table = 'crop_data'
        ordering = ['state', 'district', 'crop_name']


class Crop(models.Model):
    CATEGORY_CHOICES = [
        ('Cereal', 'Cereal'),
        ('Pulse', 'Pulse / Legume'),
        ('Oilseed', 'Oilseed'),
        ('Cash Crop', 'Cash Crop / Commercial'),
        ('Fiber', 'Fiber Crop'),
        ('Vegetable', 'Vegetable'),
        ('Fruit', 'Fruit'),
        ('Spice', 'Spice / Condiment'),
        ('Fodder', 'Fodder'),
        ('Medicinal', 'Medicinal & Aromatic'),
        ('Other', 'Other'),
    ]

    SEASON_CHOICES = [
        ('Kharif', 'Kharif (Monsoon)'),
        ('Rabi', 'Rabi (Winter)'),
        ('Zaid', 'Zaid (Summer)'),
        ('Annual', 'Annual / Year-Round'),
        ('Perennial', 'Perennial'),
    ]

    crop_name = models.CharField(max_length=100, unique=True, db_index=True)
    scientific_name = models.CharField(max_length=150, blank=True, null=True)
    crop_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Cereal')
    crop_description = models.TextField(blank=True, null=True)
    growing_season = models.CharField(max_length=50, choices=SEASON_CHOICES, default='Kharif', db_index=True)
    crop_duration_days = models.PositiveIntegerField(default=120)

    # Agronomic tolerances
    suitable_soil = models.CharField(max_length=255, default='Alluvial, Black soil, Sandy Loam')
    suitable_ph_min = models.FloatField(
        default=6.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(14.0)]
    )
    suitable_ph_max = models.FloatField(
        default=7.5,
        validators=[MinValueValidator(0.0), MaxValueValidator(14.0)]
    )
    temperature_min = models.FloatField(default=15.0, help_text="Minimum temperature in °C")
    temperature_max = models.FloatField(default=35.0, help_text="Maximum temperature in °C")

    # Water & nutrients
    water_requirement = models.CharField(
        max_length=50,
        choices=[('Low', 'Low'), ('Medium', 'Medium'), ('High', 'High')],
        default='Medium'
    )
    rainfall_requirement = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. 600-1000 mm")
    fertilizer_requirement = models.TextField(blank=True, null=True, help_text="Recommended N:P:K ratio or dosage")

    # Cultivation timeline
    sowing_period = models.CharField(max_length=100, blank=True, null=True)
    harvesting_period = models.CharField(max_length=100, blank=True, null=True)
    irrigation_method = models.CharField(max_length=100, blank=True, null=True)
    common_diseases = models.TextField(blank=True, null=True)

    image = models.ImageField(upload_to='crops/images/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'crops'
        ordering = ['crop_name']

    def __str__(self):
        return f"{self.crop_name} ({self.growing_season})"


class CropRecord(models.Model):
    state = models.CharField(max_length=100, db_index=True)
    district = models.CharField(max_length=100, db_index=True)
    taluka = models.CharField(max_length=100, blank=True, null=True, db_index=True)

    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True, related_name='records')
    crop_name = models.CharField(max_length=100, db_index=True)

    growing_season = models.CharField(max_length=50, db_index=True)
    crop_duration_days = models.PositiveIntegerField(default=120)

    area_hectares = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    production_tonnes = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])
    yield_kg_per_hectare = models.FloatField(default=0.0, validators=[MinValueValidator(0.0)])

    year = models.PositiveIntegerField(default=2024, db_index=True)
    data_source = models.CharField(max_length=150, default='State Agriculture Department')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'crop_records'
        ordering = ['-year', 'state', 'district', 'crop_name']
        indexes = [
            models.Index(fields=['state', 'district', 'year']),
            models.Index(fields=['crop_name', 'growing_season']),
        ]

    def __str__(self):
        return f"{self.crop_name} in {self.district} ({self.year}) - {self.yield_kg_per_hectare} kg/ha"

    def save(self, *args, **kwargs):
        # Auto-compute yield if area and production are provided
        if self.area_hectares > 0 and self.production_tonnes > 0 and (not self.yield_kg_per_hectare or self.yield_kg_per_hectare == 0.0):
            self.yield_kg_per_hectare = round((self.production_tonnes * 1000.0) / self.area_hectares, 2)
        # Link to Crop model if available
        if not self.crop_id and self.crop_name:
            match = Crop.objects.filter(crop_name__iexact=self.crop_name).first()
            if match:
                self.crop = match
        super().save(*args, **kwargs)