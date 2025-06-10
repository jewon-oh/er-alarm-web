import {Card, CardHeader, CardTitle, CardContent, CardFooter} from "@/components/ui/card";
import {Earnings} from "@/types/earnings";
import {formatKoreanDate, isDateStringAfterToday} from "@/utils/date";
import {Button} from "@/components/ui/button";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "@/constants/axios-instance";
import {useFcmToken} from "@/contexts/fcm-context";
import React, {useState} from "react";
import ConfirmCancelDialog from "@/components/confirm-cancel-dialog";
import {cn} from "@/lib/utils";
import {StockInfo} from "@/components/stocks/stock-info";
import {fetchStock} from "@/components/stocks/fetchStock";
import {Stock} from "@/types/stock";
import {useRouter} from "next/router";
import {format} from "date-fns";
import {ko} from "date-fns/locale/ko";

export interface EarningsCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
    earnings: Earnings,
    config: {
        showSymbol: boolean;
        showDate: boolean;
        showActual: boolean;
        showEstimate: boolean;
        showSubscribeButton: boolean;
    },
}

export const EarningsCard = React.forwardRef<HTMLDivElement, EarningsCardProps>(
    ({earnings, config, className, ...props}, ref) => {
        const qc = useQueryClient();
        const {fcmToken} = useFcmToken();
        const router = useRouter();
        const selectedDate = Array.isArray(router.query.date)
            ? router.query.date[0]
            : router.query.date ?? format(new Date(), "yyyy-MM-dd", {locale: ko});

        // --- 2) useMutation: 구독 & 구독 취소 ---
        const subscribeMutation = useMutation(
            {
                mutationFn: ({id, symbol}: { id: number; symbol: string }) =>
                    axiosInstance.post(`/api/earnings/${symbol}/subscribe`, {fcmToken, earningsId: id}),
                onSuccess: () => {
                    qc.invalidateQueries({queryKey: ["earnings", earnings.symbol, 0, 10, fcmToken]})
                    qc.invalidateQueries({queryKey: ["earningsCalendar", selectedDate]})
                },
            }
        )

        const unsubscribeMutation = useMutation(
            {
                mutationFn: ({id, symbol}: { id: number; symbol: string }) =>
                    axiosInstance.put(`/api/earnings/${symbol}/unsubscribe`, {fcmToken, earningsId: id}),
                onSuccess: () => {
                    qc.invalidateQueries({queryKey: ["earnings", earnings.symbol, 0, 10, fcmToken]})
                    qc.invalidateQueries({queryKey: ["earningsCalendar", selectedDate]})
                },
            }
        )

        const {data} = useQuery(
            {
                queryKey: ["stock", earnings.symbol],
                queryFn: () => fetchStock(earnings.symbol),
                staleTime: 5 * 60 * 1000,
                gcTime: 30 * 60 * 1000,
                placeholderData: keepPreviousData,
                enabled: Boolean(earnings.symbol),
            }
        )

        // --- 다이얼로그 제어용 상태 ---
        const [alertOpen, setAlertOpen] = useState(false)
        const [pendingType, setPendingType] = React.useState<"subscribe" | "unsubscribe">();

        const handleActionClick = (type: "subscribe" | "unsubscribe") => {
            setPendingType(type);
            setAlertOpen(true);
        };

        const handleConfirm = () => {
            if (pendingType === "subscribe") {
                subscribeMutation.mutate({id: earnings.id, symbol: earnings.symbol});
            } else if (pendingType === "unsubscribe") {
                unsubscribeMutation.mutate({id: earnings.id, symbol: earnings.symbol});
            }
            setAlertOpen(false);
        };

        const isMutating =
            subscribeMutation.isPending || unsubscribeMutation.isPending;

        return (
            <>
                <Card
                    ref={ref}
                    className={cn("min-w-[150px] min-h-[200px] flex flex-col", className)}
                    {...props}
                >
                    <CardHeader>
                        {config.showSymbol &&
                            <StockInfo
                                className="hover:cursor-pointer"
                                onClick={() => router.push(`/stocks/${earnings.symbol}`)}
                                symbol={earnings.symbol}
                                stock={data ?? {symbol: earnings.symbol} as Stock}/>}
                        <CardTitle className="flex justify-between items-center text-4xl font-bold">

                            {config.showDate && (
                                <span className="text-20 text-muted-foreground">
                                    {formatKoreanDate(earnings.earningsDate)}
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 flex-1">
                        {config.showEstimate && (
                            <p className="text-sm">
                                예상 EPS: <span className="font-medium">{earnings.epsEstimate}</span>
                            </p>
                        )}
                        {config.showActual && (
                            <p className="text-sm">
                                실제 EPS: <span className="font-medium">{earnings.epsActual}</span>
                                <span className="font-thin">({earnings.surprisePct}%)</span>
                            </p>
                        )}
                    </CardContent>

                    {isDateStringAfterToday(earnings.earningsDate) && config.showSubscribeButton && (
                        <CardFooter className="pt-0">
                            <Button
                                variant={earnings.subscribed ? "secondary" : "default"}
                                size="sm"
                                className="ml-auto"
                                onClick={() =>
                                    handleActionClick(earnings.subscribed ? "unsubscribe" : "subscribe")
                                }
                                disabled={isMutating}
                            >
                                {earnings.subscribed ? "🔕알림 취소" : "🔔 알림 설정"}
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <ConfirmCancelDialog
                    isOpen={alertOpen}
                    title={
                        pendingType === "subscribe"
                            ? `${earnings.symbol} 실적 발표일 알림 설정`
                            : `${earnings.symbol} 알림 취소`
                    }
                    description={
                        pendingType === "subscribe"
                            ? "실적 발표일에 알림을 받으시겠습니까?"
                            : "설정한 알림을 취소하시겠습니까?"
                    }
                    onConfirm={handleConfirm}
                    onCancel={() => setAlertOpen(false)}
                />
            </>
        );
    }
);
EarningsCard.displayName = "EarningsCard";