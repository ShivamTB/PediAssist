from django import forms
from .models import Vaccine, Generic, Sign, Symptom

class VaccineForm(forms.ModelForm):
    class Meta:
        model = Vaccine
        fields = '__all__'
        exclude = ('doctor',)

class GenericForm(forms.ModelForm):
    class Meta:
        model = Generic
        fields = '__all__'
        exclude = ('doctor',)

class SymptomForm(forms.ModelForm):
    class Meta:
        model = Symptom
        fields = '__all__'
        exclude = ('doctor',)

class SignForm(forms.ModelForm):
    class Meta:
        model = Sign
        fields = '__all__'
        exclude = ('doctor',)
