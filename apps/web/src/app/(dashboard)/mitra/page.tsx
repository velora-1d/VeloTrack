import { Suspense } from "react";
import { Metadata } from "next";
import { MitraClient } from "./client";
import { getMitraList } from "@/lib/actions/mitra";

export const metadata: Metadata = {
    title: "Daftar Mitra | VeloTrack",
    description: "Kelola data profesional dan akses seluruh mitra kerja.",
};

export default async function MitraPage() {
    const mitras = await getMitraList();

    return (
        <div className="w-full">
            <Suspense fallback={
                <div className="flex items-center justify-center p-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                </div>
            }>
                <MitraClient initialData={mitras as any} />
            </Suspense>
        </div>
    );
}
