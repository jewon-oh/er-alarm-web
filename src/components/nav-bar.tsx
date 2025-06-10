import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {SidebarTrigger} from "@/components/ui/sidebar";
import * as React from "react";

export default function NavBar() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex flex-1 flex-row">
                <NavigationMenuItem>
                    <SidebarTrigger className="m-2 h-12 w-12 [&_svg]:size-12 "/>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}