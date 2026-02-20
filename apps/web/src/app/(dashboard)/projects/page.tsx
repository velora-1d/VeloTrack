import { Suspense } from "react";
import { Metadata } from "next";
import { ProjectsClient } from "./client";
import { getProjects, getMitraList, type FetchProjectsParams } from "@/lib/actions/projects";

export const metadata: Metadata = {
    title: "Projects | VeloTrack",
    description: "Kelola timeline, status, dan penugasan mitra pada semua proyek aktif.",
};

export default async function ProjectsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Next.js 15+ mewajibkan searchParams di-await
    const resolvedParams = await searchParams;

    const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
    const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
    const statusRaw = typeof resolvedParams.status === "string" ? resolvedParams.status : "ALL";
    const deadlineRaw = typeof resolvedParams.deadlineFilter === "string" ? resolvedParams.deadlineFilter : "ALL";
    const picRaw = typeof resolvedParams.picId === "string" ? resolvedParams.picId : "ALL";

    const payload: FetchProjectsParams = {
        page,
        pageSize: 10,
        search,
        status: statusRaw,
        deadlineFilter: deadlineRaw as any,
        picId: picRaw,
    };

    // Parallel Fetching
    const [projectsData, mitraList] = await Promise.all([
        getProjects(payload),
        getMitraList()
    ]);

    return (
        <div className="flex-1 w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <ProjectsClient
                    initialData={projectsData.data as any}
                    currentPage={projectsData.meta.currentPage}
                    totalPages={projectsData.meta.totalPages}
                    mitraList={mitraList}
                />
            </Suspense>
        </div>
    );
}
