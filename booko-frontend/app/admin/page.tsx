"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminMovieManagement from "@/app/components/AdminMovieManagement";
import AdminTheaterShowtimeManagement from "@/app/components/AdminTheaterShowtimeManagement";
import AdminBookings from "@/app/components/AdminBookings";
import AdminContactMessages from "@/app/components/AdminContactMessages";
import AdminUserManagement from "@/app/components/AdminUserManagement";

export default function AdminPage() {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const isAdmin = sessionStorage.getItem("booko_admin_auth");
        if (isAdmin !== "true") {
            router.replace("/");
        } else {
            setAuthorized(true);
        }
    }, [router]);

    const handleLogout = () => {
        sessionStorage.removeItem("booko_admin_auth");
        router.push("/");
    };

    if (!authorized) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-background text-white">
                <p className="text-white/30 text-sm">Verifying admin access...</p>
            </div>
        );
    }

    return (
        <main className="px-[5%] py-10 font-sans text-white bg-background min-h-screen">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 mb-10">
                <div>
                    <h1 className="m-0 text-3xl font-black tracking-tight leading-tight">Admin Dashboard 🛡️</h1>
                    <p className="text-white/50 mt-2 text-sm leading-relaxed">Welcome, Admin. You have full access.</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <Link href="/" className="text-white/40 hover:text-white no-underline font-semibold text-sm transition-colors">
                        Back to Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl border-none cursor-pointer font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12 lg:gap-16">
                <AdminMovieManagement />
                <AdminTheaterShowtimeManagement />
                <AdminBookings />
                <AdminContactMessages />
                <AdminUserManagement />
            </div>
        </main>
    );
}
