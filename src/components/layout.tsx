import {ReactNode} from "react";
import {Calendar,  Inbox, Settings} from "lucide-react"
import {SidebarProvider} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/ui/app-sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {useRouter} from "next/router";
import {ThemeProvider} from "@/components/theme-provider";
import Link from "next/link";
import NavBar from "@/components/nav-bar";

// Menu items.
const items = [
    {title: "주식", url: "/stocks", icon: Inbox},
    {title: "실적", url: "/earnings-calendar", icon: Calendar},
    {title: "설정", url: "/settings", icon: Settings}
]

export default function Layout({children}: { children: ReactNode }) {
    const router = useRouter();
    const fullPath = router.asPath;
    const pathList: string[] = fullPath.split("/").filter(value => value !== "");
    console.log(pathList)
    // 배열에 Breadcrumb 요소들 채우기
    const crumbs: ReactNode[] = []

    // 홈
    if (pathList.length === 0) {
        crumbs.push(
            <BreadcrumbItem key="home">
                <BreadcrumbPage>홈</BreadcrumbPage>
            </BreadcrumbItem>
        )
    }else{
        crumbs.push(
            <BreadcrumbItem key="home">
                <BreadcrumbLink href="/">홈</BreadcrumbLink>
            </BreadcrumbItem>
        )
        // 중간/마지막 세그먼트
        for (let i = 0; i < pathList.length - 1; i++) {
            const segment = pathList[i]

            crumbs.push(<BreadcrumbSeparator key={`sep-${i}`}/>)

            // 그 외는 링크
            const href = '/' + pathList.slice(0, i + 1).join('/')
            crumbs.push(
                <BreadcrumbItem key={`link-${i}`}>
                    <BreadcrumbLink asChild>
                        <Link href={href}>{segment}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            )
        }

        const lastSegment = pathList.slice(-1)[0].split('?').at(0)
        crumbs.push(<BreadcrumbSeparator key={`sep-${pathList.length}`}/>)
        crumbs.push(
            <BreadcrumbItem key={`page-${pathList.length}`}>
                <BreadcrumbPage>{lastSegment}</BreadcrumbPage>
            </BreadcrumbItem>
        )
    }

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider >
                <AppSidebar items={items}/>
                {/*화면 비율에 따라 유연하게 늘어나거나 줄어들 수 있음을 만드는 속성이다.*/}
                <main>
                    <NavBar/>
                    <Breadcrumb className="pl-4">
                        <BreadcrumbList>
                            {crumbs}
                        </BreadcrumbList>
                    </Breadcrumb>
                    {children}
                </main>
            </SidebarProvider>
        </ThemeProvider>
    )
}