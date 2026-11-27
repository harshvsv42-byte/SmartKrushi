from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


# Existing District model preserved for backward compatibility
class District(models.Model):
    district_id = models.AutoField(primary_key=True)
    state = models.CharField(max_length=100)
    district_name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return f"{self.district_name}, {self.state}"

    class Meta:
        db_table = 'districts'
        ordering = ['district_name']


class SoilRecord(models.Model):
    SOIL_TYPE_CHOICES = [
        ('Alluvial', 'Alluvial Soil'),
        ('Black', 'Black Soil / Regur'),
        ('Red', 'Red Soil'),
        ('Laterite', 'Laterite Soil'),
        ('Sandy Loam', 'Sandy Loam Soil'),
        ('Clay Loam', 'Clay Loam Soil'),
        ('Saline', 'Saline / Alkaline Soil'),
        ('Peaty', 'Peaty / Marshy Soil'),
        ('Desert', 'Desert / Arid Soil'),
        ('Other', 'Other'),
    ]

    state = models.CharField(max_length=100, db_index=True)
    district = models.CharField(max_length=100, db_index=True)
    taluka = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    village = models.CharField(max_length=100, blank=True, null=True, db_index=True)

    soil_name = models.CharField(max_length=100, blank=True, null=True)
    soil_type = models.CharField(max_length=100, choices=SOIL_TYPE_CHOICES, default='Black', db_index=True)
    soil_texture = models.CharField(max_length=100, blank=True, null=True)

    # Chemical properties
    soil_ph = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(14.0)],
        help_text="pH scale from 0 to 14"
    )
    electrical_conductivity = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0)],
        help_text="Electrical conductivity in dS/m"
    )
    organic_carbon = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="Organic Carbon percentage (%)"
    )

    # Macronutrients (kg/ha)
    nitrogen = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0)],
        help_text="Available Nitrogen (N) in kg/ha"
    )
    phosphorus = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0)],
        help_text="Available Phosphorus (P) in kg/ha"
    )
    potassium = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0)],
        help_text="Available Potassium (K) in kg/ha"
    )

    # Micronutrients / Secondary (ppm or kg/ha)
    sulphur = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)], help_text="Sulphur (S) in ppm")
    zinc = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)], help_text="Zinc (Zn) in ppm")
    iron = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)], help_text="Iron (Fe) in ppm")
    boron = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0.0)], help_text="Boron (B) in ppm")

    # Physical composition (%)
    sand_percentage = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    silt_percentage = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )
    clay_percentage = models.FloatField(
        null=True, blank=True,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)]
    )

    sample_date = models.DateField(null=True, blank=True)
    data_source = models.CharField(max_length=150, default='Soil Health Card / Field Test')
    remarks = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'soil_records'
        ordering = ['-sample_date', '-created_at']
        indexes = [
            models.Index(fields=['state', 'district']),
            models.Index(fields=['soil_type']),
            models.Index(fields=['soil_ph']),
        ]

    def __str__(self):
        loc = f"{self.district}, {self.state}"
        if self.taluka:
            loc = f"{self.taluka}, {loc}"
        return f"Soil Record #{self.id} ({self.soil_type}, pH={self.soil_ph}) - {loc}"

    def clean(self):
        super().clean()
        percentages = [self.sand_percentage, self.silt_percentage, self.clay_percentage]
        if all(p is not None for p in percentages):
            total = sum(percentages)
            if abs(total - 100.0) > 1.0:
                from django.core.exceptions import ValidationError
                raise ValidationError("Sand, silt, and clay percentages must sum to approximately 100%.")

    @property
    def ph_category(self):
        if self.soil_ph < 5.5:
            return "Strongly Acidic"
        elif self.soil_ph < 6.5:
            return "Slightly Acidic"
        elif self.soil_ph <= 7.5:
            return "Neutral / Optimal"
        elif self.soil_ph <= 8.5:
            return "Moderately Alkaline"
        else:
            return "Strongly Alkaline"