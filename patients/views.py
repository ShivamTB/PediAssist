from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
from . import forms
from .models import Patient, Vaccination, Visit
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core import serializers
from datetime import datetime, timezone, date
from dateutil.relativedelta import relativedelta
from doctor.views import home
from django.views.decorators.csrf import csrf_exempt

import json

def index(request):
    if not request.user.is_authenticated:
        return redirect(home)
    patient_list = Patient.objects.filter(doctor = request.user)
    my_dict = {'patients': patient_list}
    return render(request,'first_app/index.html',context=my_dict)

def patient_fetch(request, pk):
    if not request.user.is_authenticated:
        return redirect(home)
    data = dict()
    patient = get_object_or_404(Patient, pk=pk, doctor = request.user)
    rdelta = relativedelta(datetime.now(timezone.utc), patient.dob)
    if (patient.last_height != 0 ):
        bmi = (patient.last_weight)/((patient.last_height/100)*(patient.last_height/100))
        bmi = round(bmi,2)
    else:
        bmi = "Not Defined"

    age = str(rdelta.years) + ' yrs, ' + str(rdelta.months) + ' m, ' + str(rdelta.days) + ' d'
    data['html_patient_info'] = render_to_string('first_app/patient-info.html', {
        'patient': patient, 'age': age, 'bmi': bmi
    })
    return JsonResponse(data)

def save_patient_form(request, form, template_name):
    data = dict()

    if form.is_valid():

        patient = form.save(commit=False)
        patient.doctor = request.user
        patient.save()
        data['form_is_valid'] = True
        print(patient.pk)
        data['pk'] = patient.pk
        patients = Patient.objects.filter(doctor = request.user)
        data['html_patient_list'] = render_to_string('first_app/patient_list.html', {
            'patients': patients
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def patient_create(request):

    if request.method == 'POST':
        form = forms.PatientForm(request.POST)
        form.doctor = request.user
    else:
        form = forms.PatientForm()
    return save_patient_form(request, form, 'first_app/includes/partial_patients_create.html')

def patient_update(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    if request.method == 'POST':
        form = forms.PatientForm(request.POST, instance=patient)
    else:
        form = forms.PatientForm(instance=patient)
    return save_patient_form(request, form, 'first_app/includes/partial_patient_update.html')

def patient_delete(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    data = dict()
    if request.method == 'POST':
        patient.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        patients = Patient.objects.all()
        data['html_patient_list'] = render_to_string('first_app/includes/partial_patient_list.html', {
            'patients': patients
        })
    else:
        context = {'patient': patient}
        data['html_form'] = render_to_string('first_app/includes/partial_patient_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)


def save_history_form(request, form, template_name):
    data = dict()

    if form.is_valid():
        history = form.save()
        data['form_is_valid'] = True
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def history_create(request):
    #patient = get_object_or_404(Patient, pat_id)
    #history=BirthHistory(patient=patient)
    if request.method == 'POST':
        form = forms.History(request.POST)
    else:
        form = forms.History()
    return save_history_form(request, form, 'first_app/includes/partial_history_create.html')

def history_update(request, pk):
    history = get_object_or_404(BirthHistory, pk=pk)
    if request.method == 'POST':
        form = forms.History(request.POST, instance=history)
    else:
        form = forms.History(instance=history)
    return save_history_form(request, form, 'first_app/includes/partial_history_update.html')

def vaccination_list(request):
    vaccinations = Vaccination.objects.all()
    return render(request, 'masters/vaccination_list.html', {'vaccinations': vaccinations})

def save_vaccination_form(request, form, template_name):
    data = dict()
    if form.is_valid():

        vaccination = form.save(commit=False)
        vaccination.doctor = request.user
        vaccination = vaccination.save()
        data['form_is_valid'] = True
        vaccinations = Vaccination.objects.all()
        data['html_vaccination_list'] = render_to_string('masters/includes/partial_vaccination_list.html', {
            'vaccinations': vaccinations
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def vaccination_create(request):
    #patient = get_object_or_404(Patient, pat_id)
    #vaccination=Vaccination(patient=patient)
    if request.method == 'POST':
        form = forms.VaccinationForm(request.POST)
    else:
        form = forms.VaccinationForm()
    return save_vaccination_form(request, form, 'masters/includes/partial_vaccination_create.html')

def vaccination_update(request, pk):
    vaccination = get_object_or_404(Vaccination, pk=pk)
    if request.method == 'POST':
        form = forms.VaccinationForm(request.POST, instance=vaccination)
    else:
        form = forms.VaccinationForm(instance=vaccination)
    return save_vaccination_form(request, form, 'masters/includes/partial_vaccination_update.html')

def vaccination_delete(request, pk):
    vaccination = get_object_or_404(Vaccination, pk=pk)
    data = dict()
    if request.method == 'POST':
        vaccination.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        vaccinations = Vaccination.objects.all()
        data['html_vaccination_list'] = render_to_string('masters/includes/partial_vaccination_list.html', {
            'vaccinations': vaccinations
        })
    else:
        context = {'vaccination': vaccination}
        data['html_form'] = render_to_string('masters/includes/partial_vaccination_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)

@csrf_exempt
def update_info(request):
    data = dict()
    print(request.body)
    if request.method == 'POST':
        objs = json.loads(request.body)
        patient = get_object_or_404(Patient, pk = objs['patientInfo']['key'])
        patient.last_weight = objs['patientInfo']['weight'],
        patient.last_headcm = objs['patientInfo']['headCircumference'],
        patient.last_height = objs['patientInfo']['height'],
        visit = Visit.objects.get_or_create(
            patient = patient,
            weight = objs['patientInfo']['weight'],
            height = objs['patientInfo']['height'],
            headcm = objs['patientInfo']['headCircumference'],
            bp_systolic = objs['patientInfo']['bpSystolic'],
            bp_diastolic = objs['patientInfo']['bpDiastolic'],
            charges = 1000
            #diagnosis = objs['patientCaseInfo']['diagnosis'],
            #signs = objs['patientCaseInfo']['signs'],
            #symptoms = objs['patientCaseInfo']['diagnosis'],
            #treatment = objs['patientCaseInfo']['diagnosis'],
            )[0]
        visit.save()
        patient.save()


    return JsonResponse(data)
