"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("booko_token");
        const savedUser = localStorage.getItem("booko_user");
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = (token: string, user: User) => {
        localStorage.setItem("booko_token", token);
        localStorage.setItem("booko_user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("booko_token");
        localStorage.removeItem("booko_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
