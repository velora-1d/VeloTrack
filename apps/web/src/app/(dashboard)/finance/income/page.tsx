import { Suspense } from "react";
import { Metadata } from "next";
import { IncomeClient } from "./client";
import { getIncomes, getAllProjectsList, type FetchIncomeParams } from "@/lib/actions/finance";

export const metadata: Metadata = {
    title: "Income | VeloTrack Finance",
    description: "Mencatat dan memonitor seluruh pemasukan dari proyek yang berjalan.",
};

export default async function IncomePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;

    const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
    const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
    const projectId = typeof resolvedParams.projectId === "string" ? resolvedParams.projectId : "ALL";
    const paymentType = typeof resolvedParams.paymentType === "string" ? resolvedParams.paymentType : "ALL";

    const payload: FetchIncomeParams = {
        page,
        pageSize: 10,
        search,
        projectId,
        paymentType,
    };

    // Parallel Fetching
    const [incomeData, projectList] = await Promise.all([
        getIncomes(payload),
        getAllProjectsList()
    ]);

    return (
        <div className="w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <IncomeClient
                    initialData={incomeData.data as any}
                    currentPage={incomeData.meta.currentPage}
                    totalPages={incomeData.meta.totalPages}
                    projects={projectList}
                />
            </Suspense>
        </div>
    );
}
