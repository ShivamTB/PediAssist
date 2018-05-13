from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^generic/$', views.generic_list, name='generic_list'),
    url(r'^generic/create/$', views.generic_create, name='generic_create'),
    url(r'^generic/(?P<pk>\d+)/update/$', views.generic_update, name='generic_update'),
    url(r'^generic/(?P<pk>\d+)/delete/$', views.generic_delete, name='generic_delete'),
    url(r'^vaccine/$', views.vaccine_list, name='vaccine_list'),
    url(r'^vaccine/create/$', views.vaccine_create, name='vaccine_create'),
    url(r'^vaccine/(?P<pk>\d+)/update/$', views.vaccine_update, name='vaccine_update'),
    url(r'^vaccine/(?P<pk>\d+)/delete/$', views.vaccine_delete, name='vaccine_delete'),
    url(r'^symptom/$', views.symptom_list, name='symptom_list'),
    url(r'^symptom/create/$', views.symptom_create, name='symptom_create'),
    url(r'^symptom/(?P<pk>\d+)/update/$', views.symptom_update, name='symptom_update'),
    url(r'^symptom/(?P<pk>\d+)/delete/$', views.symptom_delete, name='symptom_delete'),
    url(r'^sign/$', views.sign_list, name='sign_list'),
    url(r'^sign/create/$', views.sign_create, name='sign_create'),
    url(r'^sign/(?P<pk>\d+)/update/$', views.sign_update, name='sign_update'),
    url(r'^sign/(?P<pk>\d+)/delete/$', views.sign_delete, name='sign_delete'),
]
