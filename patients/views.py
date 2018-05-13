from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
from . import forms
from .models import Patient
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


def save_history_form(request, form, template_name, pk):
    data = dict()

    if form.is_valid():
        hist = form.save(commit=False)
        pat = get_object_or_404(Patient, pk=pk)
        hist.patient = pat
        hist.save()
        data['form_is_valid'] = True
    else:
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def history_create(request, pk):

    if request.method == 'POST':
        form = forms.History(request.POST)
    else:
        form = forms.History()
    return save_history_form(request, form, 'first_app/includes/partial_history_create.html', pk)

def history_update(request, pk):
    history = get_object_or_404(BirthHistory, pk=pk)
    if request.method == 'POST':
        form = forms.History(request.POST, instance=history)
    else:
        form = forms.History(instance=history)
    return save_history_form(request, form, 'first_app/includes/partial_history_update.html')
