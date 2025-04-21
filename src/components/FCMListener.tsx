'use client';

import {useEffect, useState} from "react";
import { getMessaging, getToken, onMessage,isSupported } from "firebase/messaging";
import { firebaseApp } from "@/lib/firebase";
import { useToast } from "@/contexts/ToastContext";
import {axiosInstance} from "@/hooks/axiosInstance";

const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
export default function FCMListener() {
    const { showToast } = useToast();
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const setupFCM = async () => {
            try {
                const supported = await isSupported();
                if (!supported) {
                    setError("🔥 이 브라우저에서는 FCM 웹 푸시가 지원되지 않습니다.");
                    return;
                }

                const messaging = getMessaging(firebaseApp);
                const permission = await Notification.requestPermission();

                if (permission !== "granted") {
                    setError("🔕 알림 권한이 거부되었습니다.");
                    return;
                }

                const currentToken = await getToken(messaging, { vapidKey });
                if (!currentToken) {
                    setError("❌ 토큰을 받아오지 못했습니다.");
                    return;
                }

                setToken(currentToken); // ✅ 상태에 저장
                console.log("✅ FCM 토큰:", currentToken);

                const token = {token: currentToken};
                await axiosInstance.post("/api/tokens", token).catch(err => {
                    console.error("axios 에러:", err);
                    setError("❌ 서버 전송 실패: " + err.message);
                });

                onMessage(messaging, (payload) => {
                    const title = payload.notification?.title || "📢 새 알림";
                    const body = payload.notification?.body || "";
                    showToast(`${title}: ${body}`);
                });
            } catch (err) {
                console.error("FCM 설정 중 오류:", err);
                // setError("⚠️ FCM 설정 중 오류가 발생했습니다."+err);
            }
        };

        setupFCM();
    }, []);
    useEffect(() => {
    }, [showToast]);

    return (
        <div className="text-sm p-4">
            {error && <div>{error}</div>}
            {token ? (
                <>
                    <div className="font-bold mb-2">📬 현재 FCM 토큰:</div>
                    <code className="block break-all text-[10px] bg-gray-100 p-2 rounded">{token}</code>
                </>
            ) : (
                <div className="text-gray-400">🔄 토큰을 불러오는 중...</div>
            )}
        </div>
    );
}
