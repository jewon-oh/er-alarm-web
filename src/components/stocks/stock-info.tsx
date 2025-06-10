import {Card, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {StockFlag} from "@/components/stocks/stock-flag";
import {Badge} from "@/components/ui/badge";
import {Stock} from "@/types/stock";
import {cn} from "@/lib/utils";
import React from "react";

export interface StockInfoProps extends React.ComponentPropsWithoutRef<typeof Card> {
    symbol: string;
    stock: Stock
}

export const StockInfo = React.forwardRef<HTMLDivElement, StockInfoProps>(
    ({symbol, stock, className, ...props}, ref) => {
        return (
            <Card
                className={cn("min-w-72", className)}
                {...props}
                ref={ref}
            >
                <CardHeader>
                    <CardTitle className="text-5xl">{symbol}</CardTitle>
                    <CardDescription className="flex items-center gap-2 overflow-hidden">
                        {stock?.name}
                        {/* 2) 플래그는 flex-shrink-0으로 고정 */}
                        {stock?.country && (
                            <div className="flex-shrink-0">
                                <StockFlag countryName={stock.country}/>
                            </div>
                        )}
                    </CardDescription>
                    <CardDescription className="flex flex-wrap items-center gap-2">
                        {stock?.sector && (
                            <Badge
                                className="bg-secondary text-xl text-secondary-foreground select-none hover:bg-secondary">{stock.sector}</Badge>
                        )}
                        {stock?.industry && (
                            <Badge
                                className="bg-secondary text-xl text-secondary-foreground select-none hover:bg-secondary">{stock.industry}</Badge>
                        )}
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    })

StockInfo.displayName = "StockInfo";