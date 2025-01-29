import { getUserRole } from "@/app/actions/user";
import MainNav from "../main-nav";
export default async function MainNavWrapper({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const userRole = await getUserRole();

  return <MainNav userRole={userRole} className={className} {...props} />;
}
