import Image from "next/image";
import { getCountryCode } from "@/utils/country";

export function StockFlag({ countryName }: { countryName: string }) {
    const code = getCountryCode(countryName);
    if (!code) return null;

    return (
        <Image
            src={`https://flagcdn.com/w20/${code}.png`}
            width={20}
            height={15}
            alt={countryName}
        />
    );
}
