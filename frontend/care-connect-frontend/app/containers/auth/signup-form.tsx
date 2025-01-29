/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useActionState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { doctorSignup, patientSignup } from "@/app/actions/auth";
import { SignupFormContent } from "./components/signup-form-content";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/hooks/use-toast";
import { showToast } from "@/app/lib/helpers";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [, setActiveTab] = useState("patient");
  const [patientState, patientAction, patientPending] = useActionState(
    patientSignup,
    undefined,
  );
  const [doctorState, doctorAction, doctorPending] = useActionState(
    doctorSignup,
    undefined,
  );

  const { toast } = useToast();
  const router = useRouter();

  // Patient form state
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPassword, setPatientPassword] = useState("");
  const [patientRetypePassword, setPatientRetypePassword] = useState("");
  const [patientDob, setPatientDob] = useState("");
  const [patientAddress, setPatientAddress] = useState("");

  // Doctor form state
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorPassword, setDoctorPassword] = useState("");
  const [doctorRetypePassword, setDoctorRetypePassword] = useState("");
  const [doctorAddress, setDoctorAddress] = useState("");
  const [doctorExperience, setDoctorExperience] = useState("");

  // Clear form fields on successful submission
  useEffect(() => {
    const resetPatientFields = () => {
      setPatientFirstName("");
      setPatientLastName("");
      setPatientEmail("");
      setPatientPassword("");
      setPatientRetypePassword("");
      setPatientDob("");
      setPatientAddress("");
    };

    const resetDoctorFields = () => {
      setDoctorFirstName("");
      setDoctorLastName("");
      setDoctorEmail("");
      setDoctorPassword("");
      setDoctorRetypePassword("");
      setDoctorAddress("");
      setDoctorExperience("");
    };

    const redirectToLogin = () => {
      if (patientState?.success || doctorState?.success) {
        router.push("/auth/login");
      }
    };

    if (!patientState?.errors) {
      resetPatientFields();
    }

    if (!doctorState?.errors) {
      resetDoctorFields();
    }

    showToast(patientState);
    showToast(doctorState);

    redirectToLogin();
  }, [patientState, doctorState, toast, router]);

  // Patient form fields
  const patientFields = [
    {
      id: "patientFirstName",
      label: "First Name",
      value: patientFirstName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientFirstName(e.target.value),
      errors: patientState?.errors?.firstName,
    },
    {
      id: "patientLastName",
      label: "Last Name",
      value: patientLastName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientLastName(e.target.value),
      errors: patientState?.errors?.lastName,
    },
    {
      id: "patientEmail",
      label: "Email",
      type: "email",
      value: patientEmail,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientEmail(e.target.value),
      errors: patientState?.errors?.email,
    },
    {
      id: "patientPassword",
      label: "Password",
      type: "password",
      value: patientPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientPassword(e.target.value),
      errors: patientState?.errors?.password,
    },
    {
      id: "patientRetypePassword",
      label: "Retype Password",
      type: "password",
      value: patientRetypePassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientRetypePassword(e.target.value),
      errors: patientState?.errors?.retypePassword,
    },
    {
      id: "patientDob",
      label: "Date of Birth",
      type: "date",
      value: patientDob,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientDob(e.target.value),
      errors: patientState?.errors?.dob,
      max: new Date().toISOString().split("T")[0],
    },
    {
      id: "patientAddress",
      label: "Location/Address",
      value: patientAddress,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPatientAddress(e.target.value),
      errors: patientState?.errors?.address,
    },
  ];

  // Doctor form fields
  const doctorFields = [
    {
      id: "doctorFirstName",
      label: "First Name",
      value: doctorFirstName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorFirstName(e.target.value),
      errors: doctorState?.errors?.firstName,
    },
    {
      id: "doctorLastName",
      label: "Last Name",
      value: doctorLastName,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorLastName(e.target.value),
      errors: doctorState?.errors?.lastName,
    },
    {
      id: "doctorEmail",
      label: "Email",
      type: "email",
      value: doctorEmail,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorEmail(e.target.value),
      errors: doctorState?.errors?.email,
    },
    {
      id: "doctorPassword",
      label: "Password",
      type: "password",
      value: doctorPassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorPassword(e.target.value),
      errors: doctorState?.errors?.password,
    },
    {
      id: "doctorRetypePassword",
      label: "Retype Password",
      type: "password",
      value: doctorRetypePassword,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorRetypePassword(e.target.value),
      errors: doctorState?.errors?.retypePassword,
    },
    {
      id: "doctorAddress",
      label: "Location/Address",
      value: doctorAddress,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorAddress(e.target.value),
      errors: doctorState?.errors?.address,
    },
    {
      id: "doctorExperience",
      label: "Experience(in years)",
      type: "number",
      value: doctorExperience,
      min: 1,
      max: 40,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setDoctorExperience(e.target.value),
      errors: doctorState?.errors?.experience,
    },
  ];

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Tabs
            defaultValue="patient"
            className="w-full px-4 py-4"
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="doctor">Doctor</TabsTrigger>
            </TabsList>

            {/* Patient Signup Form */}
            <TabsContent value="patient">
              <SignupFormContent
                onSubmit={patientAction}
                pending={patientPending}
                fields={patientFields}
                title="Patient Sign Up"
                description="Create your patient account"
                buttonText="Sign Up as Patient"
              />
            </TabsContent>

            {/* Doctor Signup Form */}
            <TabsContent value="doctor">
              <SignupFormContent
                onSubmit={doctorAction}
                pending={doctorPending}
                fields={doctorFields}
                title="Doctor Sign Up"
                description="Create your doctor account"
                buttonText="Sign Up as Doctor"
              />
            </TabsContent>
          </Tabs>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Healthcare illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking sign up, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
