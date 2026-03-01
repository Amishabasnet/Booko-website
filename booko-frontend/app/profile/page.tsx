"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getProfile, updateProfile } from "@/app/services/auth.service";
import { getUserBookings } from "@/app/services/booking.service";
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

interface Booking {
    _id: string;
    selectedSeats: string[];
    totalAmount: number;
    bookingStatus: string;
    paymentStatus: string;
}

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState({ totalTickets: 0, confirmedBookings: 0, pendingPayment: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edit Form State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: "", email: "", phoneNumber: "", dob: "", gender: "prefer_not_to_say", password: ""
    });
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const { logout } = useAuth();

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem("booko_token");
            if (!token) {
                setError("No authentication token found.");
                setLoading(false);
                return;
            }

            try {
                const [profileRes, bookingsRes] = await Promise.all([
                    getProfile(),
                    getUserBookings()
                ]);

                const userData = profileRes.data.user || profileRes.data;
                setProfile(userData);

                // Set initial form values
                setEditForm({
                    name: userData.name || "",
                    email: userData.email || "",
                    phoneNumber: userData.phoneNumber || "",
                    dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : "",
                    gender: userData.gender || "prefer_not_to_say",
                    password: "" // Keep password empty initially
                });

                const bookings = bookingsRes.data.bookings || bookingsRes.data || [];

                let totalTickets = 0;
                let confirmedBookings = 0;
                let pendingPayment = 0;

                bookings.forEach((booking: Booking) => {
                    if (booking.bookingStatus !== "cancelled") {
                        totalTickets += booking.selectedSeats?.length || 0;
                        if (booking.bookingStatus === "confirmed") confirmedBookings++;
                        if (booking.paymentStatus === "pending") pendingPayment += booking.totalAmount || 0;
                    }
                });

                setStats({ totalTickets, confirmedBookings, pendingPayment });

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

        fetchProfileData();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUpdateError(null);
        setUpdateSuccess(null);
        setIsUpdating(true);

        try {
            const dataToUpdate: any = { ...editForm };
            if (!dataToUpdate.password) {
                delete dataToUpdate.password;
            }

            const response = await updateProfile(dataToUpdate);
            setProfile(response.data.user || response.data);
            setUpdateSuccess("Profile updated successfully!");

            setTimeout(() => {
                setIsEditing(false);
                setUpdateSuccess(null);
            }, 2000);

        } catch (err: unknown) {
            let message = "Failed to update profile.";
            if (axios.isAxiosError(err)) {
                message = err.response?.data?.message || message;
            }
            setUpdateError(message);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <ProtectedRoute>
            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-500 text-white font-sans">
                <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <h1 className="text-3xl md:text-4xl font-black text-center tracking-tight m-0">
                        User Profile <span className="text-primary">.</span>
                    </h1>
                    {profile && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
                        >
                            Edit Profile
                        </button>
                    )}
                </header>

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
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* Profile Info or Edit Form */}
                        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8 md:p-10 shadow-2xl backdrop-blur-sm">
                            {isEditing ? (
                                <form onSubmit={handleUpdate} className="grid gap-6">
                                    <h2 className="text-xl font-black mb-4">Edit Details</h2>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="grid gap-2">
                                            <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Full Name</label>
                                            <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Email</label>
                                            <input type="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="grid gap-2">
                                            <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Phone Number</label>
                                            <input type="tel" value={editForm.phoneNumber} onChange={e => setEditForm({ ...editForm, phoneNumber: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Date of Birth</label>
                                            <input type="date" value={editForm.dob} onChange={e => setEditForm({ ...editForm, dob: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="grid gap-2">
                                            <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Gender</label>
                                            <select value={editForm.gender} onChange={e => setEditForm({ ...editForm, gender: e.target.value })} className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer">
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                                <option value="prefer_not_to_say">Prefer not to say</option>
                                            </select>
                                        </div>
                                        <div className="grid gap-2">
                                            <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">New Password (Optional)</label>
                                            <input type="password" placeholder="Leave empty to keep current" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20" />
                                        </div>
                                    </div>

                                    {updateError && (
                                        <div className="bg-primary/10 border border-primary/30 p-4 rounded-xl text-primary text-xs font-bold text-center">
                                            {updateError}
                                        </div>
                                    )}
                                    {updateSuccess && (
                                        <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-xl text-green-500 text-xs font-bold text-center">
                                            {updateSuccess}
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-4 mt-4">
                                        <button type="button" onClick={() => setIsEditing(false)} className="bg-transparent hover:bg-white/5 text-white/70 hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all">Cancel</button>
                                        <button type="submit" disabled={isUpdating} className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50">
                                            {isUpdating ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Full Name</label>
                                        <div className="text-xl md:text-2xl font-bold bg-white/5 border border-white/5 rounded-2xl p-4">{profile.name}</div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Email Address</label>
                                            <div className="text-base font-bold bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3 truncate">
                                                <span className="opacity-40">✉️</span> {profile.email}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Phone Number</label>
                                            <div className="text-base font-bold bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                                <span className="opacity-40">📱</span> {profile.phoneNumber || "Not provided"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Date of Birth</label>
                                            <div className="text-base font-bold bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                                                <span className="opacity-40">🎂</span> {profile.dob ? new Date(profile.dob).toLocaleDateString() : "Not provided"}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Account Role</label>
                                                <div className="flex h-full items-center">
                                                    <span className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${profile.role === 'admin'
                                                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        : 'bg-primary/10 text-primary border-primary/20'
                                                        }`}>
                                                        {profile.role === 'admin' ? '⭐ Admin' : '👤 User'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase font-black text-white/30 tracking-[0.2em] ml-1">Gender</label>
                                                <div className="flex h-full items-center">
                                                    <span className="bg-white/10 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 truncate">
                                                        {(profile.gender || "Not provided").replace(/_/g, " ")}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/5 mt-10">
                                        <button onClick={logout} className="w-full bg-transparent hover:bg-white/5 text-white/50 hover:text-white py-4 px-6 rounded-2xl font-bold text-sm border border-white/10 transition-all active:scale-[0.98]">
                                            Logout from Session
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Booking Statistics */}
                        <div className="lg:col-span-1 grid gap-4">
                            <h2 className="text-xl font-black mb-2 opacity-80 pl-2">Booking Activity</h2>

                            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">🎟️</div>
                                <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] block mb-2">Total Tickets</label>
                                <div className="text-4xl font-black text-white">{stats.totalTickets}</div>
                            </div>

                            <div className="bg-green-500/5 border border-green-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">✅</div>
                                <label className="text-[10px] uppercase font-black text-green-500/50 tracking-[0.2em] block mb-2">Confirmed Bookings</label>
                                <div className="text-4xl font-black text-green-500">{stats.confirmedBookings}</div>
                            </div>

                            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform">💰</div>
                                <label className="text-[10px] uppercase font-black text-yellow-500/50 tracking-[0.2em] block mb-2">Pending Payment</label>
                                <div className="text-4xl font-black text-yellow-500">NPR {stats.pendingPayment.toFixed(2)}</div>
                            </div>
                        </div>

                    </div>
                ) : null}
            </main>
        </ProtectedRoute>
    );
}
