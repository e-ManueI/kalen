import { Metadata } from "next";
import { CalendarDateRangePicker } from "./containers/overview/date-range-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewChart } from "@/app/(routes)/dashboard/containers/overview/overview-chart";
import { RecentAppointments } from "@/app/(routes)/dashboard/containers/overview/recent-appointments-table";
import { UpcomingAppointmentsTable } from "./containers/overview/upcoming-appointments/upcoming-appointments-table";
import { getUserRole } from "@/app/actions/user";
import { fetchDashboardData } from "@/app/actions/dashboard";
import UserStats from "./containers/overview/user-stats-overview";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Care Connect Dashboard",
};

export default async function DashboardPage() {
  const userRole = await getUserRole();
  const dashboardData = await fetchDashboardData();

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" disabled>
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications" disabled>
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <UserStats statsData={dashboardData} />

            {userRole === "admin" ||
              (userRole == "doctor" && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <OverviewChart />
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Recent Appointments</CardTitle>
                      <CardDescription>
                        You made 265 appointments this month.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RecentAppointments />
                    </CardContent>
                  </Card>
                </div>
              ))}

            <div>
              <UpcomingAppointmentsTable
                appointments={dashboardData?.upcoming_appointments || []}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
