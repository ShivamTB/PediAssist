from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index),
    url(r'^create/$', views.patient_create, name='patient_create'),
    url(r'^(?P<pk>\d+)/update/$', views.patient_update, name='patient_update'),
    url(r'^(?P<pk>\d+)/delete/$', views.patient_delete, name='patient_delete'),
    url(r'^(?P<pk>\d+)/fetch/$', views.patient_fetch, name='patient_fetch'),
    url(r'^history/create/$', views.history_create, name='history_create'),
    url(r'^vaccination/$', views.vaccination_list, name='vaccination_list'),
    url(r'^vaccination/create/$', views.vaccination_create, name='vaccination_create'),
    url(r'^vaccination/(?P<pk>\d+)/update/$', views.vaccination_update, name='vaccination_update'),
    url(r'^vaccination/(?P<pk>\d+)/delete/$', views.vaccination_delete, name='vaccination_delete'),
    url(r'^info/update/$', views.update_info, name='update_info'),
]
