from django.db import models


class State(models.Model):
    state_name = models.CharField(max_length=100, unique=True, db_index=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations_states'
        ordering = ['state_name']

    def __str__(self):
        return self.state_name


class District(models.Model):
    state = models.ForeignKey(State, on_delete=models.CASCADE, related_name='districts')
    district_name = models.CharField(max_length=100, db_index=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations_districts'
        unique_together = ('state', 'district_name')
        ordering = ['state', 'district_name']

    def __str__(self):
        return f"{self.district_name}, {self.state.state_name}"


class Taluka(models.Model):
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='talukas')
    taluka_name = models.CharField(max_length=100, db_index=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations_talukas'
        unique_together = ('district', 'taluka_name')
        ordering = ['district', 'taluka_name']

    def __str__(self):
        return f"{self.taluka_name} ({self.district.district_name})"


class Village(models.Model):
    taluka = models.ForeignKey(Taluka, on_delete=models.CASCADE, related_name='villages')
    village_name = models.CharField(max_length=100, db_index=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'locations_villages'
        unique_together = ('taluka', 'village_name')
        ordering = ['taluka', 'village_name']

    def __str__(self):
        return f"{self.village_name} ({self.taluka.taluka_name})"
