from django.db import models
from django.core.validators import RegexValidator

from masters.models import Vaccine
from django.contrib.auth import get_user_model
Doctor = get_user_model()

class Patient(models.Model):
    doctor = models.ForeignKey(Doctor, related_name='doctor', on_delete=models.DO_NOTHING, blank=True)
    pat_number = models.PositiveSmallIntegerField(default = 0)
    first_name = models.CharField(max_length=32)

    sur_name = models.CharField(max_length=32, blank=True)
    status = models.BooleanField(default=True)
    dob = models.DateTimeField(auto_now=False, auto_now_add=False, blank=True, null=True)
    sex_choices = (('G', 'Gender'),('M', 'Male'),('F','Female'))
    sex = models.CharField(max_length = 1, choices = sex_choices, default='G', blank=True, null=True)
    blood = models.CharField(max_length=3, blank=True, null=True)
    registration_date = models.DateTimeField(auto_now=False, auto_now_add=True, blank=True, null=True)

    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")

    father_name = models.CharField(max_length=32, blank=True, null=True)
    father_blood = models.CharField(max_length=3, blank=True, null=True)
    father_occupation = models.CharField(max_length=32, blank=True, null=True)
    father_phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True, null=True)
    father_email = models.EmailField(max_length=254, blank=True, null=True)

    mother_name = models.CharField(max_length=32, blank=True, null=True)
    mother_blood = models.CharField(max_length=3, blank=True, null=True)
    mother_occupation = models.CharField(max_length=32, blank=True, null=True)
    mother_phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True, null=True)
    mother_email = models.EmailField(max_length=254, blank=True, null=True)

    address = models.TextField(blank=True, null=True)
    city =  models.CharField(max_length = 32, blank=True, null=True)
    state = models.CharField(max_length = 32, blank=True, null=True)
    pin_code = models.CharField(max_length = 6, blank=True, null=True)

    pob = models.CharField(max_length = 32, blank=True, null=True)
    delivery_doctor = models.CharField(max_length = 32, blank=True, null=True)

    birth_weight = models.DecimalField(max_digits=6, decimal_places=2,default=0, blank=True, null=True)
    birth_height = models.DecimalField(max_digits=3, decimal_places=1,default=0, blank=True, null=True)
    birth_headcm = models.DecimalField(max_digits=3, decimal_places=1,default=0, blank=True, null=True)

    last_weight = models.DecimalField(max_digits=6, decimal_places=2,default=0, blank=True, null=True)
    last_height = models.DecimalField(max_digits=4, decimal_places=1,default=0, blank=True, null=True)
    last_headcm = models.DecimalField(max_digits=4, decimal_places=1,default=0, blank=True, null=True)
    last_date = models.DateTimeField(auto_now=True, auto_now_add=False, blank=True, null=True)
    last_note = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return self.first_name

class BirthHistory(models.Model):
    patient = models.OneToOneField('Patient', on_delete=models.CASCADE)
    gestation = models.PositiveSmallIntegerField()
    mod_choices = (('1', 'Vaginal Delivery'),('2','Breech Delivery'),('3', 'Vaccum Delivery'),('4','Forceps Delivery'),('5', 'Cesarian'))
    mode_of_delivery = models.CharField(max_length = 1, choices = mod_choices, blank=True, null=True)
    indication = models.CharField(max_length=64, blank=True, null=True)
    #try to make indication an optional field to appear after mod
    #MANAGEMENT IN NICU
    nicu_duration = models.PositiveSmallIntegerField()
    diagnosis = models.TextField(blank=True, null=True)
    surfuctant = models.CharField(max_length=16, blank=True, null=True)
    #invasive  ventilation
    inv_vent_type =  models.CharField(max_length=16, blank=True, null=True)
    inv_vent_duration = models.PositiveSmallIntegerField()
    #nonInvasiveVentilation
    non_inv_vent_type =  models.CharField(max_length=16, blank=True, null=True)
    non_inv_vent_duration = models.PositiveSmallIntegerField()
    #TPN
    tpn_type = models.CharField(max_length=16, blank=True, null=True)
    start_day = models.PositiveSmallIntegerField()
    tpn_duration = models.PositiveSmallIntegerField()
    #sepsis
    culture = models.BooleanField(default=True)
    bacteria = models.CharField(max_length=32, blank=True, null=True)
    antibiotics = models.TextField(blank=True, null=True)
    #complications
    complications = models.TextField(blank=True, null=True)
    #PHOTOTHERAPY
    phototherapy_day = models.PositiveSmallIntegerField()
    onset_day = models.PositiveSmallIntegerField()
    congenital_malformations =  models.TextField(blank=True, null=True)
    congenital_disease = models.TextField(blank=True, null=True)

class Inventory(models.Model):
    vaccine = models.ForeignKey(Vaccine, on_delete=models.DO_NOTHING)
    company = models.CharField(max_length=16)
    batch = models.CharField(max_length=16)
    quantity = models.PositiveSmallIntegerField()
    expiry = models.DateField(auto_now=False, auto_now_add=False)
    def __str__(self):
        return self.batch

class Vaccination(models.Model):
    patient = models.ForeignKey('Patient', on_delete=models.DO_NOTHING,)
    vaccine = models.ForeignKey(Vaccine, on_delete=models.DO_NOTHING,)
    inventory = models.ForeignKey('Inventory', on_delete=models.DO_NOTHING,)
    vac_scheduled_date = models.DateField(auto_now=False, auto_now_add=False)
    vac_actual_date = models.DateField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return str(self.vac_actual_date)

class Visit(models.Model):
    patient = models.ForeignKey('Patient', on_delete=models.DO_NOTHING,)
    date = models.DateTimeField(auto_now=False, auto_now_add=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2,default=0)
    height = models.DecimalField(max_digits=4, decimal_places=1,default=0)
    headcm = models.DecimalField(max_digits=4, decimal_places=1,default=0)
    bp_systolic = models.DecimalField(max_digits = 3, decimal_places=0)
    bp_diastolic = models.DecimalField(max_digits = 3, decimal_places=0)
    charges = models.DecimalField(max_digits = 5, decimal_places=0)
    signs = models.CharField(max_length=256, blank = True)
    symptoms = models.CharField(max_length=256, blank = True)
    diagonsis = models.CharField(max_length=256, blank = True)
    investigations = models.CharField(max_length=256, blank = True)
    treatment = models.TextField(null=True)
    vaccination = models.ForeignKey('Vaccination', on_delete=models.DO_NOTHING, null=True)
    next_date = models.DateTimeField(auto_now=False, auto_now_add=False)

    def __str__(self):
        return str(self.date)
