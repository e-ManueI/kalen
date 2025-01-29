"use server";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
import { getUserDataFromSession } from "@/app/actions/user";

export default async function SettingsProfilePage() {
  const userData = await getUserDataFromSession();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          This is how others see you on the platform.
        </p>
      </div>
      <Separator />
      <ProfileForm {...userData} />
    </div>
  );
}
