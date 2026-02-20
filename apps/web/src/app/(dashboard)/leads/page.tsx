import { Suspense } from "react";
import { Metadata } from "next";
import { LeadsClient } from "./client";
import { getLeads, type FetchLeadsParams } from "@/lib/actions/leads";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "Leads Management | VeloTrack",
    description: "Kelola data calon klien sebelum dikonversi menjadi proyek.",
};

export default async function LeadsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Next.js 15+ mewajibkan searchParams di-await
    const resolvedParams = await searchParams;
    const page = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
    const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;
    const statusRaw = typeof resolvedParams.status === "string" ? resolvedParams.status : "ALL";

    const payload: FetchLeadsParams = {
        page,
        pageSize: 10, // Default VeloTrack
        search,
        status: statusRaw,
    };

    // B. Ambil data dari server actions (Langsung hit DB dengan filter)
    const result = await getLeads(payload);

    // B2. Ambil data list Mitra aktif dari database
    const activeMitraList = await prisma.user.findMany({
        where: { role: "MITRA", isActive: true },
        select: { id: true, name: true }
    });

    // C. Pass hasil ke Client Component
    return (
        <>
            <Suspense fallback={<div className="animate-pulse space-y-4">
                <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/4"></div>
                <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-2xl w-full"></div>
            </div>}>
                <LeadsClient
                    initialData={result.leads as any}
                    totalPages={result.totalPages}
                    initialPage={result.currentPage}
                    mitraList={activeMitraList}
                />
            </Suspense>
        </>
    );
}
