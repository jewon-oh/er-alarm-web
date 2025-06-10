
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {toast} from "sonner";

export function EnableNotificationsButton() {
    const [mounted, setMounted] = useState(false);

    // 마운트 후에만 렌더하도록 플래그 설정
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted || typeof Notification === "undefined") {
        // SSR이거나 브라우저 환경이 아니면 렌더링하지 않음
        return null;
    }

    const handleClick = async () => {
        const permission = await Notification.requestPermission();
        toast("wow");
        console.log("Notification permission:", permission);
    };

    // 이미 허용/거부된 상태면 버튼 숨기기
    if (Notification.permission !== "default") return null;

    return <Button onClick={handleClick}>📢 알림 허용하기</Button>;
}