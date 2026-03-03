import React from 'react';

interface Props {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
}

const ConfirmDialog: React.FC<Props> = ({ title = 'Confirm', message, onConfirm, onCancel, open }) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-background text-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <p className="mb-4">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded bg-primary hover:bg-primary/90"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
