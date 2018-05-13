from django.contrib.auth.forms import UserCreationForm, UserChangeForm

from .models import Doctor

class DoctorCreationForm(UserCreationForm):
    """
    A form that creates a user, with no privileges, from the given email and
    password.
    """

    def __init__(self, *args, **kargs):
        super(DoctorCreationForm, self).__init__(*args, **kargs)

    class Meta:
        model = Doctor
        fields = ("email","first_name","last_name")

class DoctorChangeForm(UserChangeForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """

    def __init__(self, *args, **kargs):
        super(DoctorChangeForm, self).__init__(*args, **kargs)

    class Meta:
        model = Doctor
        fields = '__all__'
