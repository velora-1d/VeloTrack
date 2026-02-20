import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

// Menggunakan Plus Jakarta Sans (Sangat cocok untuk SaaS/Premium UI)
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VeloTrack | Velora Digital Studio",
  description: "Sistem Manajemen Internal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // SuppressHydrationWarning mencegah error saat next-themes membaca local storage
    <html lang="id" suppressHydrationWarning>
      <body className={`${pjs.className} antialiased selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
