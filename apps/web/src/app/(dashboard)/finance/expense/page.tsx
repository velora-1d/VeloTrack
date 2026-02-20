import { Suspense } from "react";
import { Metadata } from "next";
import { ExpenseClient } from "./client";
import { getExpenses, getAllProjectsList, type FetchExpenseParams } from "@/lib/actions/finance";

export const metadata: Metadata = {
    title: "Expense | VeloTrack Finance",
    description: "Mencatat dan memonitor seluruh pengeluaran operasional dan proyek.",
};

export default async function ExpensePage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await searchParams;

    const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
    const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
    const projectId = typeof resolvedParams.projectId === "string" ? resolvedParams.projectId : "ALL";
    const category = typeof resolvedParams.category === "string" ? resolvedParams.category : "ALL";

    const payload: FetchExpenseParams = {
        page,
        pageSize: 10,
        search,
        projectId,
        category,
    };

    // Parallel Fetching
    const [expenseData, projectList] = await Promise.all([
        getExpenses(payload),
        getAllProjectsList()
    ]);

    return (
        <div className="w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <ExpenseClient
                    initialData={expenseData.data as any}
                    currentPage={expenseData.meta.currentPage}
                    totalPages={expenseData.meta.totalPages}
                    projects={projectList}
                />
            </Suspense>
        </div>
    );
}
