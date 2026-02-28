"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background text-white p-6 md:p-12 lg:p-20 font-sans">
        <div className="max-w-5xl mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b border-white/10 pb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                Booko Dashboard <span className="text-primary">.</span>
              </h1>
              <p className="text-white/50 text-sm md:text-base m-0">
                Manage your bookings, explore movies, and update your profile
              </p>
            </div>
            <button
              onClick={logout}
              className="bg-white/5 hover:bg-white/10 text-white/80 hover:text-white py-3 px-6 rounded-2xl font-bold text-sm border border-white/10 transition-all active:scale-[0.98]"
            >
              Logout
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 shadow-xl hover:bg-white/[0.07] transition-colors">
              <div className="text-3xl mb-4 opacity-50">🎟️</div>
              <h2 className="text-xl font-black text-white mb-2">My Bookings</h2>
              <p className="text-sm text-white/50 mb-6">View and manage your upcoming movie reservations.</p>
              <Link href="#" className="text-primary font-bold text-sm hover:underline underline-offset-4 pointer-events-none opacity-50">Coming Soon →</Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 shadow-xl hover:bg-white/[0.07] transition-colors">
              <div className="text-3xl mb-4 opacity-50">🎬</div>
              <h2 className="text-xl font-black text-white mb-2">Explore Movies</h2>
              <p className="text-sm text-white/50 mb-6">Discover new releases and find showtimes near you.</p>
              <Link href="/" className="text-primary font-bold text-sm hover:underline underline-offset-4">Browse Now →</Link>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[24px] p-8 shadow-xl hover:bg-white/[0.07] transition-colors">
              <div className="text-3xl mb-4 opacity-50">👤</div>
              <h2 className="text-xl font-black text-white mb-2">Profile Settings</h2>
              <p className="text-sm text-white/50 mb-6">Update your personal information and preferences.</p>
              <Link href="/profile" className="text-primary font-bold text-sm hover:underline underline-offset-4">View Profile →</Link>
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
