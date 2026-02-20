import { DashboardClient } from "./client";
import {
  getDashboardSummary,
  getDashboardCharts,
  getUpcomingDeadlines,
  getProjectsList
} from "@/lib/actions/dashboard";
import { getUserSession } from "@/utils/supabase/auth";
import { redirect } from "next/navigation";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 17) return "Selamat Siang";
  return "Selamat Malam";
}

function getGreetingEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "🌤️";
  return "🌙";
}

export default async function DashboardPage() {
  const user = await getUserSession();

  if (!user) {
    redirect("/login");
  }

  const userRole = user.role;
  const mitraId = user.role === "MITRA" ? user.id : undefined;

  // Parallel fetch for initial load - Pass mitraId if Mitra
  const [summaryData, chartsData, upcomingDeadlines, projectsList] = await Promise.all([
    getDashboardSummary("month", undefined, mitraId),
    getDashboardCharts("month", undefined, mitraId),
    getUpcomingDeadlines(undefined, mitraId),
    getProjectsList()
  ]);

  return (
    <div className="space-y-8">
      {/* Header — Premium */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getGreetingEmoji()}</span>
          <p className="text-sm text-zinc-400 dark:text-zinc-500 font-semibold tracking-wide">
            {getGreeting()}
          </p>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white mt-1">
          Dashboard Overview
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5 max-w-lg">
          Pantau performa bisnis, kelola proyek, dan analisis keuangan dalam satu tampilan.
        </p>
      </div>

      <DashboardClient
        initialSummary={summaryData}
        initialCharts={chartsData}
        initialDeadlines={upcomingDeadlines}
        projectsList={projectsList}
        userRole={userRole}
        mitraId={mitraId}
      />
    </div>
  );
}
