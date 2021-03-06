from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.views.generic import TemplateView

from tastypie.api import Api

from .api import LoginResource, RegisterResource
from enrollment.api import EnrollmentResource
from course.api import CourseResource
from employee_title.api import EmployeeTitleResource

v1_api = Api(api_name='v1')
v1_api.register(LoginResource())
v1_api.register(RegisterResource())
v1_api.register(EnrollmentResource())
v1_api.register(CourseResource())
v1_api.register(EmployeeTitleResource())

urlpatterns = patterns('',
    url(r'^api/', include(v1_api.urls)),
    url(r'^$', 'djgap.views.home', name='home'),
    url(r'^index.html', 'djgap.views.home', name='home'),
    url(r'^courses/(?P<key>[\w=]+)$', 'djgap.views.courses', name='courses'),
    url(r'^dashboard/(?P<key>[\w=]+)/(?P<id>\w+)$', 'djgap.views.dashboard', name='dashboard'),
    url(r'^register_teacher/(?P<key>[\w=]+)$', 'djgap.views.register_teacher', name='register_teacher'),
    url(r'^admin/', include(admin.site.urls)),
) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
