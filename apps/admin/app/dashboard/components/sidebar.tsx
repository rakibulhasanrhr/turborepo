import * as React from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import {
    RiScanLine,
    RiBardLine,
    RiUserFollowLine,
    RiCodeSSlashLine,
    RiLoginCircleLine,
    RiLayoutLeftLine,
    RiSettings3Line,
    RiLeafLine,
    RiLogoutBoxLine,
} from "@remixicon/react";


const data = {
    teams: [
        {
            name: "InnovaCraft",
            logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345507/logo-01_kp2j8x.png",
        },
        {
            name: "Acme Corp.",
            logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345507/logo-01_kp2j8x.png",
        },
        {
            name: "Evil Corp.",
            logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345507/logo-01_kp2j8x.png",
        },
    ],
    navMain: [
        {
            title: "Sections",
            url: "#",
            items: [
                {
                    title: "Dashboard",
                    url: "/",
                    icon: RiScanLine,
                },
                {
                    title: "Insights",
                    url: "insights",
                    icon: RiBardLine,
                },
                {
                    title: "Contacts",
                    url: "contact",
                    icon: RiUserFollowLine,
                },
                {
                    title: "Tools",
                    url: "tool",
                    icon: RiCodeSSlashLine,
                },
                {
                    title: "Integration",
                    url: "#",
                    icon: RiLoginCircleLine,
                },
                {
                    title: "Layouts",
                    url: "#",
                    icon: RiLayoutLeftLine,
                },
                {
                    title: "Reports",
                    url: "#",
                    icon: RiLeafLine,
                },
            ],
        },
        {
            title: "Other",
            url: "#",
            items: [
                {
                    title: "Settings",
                    url: "#",
                    icon: RiSettings3Line,
                },
                {
                    title: "Help Center",
                    url: "#",
                    icon: RiLeafLine,
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>

            <SidebarContent>
                {data.navMain.map((item) => (
                    <SidebarGroup key={item.title}>
                        <SidebarGroupLabel className="uppercase text-muted-foreground/60">
                            {item.title}
                        </SidebarGroupLabel>
                        <SidebarGroupContent className="px-2">
                            <SidebarMenu>
                                {item.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className="group/menu-button font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto"
                                        >
                                            <a href={item.url}>
                                                {item.icon && (
                                                    <item.icon
                                                        className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                                                        size={22}
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <hr className="border-t border-border mx-2 -mt-px" />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="font-medium gap-3 h-9 rounded-md bg-gradient-to-r hover:bg-transparent hover:from-sidebar-accent hover:to-sidebar-accent/40 data-[active=true]:from-primary/20 data-[active=true]:to-primary/5 [&>svg]:size-auto">
                            <RiLogoutBoxLine
                                className="text-muted-foreground/60 group-data-[active=true]/menu-button:text-primary"
                                size={22}
                                aria-hidden="true"
                            />
                            <span>Sign Out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
