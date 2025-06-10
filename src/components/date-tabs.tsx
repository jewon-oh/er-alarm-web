import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {format, addDays, startOfWeek} from "date-fns";
import {useRouter} from "next/router";
import {ko} from "date-fns/locale/ko";

export function DateTabs({date, onSelect}: {
    date: Date,
    onSelect: (date: Date) => void,
    className?: string,
}) {
    const router = useRouter();
    const {date: currentDate} = router.query;

    // 주 시작일 (일요일 기준)
    const weekStart = startOfWeek(date, {weekStartsOn: 0});
    const days = Array.from({length: 7}).map((_, i) => addDays(weekStart, i));

    const selected =
        typeof currentDate === "string"
            ? currentDate
            : format(date, "yyyy-MM-dd", {locale: ko});

    return (
        <Tabs defaultValue={selected} value={selected}>
            <TabsList className="w-full h-[50px]">
                {days.slice(1, days.length).map((day) => {
                    const val = format(day, "yyyy-MM-dd", {locale: ko});
                    return (
                        <TabsTrigger
                            key={val}
                            value={val}
                            onClick={() => onSelect(day)}
                            className={"flex-1 text-center"}
                        >
                            <span className="inline md:hidden">
                            {format(day, "do ", {locale: ko})}
                            </span>

                            {/* 중간 화면 (md ≤ width < lg)에서는 ‘do(EEE)’ */}
                            <span className="hidden md:inline lg:hidden">
                            {format(day, "do", {locale: ko})}
                            {format(day, "(EEE)", {locale: ko})}
                            </span>

                            {/* 큰 화면 (≥ lg)에서는 ‘MMM do (EEE)’ */}
                            <span className="hidden lg:inline">
                            {format(day, "MMM do", {locale: ko})} ({format(day, "EEE", {locale: ko})})
                            </span>
                        </TabsTrigger>
                    );
                })}
            </TabsList>
        </Tabs>
    );
}
