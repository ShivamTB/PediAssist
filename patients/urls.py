from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index),
    url(r'^create/$', views.patient_create, name='patient_create'),
    url(r'^(?P<pk>\d+)/update/$', views.patient_update, name='patient_update'),
    url(r'^(?P<pk>\d+)/delete/$', views.patient_delete, name='patient_delete'),
    url(r'^(?P<pk>\d+)/fetch/$', views.patient_fetch, name='patient_fetch'),
    url(r'^history/create/$', views.history_create, name='history_create'),
]
