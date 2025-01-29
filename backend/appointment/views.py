from datetime import timedelta
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
    CreateAPIView,
    ListAPIView,
    GenericAPIView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError, PermissionDenied
from rest_framework.decorators import action
from .serializers import *
from django.db import transaction
from .permissions import IsSystemAdmin, IsPatient


################################ USER API VIEWS ################################


class UserLogin(TokenObtainPairView):
    """
    Obtain a JWT token pair (access and refresh tokens) for user authentication.
    """

    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class UserLogout(APIView):
    """
    Log out the currently authenticated user by blacklisting the refresh token.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh_token") or request.data.get(
                "refresh_token"
            )
            token = RefreshToken(refresh_token)
            token.blacklist()

            response = Response(
                {"detail": "Successfully logged out."}, status=status.HTTP_200_OK
            )
            response.delete_cookie("refresh_token")
            return response
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(TokenRefreshView):
    """
    post:
    Refresh an expired JWT access token using a refresh token.

    Permissions:
        AllowAny - Accessible by any user without authentication.

    Returns:
        JSON object containing a new access token.
    """

    permission_classes = [AllowAny]


################################# PROFILE API VIEWS #################################


class BaseProfileRegister(CreateAPIView):
    """
    Base class for registering profiles (Patient or Doctor).
    """

    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        if User.objects.filter(email=validated_data["email"]).exists():
            raise ValidationError(
                {"email": f"{self.profile_type} with this email already exists."}
            )

        with transaction.atomic():
            user = User.objects.create_user(
                email=validated_data["email"],
                password=validated_data["password"],
                first_name=validated_data["first_name"],
                last_name=validated_data["last_name"],
                phone_number=validated_data.get("phone_number"),
            )
            user.is_patient = True if self.profile_type == "Patient" else False
            user.is_doctor = True if self.profile_type == "Doctor" else False

            profile_data = {
                key: value
                for key, value in validated_data.items()
                if key
                not in ["email", "password", "first_name", "last_name", "phone_number"]
            }
            profile = self.profile_model.objects.create(user=user, **profile_data)

        response_serializer = self.get_serializer(profile)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class BaseProfileDetail(RetrieveUpdateDestroyAPIView):
    """
    Base class for retrieving, updating, and deleting profiles (Patient or Doctor).
    """

    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        with transaction.atomic():
            user_data = {
                key: value
                for key, value in request.data.items()
                if key in ["first_name", "last_name", "email", "phone_number"]
            }
            if user_data:
                for key, value in user_data.items():
                    setattr(instance.user, key, value)
                instance.user.save()

            profile_data = {
                key: value
                for key, value in request.data.items()
                if key not in ["first_name", "last_name", "email", "phone_number"]
            }
            if profile_data:
                for key, value in profile_data.items():
                    setattr(instance, key, value)
                instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user.is_active = False
        instance.user.save()
        instance.delete()
        return Response(
            {"detail": f"{self.profile_type} deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


class RestoreProfileView(GenericAPIView):
    """
    View to restore a profile (Patient or Doctor).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.user.is_active = True
        instance.user.save()
        instance.restore()
        return Response(
            {"detail": f"{self.profile_type} restored successfully."},
            status=status.HTTP_200_OK,
        )


####################################### PATIENT API VIEWS #######################################
class PatientRegister(BaseProfileRegister):
    """
    Register a new patient account.
    """

    queryset = PatientProfile.objects.all()
    serializer_class = PatientSerializer
    profile_type = "Patient"
    profile_model = PatientProfile


class PatientList(ListAPIView):
    """
    List all patient accounts.
    """

    queryset = PatientProfile.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsSystemAdmin]


class PatientDetail(BaseProfileDetail):
    """
    Retrieve, update, or delete a patient account.
    """

    queryset = PatientProfile.objects.all()
    serializer_class = PatientSerializer
    profile_type = "Patient"


class PatientRestore(RestoreProfileView):
    """
    Restore a patient account.
    """

    queryset = PatientProfile.all_objects.all()
    serializer_class = PatientSerializer
    profile_type = "Patient"


class PatientAppointments(APIView):
    """
    API to get patient appointments summary and upcoming appointments.
    Admins can specify a patient_id as a query parameter.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        patient_id = request.query_params.get("patient_id")

        # If the user is an admin and a patient_id is provided, fetch appointments for that patient
        if user.is_staff:
            if not patient_id:
                raise ValidationError(
                    {"patient_id": "patient_id parameter is required"}
                )
            else:
                try:
                    patient = PatientProfile.objects.get(id=patient_id)
                    appointments = Appointment.objects.filter(patient=patient)
                except PatientProfile.DoesNotExist:
                    return Response(
                        {"detail": "Patient not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )

        # If the user is a patient, fetch their own appointments
        elif user.is_patient:
            appointments = Appointment.objects.filter(patient__user=user)
        else:
            return Response(
                {"detail": "You do not have permission to access this endpoint."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Calculate summary
        summary = {
            "pending": appointments.filter(status=1).count(),
            "confirmed": appointments.filter(status=2).count(),
            "cancelled": appointments.filter(status=3).count(),
            "completed": appointments.filter(status=4).count(),
        }

        # Get upcoming appointments (confirmed and not yet completed)
        upcoming_appointments = appointments.filter(status=2)
        upcoming_appointments_data = PatientAppointmentsSerializer(
            upcoming_appointments, many=True
        ).data

        # Construct the response
        response_data = {
            "summary": summary,
            "upcoming_appointments": upcoming_appointments_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


#################################### DOCTOR API VIEWS ####################################
class DoctorRegister(BaseProfileRegister):
    """
    Register a new doctor account.
    """

    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorSerializer
    profile_type = "Doctor"
    profile_model = DoctorProfile


class DoctorList(ListAPIView):
    """
    List all doctor accounts.
    """

    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]


class DoctorDetail(BaseProfileDetail):
    """
    Retrieve, update, or delete a doctor account.
    """

    queryset = DoctorProfile.objects.all()
    serializer_class = DoctorSerializer
    profile_type = "Doctor"


class DoctorRestore(RestoreProfileView):
    """
    Restore a doctor account.
    """

    queryset = DoctorProfile.all_objects.all()
    serializer_class = DoctorSerializer
    profile_type = "Doctor"


class DoctorAppointments(APIView):
    """
    API to get doctor appointments summary and upcoming appointments.
    Admins can specify a doctor_id as a query parameter.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        doctor_id = request.query_params.get("doctor_id")

        # If the user is an admin and a doctor_id is provided, fetch appointments for that doctor
        if user.is_staff:
            if not doctor_id:
                raise ValidationError({"doctor_id": "doctor_id parameter is required"})
            else:
                try:
                    doctor = DoctorProfile.objects.get(id=doctor_id)
                    appointments = Appointment.objects.filter(doctor=doctor)
                except DoctorProfile.DoesNotExist:
                    return Response(
                        {"detail": "Doctor not found."},
                        status=status.HTTP_404_NOT_FOUND,
                    )
        # If the user is a doctor, fetch their own appointments
        elif user.is_doctor:
            appointments = Appointment.objects.filter(doctor__user=user)
        else:
            return Response(
                {"detail": "You do not have permission to access this endpoint."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Calculate summary
        summary = {
            "pending": appointments.filter(status=1).count(),
            "confirmed": appointments.filter(status=2).count(),
            "cancelled": appointments.filter(status=3).count(),
            "completed": appointments.filter(status=4).count(),
        }

        # Get upcoming appointments (confirmed and not yet completed)
        upcoming_appointments = appointments.filter(status=2)
        upcoming_appointments_data = DoctorAppointmentsSerializer(
            upcoming_appointments, many=True
        ).data

        # Get today's appointments
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_end = today_start + timedelta(days=1)
        todays_appointments = appointments.filter(
            appointment_date__gte=today_start,
            appointment_date__lt=today_end,
            status__in=[1,2], # only pending and confirmed appointments
        )
        todays_appointments_data = DoctorAppointmentsSerializer(
            todays_appointments, many=True
        ).data

        # Construct the response
        response_data = {
            "summary": summary,
            "upcoming_appointments": upcoming_appointments_data,
            "todays_appointments": todays_appointments_data,
        }

        return Response(response_data, status=status.HTTP_200_OK)


#################################### SPECIALIZATION API VIEWS ####################################
class SpecializationListCreate(ListCreateAPIView):
    """
    List all specializations or create a new specialization.
    """

    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsAuthenticated]


class SpecializationDetail(RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specialization.
    """

    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer
    permission_classes = [IsAuthenticated]


#################################### TIME SLOT API VIEWS ####################################
class TimeSlotListCreate(ListCreateAPIView):
    """
    List all time slots or create a new time slot.
    """

    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        doctor_id = self.request.query_params.get("doctor_id")
        date = self.request.query_params.get("date")
        if doctor_id:
            queryset = queryset.filter(doctor_id=doctor_id)
        if date:
            queryset = queryset.filter(date=date)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        user = request.user
        print(user.email)
        if not user.is_doctor:
            raise PermissionDenied("Only doctors can create time slots.")
        doctor = DoctorProfile.objects.get(user=user)

        time_slot = TimeSlot.objects.create(doctor=doctor, **validated_data)
        response_serializer = self.get_serializer(time_slot)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class TimeSlotDetail(RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a time slot.
    """

    queryset = TimeSlot.objects.all()
    serializer_class = TimeSlotSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if not user.is_doctor:
            raise PermissionDenied("Only doctors can update time slots.")
        doctor = DoctorProfile.objects.get(user=user)
        if instance.doctor != doctor:
            raise PermissionDenied(
                "You do not have permission to update this time slots."
            )

        with transaction.atomic():
            for key, value in request.data.items():
                setattr(instance, key, value)
            instance.save()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        user = self.request.user
        if not user.is_doctor:
            raise PermissionDenied("Only doctors can delete time slots.")
        doctor = DoctorProfile.objects.get(user=user)
        if instance.doctor != doctor:
            raise PermissionDenied(
                "You do not have permission to delete this time slots."
            )

        instance.delete()
        return Response(
            {"detail": "Time slot deleted successfully."},
            status=status.HTTP_204_NO_CONTENT,
        )


#################################### APPOINTMENT API VIEWS ####################################


class AppointmentListCreate(ListCreateAPIView):
    """
    List all appointments or create a new appointment.
    """

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return super().get_queryset()
        elif user.is_patient:
            return super().get_queryset().filter(patient__user=user)
        elif user.is_doctor:
            return super().get_queryset().filter(doctor__user=user)
        else:
            return super().get_queryset().none()

    def create(self, request, *args, **kwargs):
        user = self.request.user
        data = request.data

        if not user.is_patient:
            raise PermissionDenied(
                "You do not have permission to create an appointment."
            )

        # Get patient instance
        patient = PatientProfile.objects.get(user=user)
        data["patient"] = patient.id

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        # Create appointment
        appointment = Appointment.objects.create(**validated_data)
        serializer = self.get_serializer(appointment)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AppointmentDetail(RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete an appointment.
    """

    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        appointment = super().get_object()
        user = self.request.user

        if user.is_staff:
            # Admin can access any appointment
            return appointment
        elif user.is_patient:
            patient = PatientProfile.objects.get(user=user)
            # Patients can access their own appointments
            if appointment.patient != patient:
                raise PermissionDenied(
                    "You do not have permission to access this appointment."
                )
            return appointment
        elif user.is_doctor:
            doctor = DoctorProfile.objects.get(user=user)
            # Doctors can access their own appointments
            if appointment.doctor != doctor:
                raise PermissionDenied(
                    "You do not have permission to access this appointment."
                )
            return appointment
        else:
            raise PermissionDenied(
                "You do not have permission to access this appointment."
            )

    def update(self, request, *args, **kwargs):
        user = request.user
        appointment = self.get_object()

        patient = PatientProfile.objects.get(user=user)
        if not user.is_patient or appointment.patient != patient:
            raise PermissionDenied(
                "You don't have permission to update this appointment."
            )

        return super().update(request, *args, **kwargs)
