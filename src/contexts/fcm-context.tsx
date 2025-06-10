

import {createContext, ReactNode, useContext} from "react";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { toast } from "sonner";
import { firebaseApp } from "@/lib/firebase";
import { useQuery } from "@tanstack/react-query";
import FcmListener from "@/components/fcm-listener";


type FcmContextValue ={
    fcmToken: string | undefined;
    isLoading: boolean;
}

export const FcmContext = createContext<FcmContextValue>({
    fcmToken: "",
    isLoading: false,
});


const fetchFcmToken= async () => {
    const supported = await isSupported();
    if (!supported) {
        toast("🔥 이 브라우저에서는 FCM 웹 푸시가 지원되지 않습니다.");
        return "";
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
        toast("🔕 알림 권한이 거부되었습니다.");
        return "";
    }

    const messaging = getMessaging(firebaseApp);
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
    const token = await getToken(messaging, { vapidKey });
    if (!token) {
        toast("❌ 토큰을 받아오지 못했습니다.");
        return "";
    }

    console.log("✅ FCM 토큰:", token);
    return token;
}

// async function postFcmToken(token: string) {
//     await axiosInstance.post("/api/tokens", { token });
// }

export default function FcmTokenProvider({ children }: { children: ReactNode }) {
    // const [fcmToken, setFcmToken] = useState<string | undefined>(undefined);
    // 1) 토큰을 가져오는 쿼리
    const {data,isFetching,isLoading}  = useQuery<string, Error>(
        {
            queryKey: ["fcm-token"],
            queryFn: () => fetchFcmToken().then(token => {return token;}),
            staleTime: Infinity,
            retry: false
        }
    );

    // // 2) 가져온 토큰을 서버에 전송하는 뮤테이션
    // const { mutate: sendToken, isLoading: isSending } = useMutation(
    //     postFcmToken,
    //     {
    //         onError(err: any) {
    //             console.error("서버 전송 실패:", err);
    //             toast("❌ 서버 전송 실패: " + err.message);
    //         },
    //         onSuccess() {
    //             toast("✅ 토큰 서버 전송 성공");
    //         },
    //     }
    // );
    //
    // // 3) 토큰이 준비되면 자동으로 보내기
    // if (fcmToken) {
    //     sendToken(fcmToken);
    // }

    return (
        <FcmContext.Provider value={{ fcmToken: data, isLoading: isLoading || isFetching }}>
            {data!=="" && !isLoading && !isFetching && <FcmListener/>}
            {children}
        </FcmContext.Provider>
    );
}

export function useFcmToken() {
    const context = useContext(FcmContext);
    if (!context) {
        throw new Error("useFcmToken must be used within a FcmTokenProvider");
    }
    return useContext(FcmContext);
}
