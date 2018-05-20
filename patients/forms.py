from django import forms
from .models import Patient, BirthHistory, Vaccination

class DateInput(forms.DateInput):
    input_type = 'date'


class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'
        widgets = {
            'dob': DateInput()
        }

class History(forms.ModelForm):
    class Meta:
        model = BirthHistory
        fields = '__all__'


class VaccinationForm(forms.ModelForm):
    class Meta:
        model = Vaccination
        fields = '__all__'
