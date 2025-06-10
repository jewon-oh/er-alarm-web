import {useRouter} from "next/router";
import {DateTabs} from "@/components/date-tabs";
import {EarningsCard} from "@/components/earnings/earnings-card";
import {Earnings} from "@/types/earnings";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "@/components/ui/calendar";
import {Button} from "@/components/ui/button";
import {CalendarIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {ko} from "date-fns/locale/ko";
import {useMemo, useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {fetchEarnings} from "@/components/earnings/fetchEarnings";
import {useFcmToken} from "@/contexts/fcm-context";
import {Card,  CardHeader} from "@/components/ui/card";


export default function EarningsCalendar() {
    const router = useRouter();
    const selectedDate = Array.isArray(router.query.date)
        ? router.query.date[0]
        : router.query.date ?? format(new Date(), "yyyy-MM-dd", {locale: ko});
    const [date, setDate] = useState<Date>(new Date(selectedDate));

    const {fcmToken} = useFcmToken();

    const onSelect = (day:Date|undefined) => {
        if (!day) return;
        console.log(day);
        setDate(day);
        const d = format(day, "yyyy-MM-dd", {locale: ko});
        router.push({
                pathname: router.pathname,
                query: {date: d}
            }, undefined,
            {shallow: true});
    };

    // queryKey에 문자열을 넣어야 재사용·중복 호출 방지
    const {data, isLoading, isError} = useQuery(
        {
            queryKey: ["earningsCalendar", selectedDate],
            queryFn: () => fetchEarnings("", 0, 20, fcmToken, selectedDate),
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            placeholderData: keepPreviousData,
            enabled: Boolean(fcmToken),
        }
    );

    // 날짜별 그룹핑
    const grouped = useMemo(() => {
        const ret: Record<string, Earnings[]> = {};
        data?.content.forEach((e) => {
            const dayKey = format(new Date(e.earningsDate), "yyyy-MM-dd", {locale: ko});
            if (!ret[dayKey]) ret[dayKey] = [];
            ret[dayKey].push(e);
        });
        return ret;
    }, [data?.content]);

    // 선택된 날짜 배열, 기본값 빈 배열
    const earningsForSelected = grouped[selectedDate] ?? [];

    return (
        <div className={cn(
            "py-4 pl-2 pr-3 space-y-2",
            // 모바일~sm: 화면 100% 차지
            "w-full",
            // sm〜md: 400px 고정
            "sm:w-[400px]",
            // md〜lg: 600px 고정
            "md:w-[600px]",
            // lg 이상: 800px 고정
            "lg:w-[800px]"
        )}>
            <Card className="sticky top-0 z-10 ">
                <CardHeader>
                    <Label htmlFor="date-tabs" className="text-sm font-medium"/>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-[160px] pl-3 font-normal ml-auto",
                                    !date && "text-muted-foreground"
                                )}
                            >
                                {date ? format(date, "PPP", {locale: ko}) : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(date)=>{onSelect(date)}}
                                disabled={(d) => d < new Date("1900-01-01")}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <DateTabs date={date} onSelect={onSelect}/>
                </CardHeader>
            </Card>
            {isLoading ? (
                <p className="text-center w-full py-8">로딩 중…</p>
            ) : isError ? (
                <p className="text-center w-full text-red-500 py-8">
                    데이터를 불러오는 중 오류가 발생했습니다.
                </p>
            ) : earningsForSelected.length > 0 ? (
                earningsForSelected.map((item) => (
                    <EarningsCard
                        key={`ec-${item.id}`}
                        earnings={item}
                        config={{
                            showDate: false,
                            showSymbol: true,
                            showActual: true,
                            showEstimate: true,
                            showSubscribeButton: true
                        }}
                    />
                ))
            ) : (
                <p className="text-center w-full">
                    해당 날짜에 실적 발표 정보가 없습니다.
                </p>
            )}
        </div>
    );
}