import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: string[];
  className?: string;
  placeholder?: string;
  min?: string | number | undefined;
  max?: string | number | undefined;
}

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  errors,
  className,
  placeholder,
  min,
  max,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        name={id}
        value={value}
        onChange={onChange}
        className={cn(className, {
          "border-red-500": errors, // Apply border-red-500 if errors exist
        })}
        placeholder={placeholder}
        min={min}
        max={max}
      />
      {errors && (
        <div className="text-sm text-red-500">
          <ul>
            {errors.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
