import { getUserSession } from "@/utils/supabase/auth";
import LoginPage from "./login/page";
import DashboardLayout from "./(dashboard)/layout";
import DashboardPage from "./(dashboard)/dashboard/page";

export default async function Home() {
  const user = await getUserSession();

  if (!user) {
    return <LoginPage />;
  }

  return (
    <DashboardLayout>
      <DashboardPage />
    </DashboardLayout>
  );
}
