from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib import auth
from doctor.forms import DoctorCreationForm
from django.template.context_processors import csrf



def home(request):
    return render(request, "home.html")


def login(request):
    c = {}
    c.update(csrf(request))
    return render(request, 'login.html', c)



def auth_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)

    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect('/accounts/loggedin')
    else:
        return HttpResponseRedirect('/accounts/invalid')


def loggedin(request):
    return render(request, 'loggedin.html',
                  {'user': request.user })



def invalid_login(request):
    return render(request, 'invalid_login.html')



def logout(request):
    auth.logout(request)
    return render(request, 'logout.html')



def register_user(request):
    if request.method == 'POST':
        form = DoctorCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect('/accounts/register_success')

    else:
        form = DoctorCreationForm()
    args = {}
    args.update(csrf(request))

    args['form'] = form

    return render(request, 'register.html', args)



def register_success(request):
    return render(request, 'register_success.html')
