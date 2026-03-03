import React, { useEffect, useState } from 'react';
import apiClient, { getImageUrl } from '@/app/utils/apiClient';
import UserEditModal from '@/app/components/UserEditModal';
import ConfirmDialog from '@/app/components/ConfirmDialog';
import Loader from './ui/Loader';
import ErrorMessage from './ui/ErrorMessage';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string;
    bookingCount: number;
    createdAt: string;
}

const AdminUserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editUser, setEditUser] = useState<User | null>(null);
    const [showEdit, setShowEdit] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [stats, setStats] = useState({
        total: 0,
        admins: 0,
        activeBookers: 0
    });

    const fetchUsers = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await apiClient.get('/admin/users');
            const userData = res.data.users || [];
            setUsers(userData);

            // Calculate basic stats for the dashboard
            setStats({
                total: res.data.total || userData.length,
                admins: userData.filter((u: User) => u.role === 'admin').length,
                activeBookers: userData.filter((u: User) => u.bookingCount > 0).length
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load users. Please check your connection or permissions.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEdit = (user: User) => {
        setEditUser(user);
        setShowEdit(true);
    };

    const handleDelete = (id: string) => {
        setDeleteUserId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!deleteUserId) return;
        try {
            await apiClient.delete(`/admin/users/${deleteUserId}`);
            await fetchUsers();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete user');
        } finally {
            setShowConfirm(false);
            setDeleteUserId(null);
        }
    };

    if (loading && users.length === 0) return <div className="py-20 flex justify-center"><Loader /></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header section with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.total}
                    icon="👥"
                    color="bg-blue-500/10 text-blue-500"
                />
                <StatCard
                    title="Administrators"
                    value={stats.admins}
                    icon="🛡️"
                    color="bg-purple-500/10 text-purple-500"
                />
                <StatCard
                    title="Active Bookers"
                    value={stats.activeBookers}
                    icon="🎟️"
                    color="bg-green-500/10 text-green-500"
                />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">User Management</h2>
                        <p className="text-white/40 text-sm">View, edit, and manage system users and their roles</p>
                    </div>
                </div>

                {error && <div className="p-6"><ErrorMessage message={error} /></div>}

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-white/5 text-left">
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">User</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Role</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Bookings</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Joined</th>
                                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex-shrink-0 overflow-hidden border border-white/10 group-hover:border-primary/50 transition-colors">
                                                {user.imageUrl ? (
                                                    <img src={getImageUrl(user.imageUrl)} alt={user.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-xl font-bold text-white/20">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white font-bold group-hover:text-primary transition-colors">{user.name}</span>
                                                <span className="text-white/40 text-xs">{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin'
                                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-mono">{user.bookingCount || 0}</span>
                                            <span className="text-[10px] text-white/40 uppercase font-black">Bookings</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-white/40 text-sm whitespace-nowrap">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-primary text-white transition-all active:scale-95 border border-white/10 hover:border-primary/50"
                                                title="Edit User"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500 text-white transition-all active:scale-95 border border-white/10 hover:border-red-500/50"
                                                title="Delete User"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-white/40">
                                        <p className="text-lg font-bold">No users found</p>
                                        <p className="text-sm">When users join Booko, they will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showEdit && editUser && (
                <UserEditModal
                    user={editUser}
                    onClose={() => setShowEdit(false)}
                    onUpdated={() => {
                        setShowEdit(false);
                        fetchUsers();
                    }}
                />
            )}

            <ConfirmDialog
                open={showConfirm}
                title="Delete User"
                message={`Are you sure you want to delete ${users.find(u => u._id === deleteUserId)?.name}? This action cannot be undone and will remove all their data from Booko.`}
                onCancel={() => setShowConfirm(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: number, icon: string, color: string }) => (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex items-center gap-6 backdrop-blur-sm shadow-xl">
        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-2xl ${color}`}>
            {icon}
        </div>
        <div className="flex flex-col">
            <span className="text-white/40 text-xs font-black uppercase tracking-widest">{title}</span>
            <span className="text-3xl font-black text-white">{value}</span>
        </div>
    </div>
);

export default AdminUserManagement;
