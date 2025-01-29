from django.contrib import admin
from .models import (
    User,
    DoctorProfile,
    PatientProfile,
    Appointment,
    Specialization,
    TimeSlot,
)
from django.db import IntegrityError

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "is_active",
        "is_patient",
        "is_doctor",
    ]
    readonly_fields = ["password"]
    list_filter = ["is_active", "is_patient", "is_doctor"]
    search_fields = ["email", "first_name", "last_name"]

    def save_model(self, request, obj, form, change):
        """
        Override save_model to ensure a unique user is associated.
        """
        if not obj.pk and PatientProfile.objects.filter(user=obj.user).exists():
            raise IntegrityError(f"A PatientProfile already exists for user {obj.user}")
        super().save_model(request, obj, form, change)


@admin.register(DoctorProfile)
class DoctorProfileAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return DoctorProfile.all_objects.all()

    list_display = [
        "id",
        "user",
        "specialization",
        "experience_years",
        "is_deleted",
    ]
    list_filter = ["specialization", "experience_years"]
    search_fields = ["user__first_name", "user__last_name"]


@admin.register(PatientProfile)
class PatientProfileAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return PatientProfile.all_objects.all()

    list_display = ["id", "user", "date_of_birth", "is_deleted"]
    search_fields = ["user__first_name", "user__last_name"]


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):

    def get_queryset(self, request):
        return Specialization.all_objects.all()

    list_display = ["id", "name"]
    search_fields = ["name"]


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    
    def get_queryset(self, request):
        return TimeSlot.all_objects.all()
    
    list_display = ["id", "doctor", "start_time", "end_time"]
    search_fields = ["doctor__user__first_name", "doctor__user__last_name"]


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    
    def get_queryset(self, request):
        return Appointment.all_objects.all()
    
    list_display = [
        "id",
        "patient",
        "doctor",
        "appointment_date",
        "status",
        "is_deleted",
        "created_at",
        "updated_at",
    ]
    list_filter = ["status"]
    search_fields = ["patient__user__first_name", "doctor__user__first_name"]
