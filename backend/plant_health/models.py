from django.db import models

class PlantDisease(models.Model):
    CATEGORY_CHOICES = [
        ('Fungal', 'Fungal Disease'),
        ('Bacterial', 'Bacterial Disease'),
        ('Viral', 'Viral Disease'),
        ('Nematode', 'Nematode Infestation'),
        ('Physiological', 'Physiological / Abiotic Disorder'),
        ('Other', 'Other'),
    ]

    SEVERITY_CHOICES = [
        ('Low', 'Low Severity'),
        ('Medium', 'Medium Severity'),
        ('High', 'High Severity'),
        ('Critical', 'Critical / Epidemic Risk'),
    ]

    crop = models.ForeignKey(
        'crops.Crop',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='diseases'
    )
    crop_name = models.CharField(max_length=100, db_index=True, help_text="Common crop name (e.g. Wheat, Cotton)")
    disease_name = models.CharField(max_length=150, db_index=True)
    disease_category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Fungal')

    symptoms = models.TextField(help_text="Visible symptoms on leaves, stems, roots, or fruits")
    causes = models.TextField(blank=True, null=True, help_text="Causal organism, pathogen, or environmental triggers")
    prevention = models.TextField(blank=True, null=True, help_text="Preventive measures, crop rotation, resistant seeds")
    treatment = models.TextField(blank=True, null=True, help_text="Chemical fungicides/bactericides or organic bio-control")

    affected_plant_parts = models.CharField(max_length=200, blank=True, null=True, help_text="e.g. Leaves, Stem, Roots, Flowers, Pods")
    severity = models.CharField(max_length=50, choices=SEVERITY_CHOICES, default='Medium')

    image = models.ImageField(upload_to='plant_health/diseases/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'plant_diseases'
        ordering = ['crop_name', 'disease_name']
        indexes = [
            models.Index(fields=['crop_name', 'disease_name']),
            models.Index(fields=['disease_category']),
        ]

    def __str__(self):
        return f"{self.disease_name} on {self.crop_name} ({self.disease_category})"


class Pest(models.Model):
    pest_name = models.CharField(max_length=150, unique=True, db_index=True)
    scientific_name = models.CharField(max_length=150, blank=True, null=True)
    affected_crops = models.CharField(max_length=255, help_text="Comma-separated crops or 'Cotton, Groundnut, Soybean'")
    symptoms = models.TextField(help_text="Visual indicators of infestation")
    damage_description = models.TextField(blank=True, null=True, help_text="Nature of damage to the crop")
    prevention = models.TextField(blank=True, null=True, help_text="Pheromone traps, light traps, barrier crops")
    management_method = models.TextField(blank=True, null=True, help_text="Biological and chemical control methods")

    image = models.ImageField(upload_to='plant_health/pests/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pests'
        ordering = ['pest_name']

    def __str__(self):
        return self.pest_name
