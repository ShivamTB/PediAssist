from django import forms
from .models import Patient, BirthHistory, Vaccination
from django.utils.translation import ugettext_lazy as _


class DateInput(forms.DateInput):
    input_type = 'date'


class PatientForm(forms.ModelForm):
    class Meta:
        model = Patient
        fields = '__all__'
        widgets = {
            'dob': DateInput()
        }
        labels = {
            'father_name': _("Father's Name"),
            'father_blood': _("Father's Blood Group"),
            'father_email': _("Father's Email"),
            'father_occupation': _("Father's Occupation"),
            'father_phone_number': _("Father's Phone Number"),
            'mother_name': _("Mother's Name"),
            'mother_blood': _("Mother's Blood Group"),
            'mother_email': _("Mother's Email"),
            'mother_occupation': _("Mother's Occupation"),
            'mother_phone_number': _("Mother's Phone Number"),
        }

class History(forms.ModelForm):
    class Meta:
        model = BirthHistory
        exclude = ('patient',)



class VaccinationForm(forms.ModelForm):
    class Meta:
        model = Vaccination
        exclude = ('patient', 'confirmed')
