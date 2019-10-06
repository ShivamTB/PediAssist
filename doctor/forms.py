from allauth.account.forms import SignupForm
from django import forms


class DoctorSignupForm(SignupForm):
    first_name = forms.CharField(max_length=64, label='First Name')
    last_name = forms.CharField(max_length=64, label='Last Name')
    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()
        return user