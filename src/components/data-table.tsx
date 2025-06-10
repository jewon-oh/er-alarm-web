import {flexRender, Row, useReactTable} from "@tanstack/react-table"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button";
import {ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {MouseEvent} from "react";

export function DataTable<TData>({table, isLoading, isFetching, onRowClick}: {
    table: ReturnType<typeof useReactTable<TData>>;
    isLoading: boolean;
    isFetching: boolean;
    onRowClick?: (row: Row<TData>, event: MouseEvent) => void
}) {

    const headerGroups = table.getHeaderGroups()
    // const colCount = headerGroups[0]?.headers.length ?? 0

    return (
        <div className="flex flex-col h-full min-h-[500px] rounded-md min-w-[300px] px-2">
            {/* 1. 상대 위치 지정 & flex-1 + overflow-auto */}
            <div
                className="relative flex-1 overflow-auto transition duration-300"
                style={{ scrollbarGutter: "stable" }}
            >
                <Table className="w-full table-fixed text-xl">
                    <TableHeader>
                        {headerGroups.map((hg) => (
                            <TableRow key={hg.id}>
                                {hg.headers.map((h, index) => (
                                    <TableHead
                                        key={h.id}
                                        scope="col"
                                        className={index === 0 ? "w-[100px]" : undefined}
                                    >
                                        {!h.isPlaceholder &&
                                            flexRender(h.column.columnDef.header, h.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                onClick={(e) => onRowClick?.(row, e)}

                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* 2. 빈 상태 메시지: absolute + inset-0 */}
                {table.getRowModel().rows.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        No results.
                    </div>
                )}
            </div>

            {/* 3. 페이징 영역: space-x 로 간격 통일 */}
            <div className="flex w-full items-center justify-between p-4 space-x-4">
                <div className="flex items-center space-x-2">
                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                        항목 수
                    </Label>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(v) => table.setPageSize(Number(v))}
                    >
                        <SelectTrigger className="w-20 h-12" id="rows-per-page">
                            <SelectValue placeholder={table.getState().pagination.pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm font-medium">
                    {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                </div>

                <div className="ml-auto flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon />
                    </Button>
                </div>
            </div>
        </div>
    );
}