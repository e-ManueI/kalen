from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import (
    User,
    PatientProfile,
    DoctorProfile,
    TimeSlot,
    Appointment,
    Specialization,
)
from django.utils import timezone


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    def generalUserData(self, user):
        if hasattr(user, "patient_profile"):
            user_type = ("patient")
        if hasattr(user, "doctor_profile"):
            user_type = ("doctor")
        if user.is_staff:
            user_type = ("admin")
        if not user_type:
            raise serializers.ValidationError("User type not found.")
        return {
            "id": user.id,
            "email": user.email,
            "phone_number": user.phone_number,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "user_type": user_type,
        }

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        user_data = self.generalUserData(user=user)

        user_data["access"] = data.pop("access")
        user_data["refresh"] = data.pop("refresh")

        return user_data


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password", "first_name", "last_name", "phone_number"]


class PatientSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = PatientProfile
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "date_of_birth",
            "address",
        ]

    def validate_date_of_birth(self, value):
        if value > timezone.now().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["email"] = instance.user.email
        response["first_name"] = instance.user.first_name
        response["last_name"] = instance.user.last_name
        response["phone_number"] = instance.user.phone_number

        return response


class DoctorSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    phone_number = serializers.CharField(write_only=True, required=False)
    specialization = serializers.PrimaryKeyRelatedField(
        queryset=Specialization.objects.all(), write_only=True
    )

    class Meta:
        model = DoctorProfile
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "phone_number",
            "address",
            "experience_years",
            "specialization",
        ]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["email"] = instance.user.email
        response["first_name"] = instance.user.first_name
        response["last_name"] = instance.user.last_name
        response["phone_number"] = instance.user.phone_number
        return response


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = ["id", "name", "description"]
        
    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["doctor_count"] = instance.doctors.count()
        return response

class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ["id", "date", "start_time", "end_time", "is_available"]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["doctor"] = instance.doctor.user.get_full_name()
        return response


class AppointmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ["id", "doctor", "patient", "status", "appointment_date"]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["status"] = instance.get_status_display()
        response["doctor"] = instance.doctor.user.get_full_name()
        response["patient"] = instance.patient.user.get_full_name()

        return response


class PatientAppointmentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ["id", "doctor", "appointment_date"]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["doctor"] = instance.doctor.user.get_full_name()

        return response


class DoctorAppointmentsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Appointment
        fields = ["id", "patient", "appointment_date"]

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response["patient"] = instance.patient.user.get_full_name()

        return response
