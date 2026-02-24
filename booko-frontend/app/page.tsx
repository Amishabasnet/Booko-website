"use client";

import { useState } from "react";
import Link from "next/link";
import MovieList from "./components/MovieList";
import SearchBar from "./components/SearchBar";

export default function HomePage() {
  const [filters, setFilters] = useState({});

  return (
    <main className="bg-background min-h-screen text-white font-sans antialiased overflow-x-hidden">
      <header className="px-[5%] py-10 bg-gradient-to-b from-primary/10 to-transparent">
        <nav className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 mb-20">
          <h1 className="text-3xl font-black tracking-tighter m-0">
            BOOKO<span className="text-primary">.</span>
          </h1>
          <div className="flex items-center gap-6 md:gap-8">
            <Link href="/dashboard" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="text-white/70 hover:text-white no-underline text-sm font-semibold transition-colors">
              Profile
            </Link>
            <Link href="/login" className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl no-underline font-bold text-sm shadow-xl shadow-primary/20 transition-all">
              Sign In
            </Link>
          </div>
        </nav>

        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] mb-5 tracking-tight">
            Experience Cinema Like Never Before
          </h2>
          <p className="text-lg text-white/60 m-0">
            Book your tickets for the latest blockbusters in just a few clicks.
          </p>
        </div>
      </header>

      <section className="px-[5%] pb-20">
        <SearchBar onSearch={setFilters} />
        <h3 className="text-2xl font-extrabold mb-8">Now Showing</h3>
        <MovieList filters={filters} />
      </section>
    </main>
  );
}
