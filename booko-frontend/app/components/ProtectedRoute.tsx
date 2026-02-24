"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: string;
}

export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace("/login");
            } else if (role && user.role !== role) {
                router.replace("/");
            }
        }
    }, [user, loading, role, router]);

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "white" }}>
                Loading...
            </div>
        );
    }

    if (!user || (role && user.role !== role)) {
        return null;
    }

    return <>{children}</>;
}
