import {useRouter} from "next/router";
import {useState} from "react";
import {PaginationState} from "@tanstack/react-table";
import {useFcmToken} from "@/contexts/fcm-context";
import {keepPreviousData,  useQueries, useQueryClient, UseQueryResult} from "@tanstack/react-query";
import {fetchEarnings} from "@/components/earnings/fetchEarnings";
import {Page} from "@/types/page";
import {Earnings} from "@/types/earnings";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Stock} from "@/types/stock";
import {StockInfo} from "@/components/stocks/stock-info";
import {EarningsCard} from "@/components/earnings/earnings-card";
import {LoadingOverlay} from "@/components/loading-overlay";
import {fetchStock} from "@/components/stocks/fetchStock";

export default function StockDetailPage() {
    const router = useRouter();
    const {
        symbol: rawSymbol,
        inputSymbol: rawInput,
        pageIndex: rawPage,
        pageSize:  rawSize,
    } = router.query;

    const {fcmToken} = useFcmToken()

    // null/undefined 혹은 배열일 경우 첫 번째 요소, 없으면 빈 문자열
    const symbol = Array.isArray(rawSymbol)
        ? rawSymbol[0]
        : rawSymbol ?? '';

    const inputSymbol = Array.isArray(rawInput)
        ? rawInput[0]
        : rawInput ?? '';

    const pageIndex = Array.isArray(rawPage)
        ? parseInt(rawPage[0], 10)
        : rawPage
            ? parseInt(rawPage, 10)
            : 0;

    const pageSize = Array.isArray(rawSize)
        ? parseInt(rawSize[0], 10)
        : rawSize
            ? parseInt(rawSize, 10)
            : 10;

    const [pagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })


    const qc = useQueryClient()
    const allStocks = qc.getQueryData<Page<Stock>>(["stocks",inputSymbol,pageIndex,pageSize]);
    const cached = allStocks?.content.find(s => s.symbol === symbol);

    // --- useQuery: 함수 레퍼런스는 절대 키에 포함 NO! ---
    const queries = [
        {
            queryKey: ["earnings", symbol, pagination.pageIndex, pagination.pageSize, fcmToken],
            queryFn: () => fetchEarnings(symbol, pagination.pageIndex, pagination.pageSize, fcmToken),
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            placeholderData: keepPreviousData,
            enabled: Boolean(symbol),
        }, {
            queryKey: ["stock", symbol],
            queryFn: () => fetchStock(symbol),
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            placeholderData: keepPreviousData,
            enabled: Boolean(symbol) && cached === undefined,
        }
    ]

    const results= useQueries({
        queries:queries
    });

    const earningsQuery = results[0] as UseQueryResult<Page<Earnings>, Error>;
    const stockQuery = results[1] as UseQueryResult<Stock, Error>;

    // stockQuery.data is Stock | undefined
    // 뒤에 !는 절대 undefined 일 리 없다고 알려주는 것
    const stock:Stock = cached ?? stockQuery.data!;

    return (
        <div className="py-4 pl-2 pr-3">
            {earningsQuery.error && <div className="text-red-500">Error loading earnings</div>}
            <Card className="min-w-72 ">
                <CardHeader>
                    <StockInfo symbol={symbol} stock={stock} />
                </CardHeader>
                <CardContent className="space-y-4">
                    {earningsQuery.data?.content.map((v) => (
                        <EarningsCard key={`ec-${v.id}`} earnings={v} config={{showDate: true, showSymbol: false, showActual: true, showEstimate: true, showSubscribeButton: true}}/>
                    ))}
                </CardContent>
            </Card>
            {/* 로딩/업데이트 오버레이 */}
            <LoadingOverlay isLoading={earningsQuery.isLoading} isFetching={earningsQuery.isFetching}/>
        </div>
    )
}