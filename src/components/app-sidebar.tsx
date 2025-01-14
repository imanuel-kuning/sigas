'use client'

import { Database, Home } from 'lucide-react'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import AppSidebarItem from './app-sidebar-item'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const dashboard = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
    badge: null,
  },
]

const dataset = [
  {
    title: 'Data Training',
    url: '/training',
    icon: Database,
    badge: null,
  },
  {
    title: 'Data Testing',
    url: '/testing',
    icon: Database,
    badge: null,
  },
]

export function AppSidebar() {
  const pathName = usePathname()
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <h1>APP</h1>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboard.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathName === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dataset</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dataset.map((item, index) => (
                <AppSidebarItem item={item} key={index} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
