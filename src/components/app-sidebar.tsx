'use client'

import { ChartBar, CircuitBoard, Combine, Database, Home, Map } from 'lucide-react'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import AppSidebarItem from './app-sidebar-item'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const dashboard = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Map',
    url: '/map',
    icon: Map,
  },
  {
    title: 'Chart',
    url: '/chart',
    icon: ChartBar,
  },
]

const dataset = [
  {
    title: 'Data Training',
    url: '/training',
    icon: Database,
    badge: 0,
  },
  {
    title: 'Data Testing',
    url: '/testing',
    icon: Database,
    badge: 0,
  },
]

const process = [
  {
    title: 'Model',
    url: '/model',
    icon: CircuitBoard,
  },
  {
    title: 'Predict',
    url: '/predict',
    icon: Combine,
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

        <SidebarGroup>
          <SidebarGroupLabel>Process</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {process.map((item) => (
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
      </SidebarContent>
    </Sidebar>
  )
}
