'use client'

import { ChartBar, CircuitBoard, Combine, Database, Home, Map, Twitter } from 'lucide-react'

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import AppSidebarBadge from './app-sidebar-badge'
import { useLocation } from '@/hooks/use-location'

export function AppSidebar() {
  const pathName = usePathname()
  const { location } = useLocation()

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
      badge: location.province,
    },
    {
      title: 'Chart',
      url: '/chart',
      icon: ChartBar,
    },
  ]

  const dataset = [
    {
      title: 'Dataset',
      url: '/dataset',
      icon: Database,
      badge: 0,
    },
    {
      title: 'X Posts',
      url: '/posts',
      icon: Twitter,
      badge: 0,
    },
  ]

  const process = [
    {
      title: 'Model Evaluation',
      url: '/model',
      icon: CircuitBoard,
    },
    {
      title: 'Classification',
      url: '/classification',
      icon: Combine,
    },
  ]

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
                  {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
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
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild isActive={pathName.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <AppSidebarBadge url={item.url} num={item.badge} />
                </SidebarMenuItem>
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
