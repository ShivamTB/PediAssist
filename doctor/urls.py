from django.conf.urls import url
from . import views


urlpatterns = [

    url(r'^login/$',  views.login, name = 'ea.views.login'),
    url(r'^auth/$',  views.auth_view, name = 'ea.views.auth_view' ),
    url(r'^logout/$', views.logout, name = 'ea.views.logout'),
    url(r'^loggedin/$', views.loggedin, name = 'ea.views.loggedin'),
    url(r'^invalid/$', views.invalid_login, name = 'ea.views.invalid_login'),
    url(r'^register/$', views.register_user, name = 'ea.views.register_user'),
    url(r'^register_success/$', views.register_success, name = 'ea.views.register_success'),
]
