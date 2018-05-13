from django import forms
from .models import Patient, BirthHistory

class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'


class History(forms.ModelForm):
    class Meta:
        model = BirthHistory
        fields = '__all__'
