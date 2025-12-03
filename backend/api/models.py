from django.db import models

# Create your models here.
class quest(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    level = models.IntegerField(default=1)
    is_completed = models.BooleanField(default=False)
    
    def __str__(self):
        return self.title