from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
from . import forms
from .models import Patient, Vaccination
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core import serializers
from datetime import datetime
from doctor.views import home


import json

def index(request):
    if not request.user.is_authenticated:
        return redirect(home)
    patient_list = Patient.objects.all()
    my_dict = {'patients': patient_list}
    return render(request,'first_app/index.html',context=my_dict)

def patient_fetch(request, pk):
    patient = get_object_or_404(Patient, pk=pk)
    patient = serializers.serialize('json', [patient])
    struct = json.loads(patient)
    patient = json.dumps(struct[0])
    return JsonResponse(patient, safe=False)

def save_patient_form(request, form, template_name):
    data = dict()

    if form.is_valid():

        patient = form.save(commit=False)
        patient.doctor = request.user
        patient.save()
        data['form_is_valid'] = True
        print(patient.pk)
        data['pk'] = patient.pk
        patients = Patient.objects.all()
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
        form.save
        data['form_is_valid'] = True
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def history_create(request):

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

    if request.method == 'POST':
        form = forms.VaccinationForm(request.POST)
        form.doctor = request.user
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
