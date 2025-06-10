
import {
    Sidebar,
    SidebarContent,
    SidebarGroup, SidebarGroupContent, SidebarHeader,
    SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar"
import {ModeToggle} from "@/components/mode-toggle";
import Link from "next/link";

export function AppSidebar({items = []}:{items: {title: string, url: string, icon: React.FC}[]}) {
    return (
        <Sidebar>
            <SidebarHeader className="flex items-center justify-center h-16 text-3xl font-bold text-foreground">
                <Link href="/" passHref style={{textDecoration: "none"}}>
                    Earnings Alarm
                </Link>
            </SidebarHeader>
            <SidebarContent >
                <SidebarGroup className="flex grow gap-2">
                    <SidebarGroupContent>
                        <SidebarMenu className="">
                            {items.map((item) => (
                                <SidebarMenuItem className="py-2" key={item.title}>
                                    <SidebarMenuButton asChild className="text-3xl [&_svg]:size-22">
                                        <Link href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup className="gap-4">
                    <ModeToggle/>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}