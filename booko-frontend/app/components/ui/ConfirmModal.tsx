"use client";

import { useState, useRef } from "react";

interface ConfirmModalProps {
    open: boolean;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ open, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[2000] p-5 animate-in fade-in duration-200">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[28px] p-8 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-center">
                <div className="text-4xl mb-5">⚠️</div>
                <h3 className="text-lg font-black tracking-tight mb-2 text-white">
                    Are you sure?
                </h3>
                <p className="text-white/40 text-sm mb-8">
                    {message || "This action cannot be undone."}
                </p>
                <div className="flex justify-center gap-3">
                    <button
                        onClick={onCancel}
                        className="text-white/50 hover:text-white py-3 px-6 text-sm font-bold transition-colors bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-primary hover:bg-primary/90 text-white py-3 px-8 rounded-xl font-bold text-sm shadow-xl shadow-primary/20 transition-all active:scale-95 border-none cursor-pointer"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// Hook for easy usage — uses useRef to avoid stale closure issues
export function useConfirmModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const callbackRef = useRef<(() => void) | null>(null);

    const showConfirm = (msg: string, callback: () => void) => {
        setMessage(msg);
        callbackRef.current = callback;
        setIsOpen(true);
    };

    const handleConfirm = () => {
        setIsOpen(false);
        callbackRef.current?.();
        callbackRef.current = null;
    };

    const handleCancel = () => {
        setIsOpen(false);
        callbackRef.current = null;
    };

    return { isOpen, message, showConfirm, handleConfirm, handleCancel };
}
