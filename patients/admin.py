from django.contrib import admin

# Register your models here.
from .models import Patient, Visit, Vaccination, BirthHistory

admin.site.register(Patient)
admin.site.register(Visit)
admin.site.register(Vaccination)
admin.site.register(BirthHistory)
