import { Suspense } from "react";
import { Metadata } from "next";
import { ProfitClient } from "./client";
import { getProfitData } from "@/lib/actions/finance";

export const metadata: Metadata = {
    title: "Profit Analysis | VeloTrack Finance",
    description: "Analisis laba bersih dan margin keuntungan bisnis Anda.",
};

export default async function ProfitPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;

    const startDate = typeof resolvedParams.startDate === "string" ? resolvedParams.startDate : undefined;
    const endDate = typeof resolvedParams.endDate === "string" ? resolvedParams.endDate : undefined;

    const profitData = await getProfitData({
        startDate,
        endDate
    });

    return (
        <div className="w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <ProfitClient
                    summary={profitData.summary}
                    projects={profitData.projects as any}
                />
            </Suspense>
        </div>
    );
}
