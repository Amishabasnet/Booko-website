"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getProfile } from "@/app/services/auth.service";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useAuth } from "@/app/context/AuthContext";

interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
    dob?: string;
    gender?: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { logout } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem("booko_token");
            if (!token) {
                setError("No authentication token found.");
                setLoading(false);
                return;
            }

            try {
                const response = await getProfile();
                setProfile(response.data);
            } catch (err: unknown) {
                let message = "Failed to fetch profile.";
                if (axios.isAxiosError(err)) {
                    message = err.response?.data?.message || message;
                }
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <ProtectedRoute>
            <main className="max-w-2xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500">
                <h1 className="text-3xl md:text-4xl font-black mb-10 text-center tracking-tight">
                    User Profile <span className="text-primary">.</span>
                </h1>

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 text-white/40">
                        <div className="w-10 h-10 border-4 border-white/5 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-medium">Loading profile...</p>
                    </div>
                ) : error ? (
                    <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                        <p className="text-primary font-bold text-sm">{error}</p>
                    </div>
                ) : profile ? (
                    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-sm space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Full Name</label>
                            <div className="text-xl font-bold bg-white/5 border border-white/5 rounded-2xl p-4">{profile.name}</div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Email Address</label>
                            <div className="text-xl font-bold bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                <span className="opacity-40">✉️</span> {profile.email}
                            </div>
                        </div>

                        {profile.phoneNumber && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Phone Number</label>
                                <div className="text-sm font-bold bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                    <span className="opacity-40">📱</span> {profile.phoneNumber}
                                </div>
                            </div>
                        )}

                        {profile.dob && (
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Date of Birth</label>
                                <div className="text-sm font-bold bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                    <span className="opacity-40">🎂</span> {new Date(profile.dob).toLocaleDateString()}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Account Role</label>
                                <div className="flex">
                                    <span className="bg-primary/10 text-primary px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                        {profile.role}
                                    </span>
                                </div>
                            </div>

                            {profile.gender && (
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Gender</label>
                                    <div className="flex">
                                        <span className="bg-white/10 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                                            {profile.gender.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-6 border-t border-white/5 mt-10">
                            <button onClick={logout} className="w-full bg-transparent hover:bg-white/5 text-white/50 hover:text-white py-4 px-6 rounded-2xl font-bold text-sm border border-white/10 transition-all active:scale-[0.98]">
                                Logout from Session
                            </button>
                        </div>
                    </div>
                ) : null}
            </main>
        </ProtectedRoute>
    );
}
