import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {HydrationBoundary, QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {useState} from "react";
import Layout from "@/components/layout";
import FcmTokenProvider from "@/contexts/fcm-context";
import {Toaster} from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
    // QueryClient를 한 번만 생성해야 하므로 useState 활용
    const [queryClient] = useState(() => new QueryClient())

    return(
        <QueryClientProvider client={queryClient}>
            <FcmTokenProvider>
                <HydrationBoundary>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                    <Toaster position="top-center" duration={2500}/>
                </HydrationBoundary>
            </FcmTokenProvider>
        </QueryClientProvider>
    )
}
