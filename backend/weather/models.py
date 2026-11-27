from django.db import models


class WeatherRecord(models.Model):
    state = models.CharField(max_length=100, db_index=True)
    district = models.CharField(max_length=100, db_index=True)
    taluka = models.CharField(max_length=100, blank=True, null=True, db_index=True)
    village = models.CharField(max_length=100, blank=True, null=True, db_index=True)

    latitude = models.FloatField(db_index=True)
    longitude = models.FloatField(db_index=True)

    temperature = models.FloatField(help_text="Temperature in °C")
    feels_like = models.FloatField(null=True, blank=True, help_text="Apparent temperature in °C")
    humidity = models.FloatField(help_text="Relative humidity in %")
    rainfall = models.FloatField(default=0.0, help_text="Precipitation / rainfall in mm")
    wind_speed = models.FloatField(default=0.0, help_text="Wind speed in km/h")
    wind_direction = models.FloatField(null=True, blank=True, help_text="Wind direction in degrees")
    pressure = models.FloatField(null=True, blank=True, help_text="Surface pressure in hPa")
    weather_condition = models.CharField(max_length=100, default='Clear')

    recorded_at = models.DateTimeField(db_index=True)
    data_source = models.CharField(max_length=100, default='Open-Meteo API')
    is_manual = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'weather_records'
        ordering = ['-recorded_at']
        unique_together = ('latitude', 'longitude', 'recorded_at')
        indexes = [
            models.Index(fields=['state', 'district', 'recorded_at']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def __str__(self):
        source = "Manual" if self.is_manual else "Live/API"
        return f"{self.district} ({self.temperature}°C, {self.weather_condition}) @ {self.recorded_at} [{source}]"
