import { Suspense } from "react";
import { Metadata } from "next";
import { SettingsClient } from "./client";
import { getSettings, getSystemAuditLogs } from "@/lib/actions/settings";

export const metadata: Metadata = {
    title: "Settings | VeloTrack Control",
    description: "Pusat pengaturan sistem, branding, dan manajemen akses mitra.",
};

export default async function SettingsPage() {
    // Parallel Fetching initial data
    const [settings, auditLogs] = await Promise.all([
        getSettings(),
        getSystemAuditLogs(30)
    ]);

    return (
        <div className="w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <SettingsClient
                    initialSettings={settings}
                    auditLogs={auditLogs as any}
                />
            </Suspense>
        </div>
    );
}
