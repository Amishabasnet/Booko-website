"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import AdminMovieManagement from "@/app/components/AdminMovieManagement";
import AdminTheaterShowtimeManagement from "@/app/components/AdminTheaterShowtimeManagement";
import AdminBookings from "@/app/components/AdminBookings";

export default function AdminPage() {
    const { user, logout } = useAuth();

    return (
        <ProtectedRoute role="admin">
            <main className="px-[5%] py-10 font-sans text-white bg-background min-h-screen">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 mb-10">
                    <div>
                        <h1 className="m-0 text-3xl font-black tracking-tight leading-tight">Admin Dashboard 🛡️</h1>
                        <p className="text-white/50 mt-2 text-sm leading-relaxed">Welcome, {user?.name}. You have admin privileges.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <Link href="/" className="text-white/40 hover:text-white no-underline font-semibold text-sm transition-colors">
                            Back to Home
                        </Link>
                        <button
                            onClick={logout}
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
                </div>
            </main>
        </ProtectedRoute>
    );
}
