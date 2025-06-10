import {axiosInstance} from "@/constants/axios-instance";

import {DataTable} from "@/components/data-table";
import {columns} from "@/components/stocks/columns";
import {StockRow} from "@/types/stock-row";
import {Stock} from "@/types/stock";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import { useMemo, useState} from "react";
import {getCoreRowModel, PaginationState, useReactTable} from "@tanstack/react-table";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/router";
import {Page} from "@/types/page";
import {Table} from "@/types/table";
import {Card, CardContent} from "@/components/ui/card";

export default function StocksPage() {
    const router = useRouter();
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })
    const [inputSymbol, setInputSymbol] = useState<string>("");
    // const [searchParam, setSearchParam] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputSymbol(e.target.value);
        setPagination(prevState => ({
            pageIndex: 0,
            pageSize: prevState.pageSize
        }));
        // refetch();
    }

    const fetchStocks = async (searchParam: string | null = null, pageIndex: number = 0, pageSize: number = 10)
        : Promise<Page<Stock>> => {
        const res = await axiosInstance
            .get("/api/stocks/find", {
                params: {searchParam: searchParam, page: pageIndex, size: pageSize, sort: "symbol,asc"},
            })
        return res.data.data;
    }

    const convertToRow = (result: Page<Stock> = {
        content: [],
        page:{
            size:10,
            totalElements:0,
            totalPages:0,
            number:0
        }
    }): Table<StockRow> => {
        //  DTO 매핑
        const rows: StockRow[] = result?.content.map(
            (s: Stock, idx: number) => ({
                id: result.page.number * result.page.size + idx + 1,
                symbol: s.symbol,
                name: s.name,
            }))

        //  한 번에 반환
        return {
            rows,
            pageCount: result.page.totalPages,
            rowCount: result.page.totalElements,
        }
    }

    const {
        data: pageResp,
        isLoading,
        isFetching,
        error,
    } = useQuery({
        queryKey: ["stocks",
            inputSymbol,
            pagination.pageIndex,
            pagination.pageSize],
        queryFn: () => fetchStocks(inputSymbol, pagination.pageIndex, pagination.pageSize),
        staleTime: 15 * 60 * 1000,            // 15분간 신선 상태
        gcTime: 30 * 60 * 1000,         // 필요하면 추가
        placeholderData: keepPreviousData,
        initialData: undefined,
    });

    const tableData = useMemo(() => {
        // data가 아직 undefined 라면 초기값(convertToRow 초기 빈 페이지)을 쓰도록
        return convertToRow(pageResp);
    }, [pageResp]);


    // ▶️ 검색 버튼 눌렀을 때만 symbol 반영
    const onSearch = () => {
        // setSearchParam(input.trim())
        setInputSymbol(inputSymbol.trim())
        setPagination({pageIndex: 0, pageSize: 10})
    }

    const table = useReactTable({
        data: tableData?.rows,
        columns,
        // ① 외부 pagination 상태 연결
        state: {pagination},
        // v8.13.0 이후 rowCount 을 주면 자동으로 pageCount 계산해 줍니다.
        rowCount: tableData?.rowCount,
        manualPagination: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="py-4 pl-2 pr-3">
            <Card className="min-w-72">
                <CardContent className="space-y-4 py-4">
                    <DataTable table={table} isLoading={isLoading} isFetching={isFetching} onRowClick={(row) =>
                        router.push(
                            {
                                pathname: `/stocks/${row.original.symbol}`,
                                query: {
                                    inputSymbol: inputSymbol,
                                    pageIndex: pagination.pageIndex,
                                    pageSize: pagination.pageSize,
                                }
                            }, undefined,
                            {shallow: true}
                        )
                    }/>
                    <div className="flex h-12 items-center justify-between gap-2">
                        <Input className="h-12" type="text" about="symbol" onChange={handleInputChange}/>
                        <Button className="h-12 text-lg" onClick={onSearch}>검색</Button>
                        {/* 에러만 따로 처리 */}
                        {error && <div className="text-red-500">Error loading stocks</div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}