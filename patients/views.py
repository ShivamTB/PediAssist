from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from . import forms
from .models import Patient, Vaccination, Visit, BirthHistory
from django.template.loader import render_to_string
from django.core import serializers
from datetime import datetime, timezone, date
from dateutil.relativedelta import relativedelta
# from doctor.views import home
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
import json

def index(request):
    # if not request.user.is_authenticated:
    #     return redirect(home)
    patient_list = Patient.objects.filter(doctor = request.user).order_by('id')
    my_dict = {'patients': patient_list}
    return render(request,'first_app/index.html',context=my_dict)

def patient_fetch(request, pk):
    # if not request.user.is_authenticated:
    #     return redirect(home)
    data = dict()
    patient = get_object_or_404(Patient, pk=pk, doctor = request.user)
    vaccinations = Vaccination.objects.filter(patient = patient, confirmed = False)
    for vacs in vaccinations:
            vacs.delete()
    rdelta = relativedelta(datetime.now(timezone.utc), patient.dob)
    if (patient.last_height != 0 and not None):
        bmi = (patient.last_weight)/((patient.last_height/100)*(patient.last_height/100))
        bmi = round(bmi,2)
    else:
        bmi = "Not Defined"

    age = str(rdelta.years) + ' yrs, ' + str(rdelta.months) + ' m, ' + str(rdelta.days) + ' d'
    data['html_patient_info'] = render_to_string('first_app/patient-info.html', {
        'patient_i': patient, 'age': age, 'bmi': bmi
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


def save_history_form(request, patient, form, template_name):
    data = dict()

    if form.is_valid():
        form.save()
        data['form_is_valid'] = True
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form, 'patient': patient}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def history_create(request, pat_id):
    patient = get_object_or_404(Patient, pk=pat_id)
    history= BirthHistory.objects.get_or_create(patient=patient)[0]
    if request.method == 'POST':
        print("POST " + str(history))
        form = forms.History(request.POST, instance = history)
    else:
        print("NOT POST " + str(history))
        form = forms.History(instance = history)
    return save_history_form(request, patient, form, 'first_app/includes/partial_history_create.html')


def vaccination_list(request, pat_id):
    patient = get_object_or_404(Patient, pk=pat_id)
    vaccinations = Vaccination.objects.filter(patient = patient)
    return render(request, 'masters/vaccinations_list.html', {'vaccinations': vaccinations})

def visit_list(request, pat_id):
    patient = get_object_or_404(Patient, pk=pat_id)
    visits = Visit.objects.filter(patient = patient).order_by('date').reverse()
    return render(request, 'masters/visit_list.html', {'visits': visits})


def save_vaccination_form(request, patient, form, template_name):
    data = dict()
    if form.is_valid():

        form.save()
        data['form_is_valid'] = True
        vaccinations = Vaccination.objects.filter(patient = patient, confirmed=False)
        data['html_vaccination_list'] = render_to_string('masters/includes/partial_vaccination_list.html', {
            'vaccinations': vaccinations
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form, 'patient': patient}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def vaccination_create(request, pat_id):
    patient = get_object_or_404(Patient, pk=pat_id)
    vaccination=Vaccination(patient=patient)
    if request.method == 'POST':
        print("post")
        form = forms.VaccinationForm(request.POST, instance = vaccination)
    else:
        print("not post")
        form = forms.VaccinationForm(instance = vaccination)
    return save_vaccination_form(request, patient, form, 'masters/includes/partial_vaccination_create.html')

def vaccination_update(request, pk):
    vaccination = get_object_or_404(Vaccination, pk=pk)
    patient = None
    if request.method == 'POST':
        form = forms.VaccinationForm(request.POST, instance=vaccination)
    else:
        form = forms.VaccinationForm(instance=vaccination)
    return save_vaccination_form(request, patient, form, 'masters/includes/partial_vaccination_update.html')

def vaccination_delete(request, pk):
    vaccination = get_object_or_404(Vaccination, pk=pk)
    data = dict()
    if request.method == 'POST':
        patient = vaccination.patient
        vaccination.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        vaccinations = Vaccination.objects.filter(patient = patient, confirmed=False)
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
def update_info(request, pat_id):
    data = dict()
    print(request.body)
    patient = get_object_or_404(Patient, pk=pat_id)
    print(patient)
    if request.method == 'POST' and patient.doctor == request.user:
        objs = json.loads(request.body)
        patient.last_weight = Decimal(objs['patientInfo']['weight'])
        patient.last_headcm = Decimal(objs['patientInfo']['headCircumference'])
        patient.last_height = Decimal(objs['patientInfo']['height'])
        visit = Visit.objects.create(
            patient = patient,
            date = objs['patientInfo']['visitDate']
            )
        visit.weight = Decimal(objs['patientInfo']['weight'])
        visit.height = Decimal(objs['patientInfo']['height'])
        visit.headcm = Decimal(objs['patientInfo']['headCircumference'])
        visit.bp_systolic = int(objs['patientInfo']['bpSystolic'])
        visit.bp_diastolic = int(objs['patientInfo']['bpDiastolic'])
        visit.charges = int(objs['patientCaseInfo']['totalCharges'])
        visit.diagnosis = objs['patientCaseInfo']['diagnosis']
        visit.signs = objs['patientCaseInfo']['signs']
        visit.symptoms = objs['patientCaseInfo']['symptoms']
        visit.treatment = objs['patientCaseInfo']['diagnosis']
        visit.investigations = objs['patientCaseInfo']['investigations']
        visit.vaccination = objs['patientCaseInfo']['vaccinations']
        vaccinations = Vaccination.objects.filter(patient = patient, confirmed = False)
        for vacs in vaccinations:
            if str(vacs.vaccine) in objs['patientCaseInfo']['vaccinations']:
                vacs.confirmed = True
                print (visit.date)
                vacs.vac_actual_date = visit.date
                vacs.save()
            else:
                vacs.delete()
        print(visit)
        visit.save()
        print ("Victory")
        patient.save()
    return JsonResponse(data)
