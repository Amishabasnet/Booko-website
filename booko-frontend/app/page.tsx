"use client";

import { useState } from "react";
import Link from "next/link";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";
import { useAuth } from "./context/AuthContext";

export default function HomePage() {
  const [filters, setFilters] = useState({});
  const { user } = useAuth();

  return (
    <main className="bg-background min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <header className="px-[5%] py-10 bg-gradient-to-b from-primary/10 to-transparent">
        <nav className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 mb-20">
          <h1 className="text-3xl font-black tracking-tighter m-0">
            BOOKO<span className="text-primary">.</span>
          </h1>
          <div className="flex items-center gap-6 md:gap-8">
            {user?.role === "admin" && (
              <Link href="/admin" className="text-primary hover:text-primary/80 no-underline text-sm font-black transition-colors flex items-center gap-1">
                <span className="text-lg">🛡️</span> Admin
              </Link>
            )}
            <Link href="/dashboard" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
              Profile
            </Link>
            {!user ? (
              <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl no-underline font-bold text-sm shadow-xl shadow-primary/20 transition-all">
                Sign In
              </Link>
            ) : (
              <div className="text-white/40 text-xs font-bold uppercase tracking-widest">{user.name}</div>
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
              <img src="/assets/images/kabaddi5.jpg" alt="Kabaddi 5" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
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
    </main>
  );
}
