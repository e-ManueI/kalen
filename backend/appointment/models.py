from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from datetime import timedelta
from django.utils.timezone import now


class CustomUserManager(BaseUserManager):

    def create_user(self, email, password, first_name, last_name, phone_number=None):
        if not email:
            raise ValueError("The Email field must be set")
        if not first_name or not last_name:
            raise ValueError("The First Name and Last Name fields must be set")

        user = self.model(
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(
        self, email, password, first_name, last_name, phone_number=None
    ):
        user = self.create_user(
            email=self.normalize_email(email),
            password=password,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class SoftDeleteManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # Includes deleted objects

    def delete(self, *args, **kwargs):
        self.is_deleted = True
        self.deleted_at = now()
        self.save()

    def restore(self):
        self.is_deleted = False
        self.deleted_at = None
        self.save()

    class Meta:
        abstract = True


class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=12, blank=True, null=True)
    image = models.ImageField(upload_to="profile_pictures/", null=True, blank=True)
    is_doctor = models.BooleanField(default=False)
    is_patient = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    def __str__(self):
        return self.get_full_name()


class Specialization(SoftDeleteModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class PatientProfile(SoftDeleteModel):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="patient_profile"
    )
    date_of_birth = models.DateField()
    address = models.TextField()

    def __str__(self):
        return f"{self.user.get_full_name()}"


class DoctorProfile(SoftDeleteModel):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="doctor_profile"
    )
    specialization = models.ForeignKey(
        Specialization, on_delete=models.SET_NULL, null=True, related_name="doctors"
    )
    experience_years = models.PositiveIntegerField()
    address = models.TextField()
    availability = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name()} - {self.specialization}"


class TimeSlot(SoftDeleteModel):
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name="time_slots"
    )
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.date} {self.start_time}-{self.end_time} ({'Available' if self.is_available else 'Unavailable'})"


class Appointment(SoftDeleteModel):
    STATUS_CHOICES = [
        (1, "Pending"),
        (2, "Confirmed"),
        (3, "Cancelled"),
        (4, "Completed"),
    ]

    patient = models.ForeignKey(
        PatientProfile, on_delete=models.CASCADE, related_name="appointments"
    )
    doctor = models.ForeignKey(
        DoctorProfile, on_delete=models.CASCADE, related_name="appointments"
    )
    appointment_date = models.DateTimeField()
    status = models.IntegerField(choices=STATUS_CHOICES, default=1)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Appointment with Dr. {self.doctor.user.get_full_name()} by {self.patient.user.get_full_name()} on {self.appointment_date}"
