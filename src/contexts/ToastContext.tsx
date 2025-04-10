'use client';

import React, {createContext, useContext, useState, ReactNode} from "react";

type Toast = {
    id: number;
    message: string;
};

type ToastContextType = {
    showToast: (message: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export const ToastProvider = ({children}: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string) => {
        const id = Date.now();
        setToasts((prev) => [ {id, message},...prev]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000); // 4초 후 사라짐
    };

    return (
        <ToastContext.Provider value={{showToast}}>
            {children}
            {/* 오른쪽 위에 토스트 고정 */}
            <div
                className="fixed top-4 right-4 z-[9999] flex flex-col items-end space-y-2 pointer-events-none"
            >
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in pointer-events-auto"
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
