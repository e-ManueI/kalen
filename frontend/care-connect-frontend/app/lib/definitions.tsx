import { z } from "zod";

export type SessionPayload = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  phone_number: string;
  access: string;
  refresh: string;
};

export type UserData = {
  userId?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
};

export type SessionPayloadWithExpiry = SessionPayload & {
  expiresAt: Date; // Only add expiresAt for encryption
};

export type FormState<T = Record<string, string[]>> =
  | {
      errors?: T; // Generic errors object
      message?: string; // Generic message
    }
  | undefined;

// ======================== SignUps ========================
export const BaseSignUpFormSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
    .trim(),
  retypePassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
    .trim(),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
    .trim(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
    .trim(),
  address: z
    .string()
    .min(1, "Address is required")
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
    .trim(),
});

export const DoctorSignUpFormSchema = BaseSignUpFormSchema.extend({
  // specialization: z.string().min(1, "Specialization is required"),
  experience: z.number().min(1, "Experience is required"),
});

export const PatientSignUpFormSchema = BaseSignUpFormSchema.extend({
  dob: z.string().min(1, "Date of birth is required").trim(),
});

export const RefinedBaseSignUpFormSchema = BaseSignUpFormSchema.refine(
  (data) => data.password === data.retypePassword,
  {
    message: "Passwords do not match",
    path: ["retypePassword"], // Attach the error to the `retypePassword` field
  },
);

export const RefinedDoctorSignUpFormSchema = DoctorSignUpFormSchema.refine(
  (data) => data.password === data.retypePassword,
  {
    message: "Passwords do not match",
    path: ["retypePassword"],
  },
);

export const RefinedPatientSignUpFormSchema = PatientSignUpFormSchema.refine(
  (data) => data.password === data.retypePassword,
  {
    message: "Passwords do not match",
    path: ["retypePassword"],
  },
);

export type BaseSignupFormState =
  | {
      errors?: {
        email?: string[];
        firstName?: string[];
        lastName?: string[];
        password?: string[];
        retypePassword?: string[];
        dob?: string[];
        specialization?: string[];
        experience?: string[];
        address?: string[];
      };
      success?: boolean;
      message?: string;
    }
  | undefined;

export type DoctorSignupFormState = BaseSignupFormState & {};

export type PatientSignupFormState = BaseSignupFormState & {
  errors?: {
    dob?: string[];
  };
};

// ======================== Login ========================
export const LoginFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required")
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, {
      message: "Password must not be longer than 30 characters.",
    })
    .nonempty("Password is required")
    .trim(),
});

export type LoginFormState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

// ======================== Profile ========================
export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export const profileFormSchema = z.object({
  firstName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  lastName: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
});
