from .models import Doctor

class DoctorAuth(object):

    def authenticate(self, username=None, password=None):
        try:
            user = Doctor.objects.get(email=username)
            if user.check_password(password):
                return user
        except Doctor.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            user = Doctor.objects.get(pk=user_id)
            if user.is_active:
                return user
            return None
        except Doctor.DoesNotExist:
            return None
