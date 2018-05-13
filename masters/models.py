from django.db import models

# Create your models here.
class Generic(models.Model):
    name = models.CharField(max_length=64)
    side_effects = models.TextField(null = True, blank = True)
    def __str__(self):
        return str(self.name)

class Vaccine(models.Model):
    name = models.CharField(max_length=16, blank = True, null=True)
    previous = models.PositiveSmallIntegerField(blank = True, null=True)
    compound1 = models.PositiveSmallIntegerField(blank = True, null=True)
    compound2 = models.PositiveSmallIntegerField(blank = True, null=True)
    compound3 = models.PositiveSmallIntegerField(blank = True, null=True)
    compound4 = models.PositiveSmallIntegerField(blank = True, null=True)
    charges = models.DecimalField(max_digits = 5, decimal_places=0)
    notes = models.TextField()

    def __str__(self):
        return self.name

class Sign(models.Model):
    name = models.CharField(max_length=16, blank = True, null=True)

class Symptom(models.Model):
    name = models.CharField(max_length=16, blank = True, null=True)
