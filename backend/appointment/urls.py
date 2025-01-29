from django.urls import path
from .views import *

urlpatterns = [
    ################################## USER API URLS ##################################
    path("login/", UserLogin.as_view(), name="login"),
    path("logout/", UserLogout.as_view(), name="logout"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("patient-register/", PatientRegister.as_view(), name="patient-register"),
    path("patients-list/", PatientList.as_view(), name="patients-list"),
    path("patient-detail/<int:pk>/", PatientDetail.as_view(), name="patient-detail"),
    path("patient-update/<int:pk>/", PatientDetail.as_view(), name="patient-update"),
    path("patient-delete/<int:pk>/", PatientDetail.as_view(), name="patient-delete"),
    path(
        "patient-restore/<int:pk>/",
        PatientRestore.as_view(),
        name="patient-restore",
    ),
    path(
        "patient-appointments/",
        PatientAppointments.as_view(),
        name="patient-appointments",
    ),
    path("doctor-register/", DoctorRegister.as_view(), name="doctor-register"),
    path("doctors-list/", DoctorList.as_view(), name="doctors-list"),
    path("doctor-detail/<int:pk>/", DoctorDetail.as_view(), name="doctor-detail"),
    path("doctor-update/<int:pk>/", DoctorDetail.as_view(), name="doctor-update"),
    path("doctor-delete/<int:pk>/", DoctorDetail.as_view(), name="doctor-delete"),
    path("doctor-restore/<int:pk>/", DoctorRestore.as_view(), name="doctor-restore"),
    path(
        "doctor-appointments/", DoctorAppointments.as_view(), name="doctor-appointments"
    ),
    #################################### SPECIALIZATION API URLS ##########################
    path(
        "specialization-create/",
        SpecializationListCreate.as_view(),
        name="specializations-list-create",
    ),
    path(
        "specialization-list/",
        SpecializationListCreate.as_view(),
        name="specializations-list-create",
    ),
    path(
        "specialization-detail/<int:pk>/",
        SpecializationDetail.as_view(),
        name="specialization-detail",
    ),
    path(
        "specialization-update/<int:pk>/",
        SpecializationDetail.as_view(),
        name="specialization-update",
    ),
    path(
        "specialization-delete/<int:pk>/",
        SpecializationDetail.as_view(),
        name="specialization-delete",
    ),
    ####################################### TIME SLOT API URLS ##########################
    path("time-slots-create/", TimeSlotListCreate.as_view(), name="time-slots-create"),
    path("time-slots-list/", TimeSlotListCreate.as_view(), name="time-slots-list"),
    path(
        "time-slot-update/<int:pk>/", TimeSlotDetail.as_view(), name="time-slot-update"
    ),
    path(
        "time-slot-delete/<int:pk>/", TimeSlotDetail.as_view(), name="time-slot-delete"
    ),
    ###################################### APPOINTMENT API URLS ##########################
    path(
        "appointments-create/",
        AppointmentListCreate.as_view(),
        name="appointments-create",
    ),
    path(
        "appointments-list/", AppointmentListCreate.as_view(), name="appointments-list"
    ),
    path(
        "appointment-update/<int:pk>/",
        AppointmentDetail.as_view(),
        name="appointment-update",
    ),
]
