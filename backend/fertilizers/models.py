from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Fertilizer(models.Model):
    TYPE_CHOICES = [
        ('Chemical', 'Chemical / Synthetic Fertilizer'),
        ('Organic', 'Organic Fertilizer / Manure'),
        ('Bio-fertilizer', 'Bio-fertilizer / Microbial Inoculant'),
        ('Micronutrient', 'Micronutrient Fertilizer'),
        ('Water Soluble', 'Water Soluble / Fertigation'),
    ]

    fertilizer_name = models.CharField(max_length=150, unique=True, db_index=True)
    fertilizer_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='Chemical', db_index=True)

    # Nutrient composition percentages
    nitrogen_percentage = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="N percentage (%)"
    )
    phosphorus_percentage = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="P2O5 percentage (%)"
    )
    potassium_percentage = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="K2O percentage (%)"
    )
    sulphur_percentage = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(100.0)],
        help_text="S percentage (%)"
    )

    recommended_crops = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Comma-separated crops or 'All crops', 'Cereals', 'Pulses', etc."
    )
    application_method = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        help_text="e.g. Basal broadcasting, Top dressing, Foliar spray, Drip fertigation"
    )
    dosage_per_hectare = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. 50-100 kg/ha")
    application_timing = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. At sowing, 30 days after sowing")
    precautions = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'fertilizers'
        ordering = ['fertilizer_name']

    def __str__(self):
        npk = f"({self.nitrogen_percentage}-{self.phosphorus_percentage}-{self.potassium_percentage})"
        return f"{self.fertilizer_name} {npk} [{self.fertilizer_type}]"
