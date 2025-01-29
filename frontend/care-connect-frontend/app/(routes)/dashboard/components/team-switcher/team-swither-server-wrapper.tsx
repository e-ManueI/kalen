import { getUserDataFromSession, getUserRole } from "@/app/actions/user";
import UserNav from "./team-switcher";

export default async function TeamSwitcherWrapper() {
  const userData = await getUserDataFromSession();
  const userRole = await getUserRole();

  return <UserNav userData={userData} userRole={userRole} />;
}
