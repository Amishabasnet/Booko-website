"use client";

import { useState } from "react";
import Link from "next/link";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    date: string;
}

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const existing: ContactMessage[] = JSON.parse(localStorage.getItem("booko_contacts") || "[]");
        const newMessage: ContactMessage = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            message,
            date: new Date().toISOString(),
        };
        existing.push(newMessage);
        localStorage.setItem("booko_contacts", JSON.stringify(existing));

        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        setSent(true);
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <main className="bg-background min-h-screen text-white font-sans antialiased">
            <header className="px-[5%] py-10 border-b border-white/5">
                <nav className="flex justify-between items-center">
                    <Link href="/" className="text-3xl font-black tracking-tighter no-underline text-white">
                        BOOKO<span className="text-primary">.</span>
                    </Link>
                    <Link href="/" className="text-white/50 hover:text-white no-underline text-sm font-semibold transition-colors">
                        ← Back to Home
                    </Link>
                </nav>
            </header>

            <section className="px-[5%] py-20 max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                    Contact Us
                </h2>
                <p className="text-white/50 text-lg mb-12">
                    Have questions or feedback? We&apos;d love to hear from you.
                </p>

                {sent && (
                    <div className="bg-green-500/10 text-green-400 p-4 rounded-xl mb-6 text-sm font-semibold border border-green-500/10 text-center">
                        ✅ Thank you for your message! We&apos;ll get back to you soon.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">
                            Your Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. John Doe"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="e.g. john@example.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">
                            Phone No.
                        </label>
                        <input
                            type="tel"
                            placeholder="e.g. +977 9800000000"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            required
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors placeholder:text-white/20"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black text-white/40 uppercase tracking-widest pl-1">
                            Message
                        </label>
                        <textarea
                            placeholder="Write your message here..."
                            rows={5}
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            required
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-colors resize-none placeholder:text-white/20"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-white py-4 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-wide border-none cursor-pointer mt-2"
                    >
                        Send Message
                    </button>
                </form>

                <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="text-2xl mb-3">📧</div>
                        <h4 className="font-bold text-sm mb-1">Email</h4>
                        <p className="text-white/40 text-xs">support@booko.com</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="text-2xl mb-3">📞</div>
                        <h4 className="font-bold text-sm mb-1">Phone</h4>
                        <p className="text-white/40 text-xs">+977 9800000000</p>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-2xl p-6">
                        <div className="text-2xl mb-3">📍</div>
                        <h4 className="font-bold text-sm mb-1">Location</h4>
                        <p className="text-white/40 text-xs">Kathmandu, Nepal</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
