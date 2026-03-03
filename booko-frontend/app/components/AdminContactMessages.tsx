"use client";

import { useEffect, useState } from "react";

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    date: string;
}

export default function AdminContactMessages() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("booko_contacts") || "[]");
        setMessages(stored.reverse());
    }, []);

    const confirmDelete = () => {
        if (!pendingDeleteId) return;
        const idToDelete = pendingDeleteId;
        setPendingDeleteId(null);
        setMessages(prev => {
            const updated = prev.filter(m => m.id !== idToDelete);
            localStorage.setItem("booko_contacts", JSON.stringify([...updated].reverse()));
            return updated;
        });
    };

    return (
        <section className="mt-10">
            <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-white/5 shadow-inner">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <h3 className="text-xl font-black m-0 tracking-tight">📬 Contact Messages</h3>
                    <span className="text-white/30 text-xs font-bold uppercase tracking-widest">
                        {messages.length} message{messages.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {messages.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-white/30 text-sm italic">No contact messages yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4 max-h-[600px] overflow-y-auto pr-2">
                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.05] transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                                    <div>
                                        <h4 className="font-bold text-sm m-0">{msg.name}</h4>
                                        <p className="text-white/40 text-xs mt-1 m-0">{msg.email}</p>
                                        {msg.phone && <p className="text-white/40 text-xs mt-0.5 m-0">📞 {msg.phone}</p>}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                                            {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString()}
                                        </span>
                                        <button
                                            onClick={() => setPendingDeleteId(msg.id)}
                                            className="bg-primary/10 hover:bg-primary/20 text-primary py-1 px-3 rounded-lg text-xs font-bold border border-primary/20 transition-colors cursor-pointer"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed m-0 whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Confirm Delete Modal */}
            {pendingDeleteId && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[2000] p-5">
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-[28px] p-8 w-full max-w-sm shadow-2xl text-center">
                        <div className="text-4xl mb-5">⚠️</div>
                        <h3 className="text-lg font-black tracking-tight mb-2 text-white">Are you sure?</h3>
                        <p className="text-white/40 text-sm mb-8">Are you sure you want to delete this message?</p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => setPendingDeleteId(null)}
                                className="text-white/50 hover:text-white py-3 px-6 text-sm font-bold transition-colors bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 border-none cursor-pointer"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
