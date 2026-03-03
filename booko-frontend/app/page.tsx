"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import { useAuth } from "./context/AuthContext";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export default function HomePage() {
  const [filters, setFilters] = useState({});
  const { user, logout } = useAuth();
  const router = useRouter();

  // Admin login modal state
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");

    // Step 1: Check hardcoded UI credentials
    if (adminUsername !== "admin" || adminPassword !== "admin123") {
      setAdminError("Invalid username or password.");
      return;
    }

    // Step 2: Call backend with the real admin account credentials
    setAdminLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login`, {
        email: "admin@booko.com",
        password: "admin123",
      });
      const { token, user: adminUser } = res.data;
      localStorage.setItem("booko_token", token);
      localStorage.setItem("booko_user", JSON.stringify(adminUser));
      sessionStorage.setItem("booko_admin_auth", "true");
      setAdminModalOpen(false);
      setAdminUsername("");
      setAdminPassword("");
      router.push("/admin");
    } catch (err: any) {
      setAdminError("Admin account not set up. Please run the admin seed script.");
    } finally {
      setAdminLoading(false);
    }
  };


  return (
    <main className="bg-background min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <header className="px-[5%] py-10 bg-gradient-to-b from-primary/10 to-transparent">
        <nav className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 mb-20">
          <h1 className="text-3xl font-black tracking-tighter m-0">
            BOOKO<span className="text-primary">.</span>
          </h1>
          <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center">
            {user ? (
              <>
                <Link href="/" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
                  Home
                </Link>
                <Link href="/profile" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
                  Profile
                </Link>
                <Link href="/contact" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
                  Contact Us
                </Link>
                <button
                  onClick={() => { setAdminError(""); setAdminModalOpen(true); }}
                  className="text-primary hover:text-primary/80 text-sm font-black transition-colors flex items-center gap-1 bg-transparent border-none cursor-pointer p-0"
                >
                  <span className="text-lg">🛡️</span> Admin Panel
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl no-underline font-bold text-sm shadow-xl shadow-primary/20 transition-all">
                Sign In
              </Link>
            )}
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto xl:px-8 mt-10 md:mt-20">
          <div className="max-w-2xl flex-1 z-10 relative">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-white/50">
              Experience Cinema Like Never Before
            </h2>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl leading-relaxed font-medium">
              Book your tickets for the latest blockbusters in just a few clicks. Dive into the world of entertainment with Booko.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#now-showing" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 no-underline">
                Book Now
              </a>
              <a href="#now-showing" className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 no-underline">
                View Schedule
              </a>
            </div>
          </div>

          <div className="relative w-full max-w-[500px] lg:max-w-[600px] aspect-square hidden md:block flex-1">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/20 rounded-full blur-[100px] opacity-60 pointer-events-none"></div>

            {/* Attractive collage of movies */}
            <div className="absolute top-0 right-4 lg:right-10 w-48 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl transform rotate-6 border border-white/10 z-20 hover:rotate-0 transition-transform duration-500 hover:scale-110 hover:z-50 group">
              <img src="/assets/images/predator-badlands.jpg" alt="Predator: Badlands" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute top-20 -left-4 lg:left-0 w-48 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 border border-white/10 z-10 hover:rotate-0 transition-transform duration-500 hover:scale-110 hover:z-50 group">
              <img src="/assets/images/dune3.jpg" alt="Dune Messiah" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="absolute bottom-4 right-20 lg:right-32 w-48 lg:w-56 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl transform rotate-[15deg] border border-white/10 z-30 hover:rotate-0 transition-transform duration-500 hover:scale-110 hover:z-50 group">
              <img src="/assets/images/runningman.jpg" alt="The Running Man" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </header>

      <section id="now-showing" className="px-[5%] pb-20">
        <SearchBar onSearch={setFilters} />
        <h3 className="text-2xl font-extrabold mb-8">Now Showing</h3>
        <MovieList filters={filters} />
      </section>

      {/* Admin Login Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[1000] p-5 animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 md:p-10 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">🛡️</span>
              <h3 className="text-2xl font-black tracking-tight m-0">Admin Login</h3>
            </div>
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-widest pl-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={adminUsername}
                  onChange={e => { setAdminUsername(e.target.value); setAdminError(""); }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                  required
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] sm:text-xs font-black text-white/40 uppercase tracking-widest pl-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={e => { setAdminPassword(e.target.value); setAdminError(""); }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                  required
                />
              </div>
              {adminError && (
                <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-xs font-semibold border border-red-500/10 text-center">
                  {adminError}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => { setAdminModalOpen(false); setAdminUsername(""); setAdminPassword(""); setAdminError(""); }}
                  className="text-white/50 hover:text-white py-3 px-6 text-sm font-bold transition-colors bg-transparent border-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adminLoading}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white py-3 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-wide border-none cursor-pointer"
                >
                  {adminLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
