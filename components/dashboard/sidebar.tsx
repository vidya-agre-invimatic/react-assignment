"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Layers, Images, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      title: "Home",
      icon: Home,
      href: "/dashboard",
      isActive: pathname === "/dashboard",
    },
    {
      title: "Drag and Drop",
      icon: Layers,
      href: "/dashboard/drag-drop",
      isActive: pathname === "/dashboard/drag-drop",
    },
    {
      title: "Infinite Scroll",
      icon: Images,
      href: "/dashboard/infinite-scroll",
      isActive: pathname === "/dashboard/infinite-scroll",
    },
  ]

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">Second Brain</h2>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild isActive={route.isActive}>
                  <Link href={route.href}>
                    <route.icon />
                    <span>{route.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
