"use client";

import React from "react";

interface LoaderProps {
    message?: string;
    fullscreen?: boolean;
}

export default function Loader({ message = "Loading...", fullscreen = false }: LoaderProps) {
    return (
        <div className={`flex flex-col items-center justify-center p-10 w-full text-white ${fullscreen ? "fixed inset-0 min-h-screen bg-background z-[9999]" : "relative min-h-[200px] bg-transparent z-[1]"}`}>
            <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin mb-5"></div>
            {message && <p className="text-lg font-semibold text-white/70 tracking-wide">{message}</p>}
        </div>
    );
}
