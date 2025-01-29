import { Metadata } from "next";
import Image from "next/image";
import TeamSwitcherWrapper from "./components/team-switcher/team-swither-server-wrapper";
import MainNavWrapper from "./components/main-nav/main-nav-server-wrapper";
import { Search } from "./components/search";
import { UserNav } from "./components/user-nav/user-nav";
export const metadata: Metadata = {
  title: "Dashboard",
  description: "CareConnect Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcherWrapper />
            <MainNavWrapper className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
      </div>
      {children}
    </main>
  );
}
