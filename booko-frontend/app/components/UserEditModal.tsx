import React, { useState, ChangeEvent, FormEvent } from 'react';
import apiClient, { getImageUrl } from '@/app/utils/apiClient';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string;
}

interface Props {
    user: User;
    onClose: () => void;
    onUpdated: () => void;
}

const UserEditModal: React.FC<Props> = ({ user, onClose, onUpdated }) => {
    const [name, setName] = useState(user.name);
    const [role, setRole] = useState(user.role);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(getImageUrl(user.imageUrl) || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('role', role);
            if (imageFile) {
                formData.append('image', imageFile);
            }
            await apiClient.put(`/admin/users/${user._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            onUpdated();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm z-[100] animate-in fade-in duration-300">
            <div className="bg-[#0f0f0f] border border-white/10 text-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-black tracking-tighter">Edit User <span className="text-primary">.</span></h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors text-2xl">×</button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl text-primary text-xs font-bold uppercase tracking-wider">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <div className="h-24 w-24 rounded-3xl bg-white/5 border border-white/10 overflow-hidden relative group">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-3xl font-bold text-white/20">
                                    {name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Change</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-white/40">Profile Avatar</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            placeholder="User's full name"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all placeholder:text-white/20"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em] ml-1">Account Permission</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-primary/50 focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                            <option value="user" className="bg-[#1a1a1a]">Standard User</option>
                            <option value="admin" className="bg-[#1a1a1a]">Administrator</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-sm transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="py-4 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
