'use client';

import FCMListener from "@/components/FCMListener";
import {ToastProvider} from "@/contexts/ToastContext";

export default function Home() {
    return (
        <ToastProvider>
            <FCMListener/>
            <main className="p-8 z-0">
                <h1 className="text-xl font-bold">🔥 FCM Toast 알림 테스트</h1>
                <p>푸시 알림이 오면 오른쪽 위에 토스트로 표시됩니다.</p>
            </main>
        </ToastProvider>
    );
}
