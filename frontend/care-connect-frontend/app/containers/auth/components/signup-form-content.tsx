import { FormField } from "@/app/components/form/form-field";
import { Button } from "@/components/ui/button";

interface SignupFormContentProps {
  onSubmit: (formData: FormData) => void;
  pending: boolean;
  fields: {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    errors?: string[];
    placeholder?: string;
    min?: string | number | undefined;
    max?: string | number | undefined;
  }[];
  title: string;
  description: string;
  buttonText: string;
}

export function SignupFormContent({
  onSubmit,
  pending,
  fields,
  title,
  description,
  buttonText,
}: SignupFormContentProps) {
  return (
    <form className="p-6 md:p-4" action={onSubmit}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-balance text-muted-foreground">{description}</p>
        </div>
        <div className="grid gap-4">
          {/* Group first two fields in the same row */}
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map((field) => (
              <FormField key={field.id} {...field} />
            ))}
          </div>

          {/* Rest of the fields */}
          {fields.slice(2).map((field) => (
            <FormField key={field.id} {...field} />
          ))}
        </div>
        <Button type="submit" className="w-full" disabled={pending}>
          {buttonText}
        </Button>
        <div className="text-center text-sm">
          Have an account?{" "}
          <a href="/auth/login" className="underline underline-offset-4">
            Login
          </a>
        </div>
      </div>
    </form>
  );
}
