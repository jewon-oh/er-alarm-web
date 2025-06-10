import {useEffect} from "react";
import {getMessaging, onMessage} from "firebase/messaging";
import {firebaseApp} from "@/lib/firebase";
import {toast} from "sonner";

export default function FcmListener() {

    useEffect(()=>{
        const messaging = getMessaging(firebaseApp);
        onMessage(messaging, (payload) => {
            const title = payload.notification?.title || "📢 새 알림";
            const body = payload.notification?.body || "";
            toast(`${title}: ${body}`);
        });
    },[]);

    return null;
}