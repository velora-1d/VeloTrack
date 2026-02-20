import { Suspense } from "react";
import { Metadata } from "next";
import { ReportsClient } from "./client";
import {
    getLeadsReport,
    getProjectsReport,
    getFinanceReport,
    getProfitReport
} from "@/lib/actions/reports";

export const metadata: Metadata = {
    title: "Reports | VeloTrack",
    description: "Analisis dan laporan performa bisnis VeloTrack pusat.",
};

export default async function ReportsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;

    // Global Filter (Periode)
    const startDate = typeof resolvedParams.startDate === "string" ? resolvedParams.startDate : undefined;
    const endDate = typeof resolvedParams.endDate === "string" ? resolvedParams.endDate : undefined;

    const filter = { startDate, endDate };

    // Parallel Fetching all report types
    const [leads, projects, finance, profit] = await Promise.all([
        getLeadsReport(filter),
        getProjectsReport(filter),
        getFinanceReport(filter),
        getProfitReport(filter)
    ]);

    return (
        <div className="w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <ReportsClient
                    leadsReport={leads}
                    projectsReport={projects}
                    financeReport={finance}
                    profitReport={profit}
                />
            </Suspense>
        </div>
    );
}
