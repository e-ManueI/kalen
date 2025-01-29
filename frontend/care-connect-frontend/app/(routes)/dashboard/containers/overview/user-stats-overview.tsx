"use client";

import React, { useEffect, useState } from "react";
import { StatsCard } from "../../components/stats-card";

interface StatsDataProps {
  summary?: {
    pending?: number;
    confirmed?: number;
    cancelled?: number;
    completed?: number;
  };

  total_doctors?: number;
  total_patients?: number;
  todays_appointments?: Array<unknown>;
  upcoming_appointments?: Array<unknown>;
}

interface formattedStats {
  title: string;
  value: number | string | undefined;
  description: string;
}

function UserStats({ statsData }: { statsData: StatsDataProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<formattedStats[]>([]);

  useEffect(() => {
    if (statsData) {
      const formattedStats = [
        {
          title: "Total Patients",
          value: statsData?.total_patients,
          description: "🌟 Your growing community of patients",
        },
        {
          title: "Total Doctors",
          value: statsData?.total_doctors,
          description: "👩‍⚕️👨‍⚕️ The amazing team behind the care.",
        },
        {
          title: "Upcoming Appointments",
          value: statsData.summary?.pending,
          description: "📅 Scheduled for the future.",
        },

        {
          title: "Cancelled Appointments",
          value: statsData.summary?.cancelled,
          description: "🚫 Life happens! These appointments were cancelled",
        },
        {
          title: "Confirmed Appointments",
          value: statsData.summary?.confirmed,
          description: "✅ Locked and Loaded!. Confirmed for the future.",
        },
        {
          title: "Total Appointments",
          value: statsData.summary?.completed,
          description: "🎉 All-time appointments managed.",
        },
      ].filter((stat) => stat.value !== undefined && stat.value !== null);

      setStats(formattedStats);
      setIsLoading(false);
    }
  }, [statsData]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading && (
        <>
          <StatsCard title="Loading..." value="..." />
          <StatsCard title="Loading..." value="..." />
          <StatsCard title="Loading..." value="..." />
          <StatsCard title="Loading..." value="..." />
        </>
      )}
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={isLoading ? "Loading..." : stat.title}
          value={isLoading ? "..." : stat.value}
          description={isLoading ? "..." : stat.description}
        />
      ))}
    </div>
  );
}

export default UserStats;
