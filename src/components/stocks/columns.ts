import { ColumnDef } from "@tanstack/react-table"
import {StockRow} from "@/types/stock-row";

export const columns: ColumnDef<StockRow>[] = [
    {
        accessorKey: "symbol",
        header: "티커",
        cell: ({ row }) => {return row.original.symbol},
    },
    {
        accessorKey: "name",
        header: "이름",
    }
]
