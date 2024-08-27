import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/Toaster";
import { ReactQueryProvider } from "@/context/ReactQueryProvider";
import AuthSessionProvider from "@/context/SessionProvider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reddit",
  description: "A Redit clone built with Next.js and Typescript",
};

export default function RootLayout({
  children,
  authModal,
}: Readonly<{
  children: React.ReactNode;
  authModal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <ReactQueryProvider>
          <AuthSessionProvider>
            <Navbar />

            {authModal}

            <div className="container max-w-7xl mx-auto h-full pt-4 sm:pt-8">
              {children}
            </div>

            <Toaster />
          </AuthSessionProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
