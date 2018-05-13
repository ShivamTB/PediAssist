from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect
from . import forms
from .models import Vaccine, Sign, Symptom, Generic
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.core import serializers
from datetime import datetime
from doctor.views import home
import json

# Create your views here.
def generic_list(request):
    generics = Generic.objects.all()
    return render(request, 'masters/generic_list.html', {'generics': generics})

def save_generic_form(request, form, template_name):
    data = dict()

    if form.is_valid():

        generic = form.save(commit=False)
        generic.doctor = request.user
        generic = generic.save()
        data['form_is_valid'] = True
        generics = Generic.objects.all()
        data['html_generic_list'] = render_to_string('masters/includes/partial_generic_list.html', {
            'generics': generics
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def generic_create(request):

    if request.method == 'POST':
        form = forms.GenericForm(request.POST)
        form.doctor = request.user
    else:
        form = forms.GenericForm()
    return save_generic_form(request, form, 'masters/includes/partial_generic_create.html')

def generic_update(request, pk):
    generic = get_object_or_404(Generic, pk=pk)
    if request.method == 'POST':
        form = forms.GenericForm(request.POST, instance=generic)
    else:
        form = forms.GenericForm(instance=generic)
    return save_generic_form(request, form, 'masters/includes/partial_generic_update.html')

def generic_delete(request, pk):
    generic = get_object_or_404(Generic, pk=pk)
    data = dict()
    if request.method == 'POST':
        generic.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        generics = Generic.objects.all()
        data['html_generic_list'] = render_to_string('masters/includes/partial_generic_list.html', {
            'generics': generics
        })
    else:
        context = {'generic': generic}
        data['html_form'] = render_to_string('masters/includes/partial_generic_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)

def sign_list(request):
    signs = Sign.objects.all()
    return render(request, 'masters/sign_list.html', {'signs': signs})

def save_sign_form(request, form, template_name):
    data = dict()

    if form.is_valid():

        sign = form.save(commit=False)
        sign.doctor = request.user
        sign = sign.save()
        data['form_is_valid'] = True
        signs = Sign.objects.all()
        data['html_sign_list'] = render_to_string('masters/includes/partial_sign_list.html', {
            'signs': signs
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def sign_create(request):

    if request.method == 'POST':
        form = forms.SignForm(request.POST)
        form.doctor = request.user
    else:
        form = forms.SignForm()
    return save_sign_form(request, form, 'masters/includes/partial_sign_create.html')

def sign_update(request, pk):
    sign = get_object_or_404(Sign, pk=pk)
    if request.method == 'POST':
        form = forms.SignForm(request.POST, instance=sign)
    else:
        form = forms.SignForm(instance=sign)
    return save_sign_form(request, form, 'masters/includes/partial_sign_update.html')

def sign_delete(request, pk):
    sign = get_object_or_404(Sign, pk=pk)
    data = dict()
    if request.method == 'POST':
        sign.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        signs = Sign.objects.all()
        data['html_sign_list'] = render_to_string('masters/includes/partial_sign_list.html', {
            'signs': signs
        })
    else:
        context = {'sign': sign}
        data['html_form'] = render_to_string('masters/includes/partial_sign_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)

def vaccine_list(request):
    vaccines = Vaccine.objects.all()
    return render(request, 'masters/vaccine_list.html', {'vaccines': vaccines})

def save_vaccine_form(request, form, template_name):
    data = dict()

    if form.is_valid():

        vaccine = form.save(commit=False)
        vaccine.doctor = request.user
        vaccine = vaccine.save()
        data['form_is_valid'] = True
        vaccines = Vaccine.objects.all()
        data['html_vaccine_list'] = render_to_string('masters/includes/partial_vaccine_list.html', {
            'vaccines': vaccines
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def vaccine_create(request):

    if request.method == 'POST':
        form = forms.VaccineForm(request.POST)
        form.doctor = request.user
    else:
        form = forms.VaccineForm()
    return save_vaccine_form(request, form, 'masters/includes/partial_vaccine_create.html')

def vaccine_update(request, pk):
    vaccine = get_object_or_404(Vaccine, pk=pk)
    if request.method == 'POST':
        form = forms.VaccineForm(request.POST, instance=vaccine)
    else:
        form = forms.VaccineForm(instance=vaccine)
    return save_vaccine_form(request, form, 'masters/includes/partial_vaccine_update.html')

def vaccine_delete(request, pk):
    vaccine = get_object_or_404(Vaccine, pk=pk)
    data = dict()
    if request.method == 'POST':
        vaccine.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        vaccines = Vaccine.objects.all()
        data['html_vaccine_list'] = render_to_string('masters/includes/partial_vaccine_list.html', {
            'vaccines': vaccines
        })
    else:
        context = {'vaccine': vaccine}
        data['html_form'] = render_to_string('masters/includes/partial_vaccine_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)

def symptom_list(request):
    symptoms = Symptom.objects.all()
    return render(request, 'masters/symptom_list.html', {'symptoms': symptoms})

def save_symptom_form(request, form, template_name):
    data = dict()

    if form.is_valid():

        symptom = form.save(commit=False)
        symptom.doctor = request.user
        symptom = symptom.save()
        data['form_is_valid'] = True
        symptoms = Symptom.objects.all()
        data['html_symptom_list'] = render_to_string('masters/includes/partial_symptom_list.html', {
            'symptoms': symptoms
        })
    else:
        print(form.errors)
        data['form_is_valid'] = False

    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def symptom_create(request):

    if request.method == 'POST':
        form = forms.SymptomForm(request.POST)
        form.doctor = request.user
    else:
        form = forms.SymptomForm()
    return save_symptom_form(request, form, 'masters/includes/partial_symptom_create.html')

def symptom_update(request, pk):
    symptom = get_object_or_404(Symptom, pk=pk)
    if request.method == 'POST':
        form = forms.SymptomForm(request.POST, instance=symptom)
    else:
        form = forms.SymptomForm(instance=symptom)
    return save_symptom_form(request, form, 'masters/includes/partial_symptom_update.html')

def symptom_delete(request, pk):
    symptom = get_object_or_404(Symptom, pk=pk)
    data = dict()
    if request.method == 'POST':
        symptom.delete()
        data['form_is_valid'] = True  # This is just to play along with the existing code
        symptoms = Symptom.objects.all()
        data['html_symptom_list'] = render_to_string('masters/includes/partial_symptom_list.html', {
            'symptoms': symptoms
        })
    else:
        context = {'symptom': symptom}
        data['html_form'] = render_to_string('masters/includes/partial_symptom_delete.html',
            context,
            request=request,
        )
    return JsonResponse(data)
