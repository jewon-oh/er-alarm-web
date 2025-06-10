import { FC, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SettingsPage: FC = () => {
    const [granted, setGranted] = useState(false);

    // 최초 렌더링 후 한 번만 권한 상태 체크
    useEffect(() => {
        setGranted(Notification.permission === 'granted');
    }, []);

    const handleRequestPermission =async () => {
        // **순수 클릭 핸들러** 안에서 바로 호출
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            setGranted(true);
            toast.success('알림 권한이 허용되었습니다!');
        } else {
            toast.error('알림 권한이 거부되었습니다.');
        }
    };

    if (granted) {
        return (
            <div className="flex items-center justify-center h-screen bg-slate-50 p-4">
                <Card className="max-w-lg w-full">
                    <CardContent className="text-center text-2xl p-3">
                        알림을 받을 준비가 됐습니다!
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center h-screen bg-slate-50 p-4">
            <Card className="max-w-lg w-full">
                <CardContent className="text-center space-y-6">
                    <div className="text-2xl">알림 설정을 다시 활성화하세요</div>
                    <p className="text-sm text-muted-foreground">
                        알림 권한을 허용해 주시면 실시간 알림을 받아보실 수 있습니다.
                    </p>
                    <Button size="lg" onClick={handleRequestPermission} className="mx-auto">
                        알림 권한 요청
                    </Button>
                    <div className="text-left text-sm text-muted-foreground">
                        <p className="font-medium mb-2">수동 설정 방법:</p>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>주소창 왼쪽의 자물쇠 아이콘 클릭</li>
                            <li>“사이트 설정” 선택</li>
                            <li>“알림” 항목을 “허용”으로 변경</li>
                            <li>페이지 새로고침</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
