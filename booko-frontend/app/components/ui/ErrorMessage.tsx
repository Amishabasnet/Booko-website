"use client";

import React from "react";

interface ErrorMessageProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

export default function ErrorMessage({
    title = "Oops! Something went wrong",
    message = "We encountered an error while processing your request.",
    onRetry
}: ErrorMessageProps) {
    return (
        <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-10 text-center max-w-lg mx-auto my-10 text-white">
            <span className="text-5xl mb-5 block">⚠️</span>
            <h3 className="text-2xl font-extrabold mb-2.5 text-red-500">{title}</h3>
            <p className="text-base text-white/60 mb-6 leading-relaxed">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-primary hover:scale-105 active:scale-95 text-white border-none py-3 px-8 rounded-xl font-bold cursor-pointer text-sm transition-transform duration-200"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}
