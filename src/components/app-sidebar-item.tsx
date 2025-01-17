'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { useEffect, useTransition } from 'react'
import { count as countTraining } from '@/actions/training'
import { count as countTesting } from '@/actions/testing'
import { Loader2 } from 'lucide-react'
import { useRefresh } from '@/hooks/use-refresh'

export default function AppSidebarItem({ item }: { item: Sidebar }) {
  const { watch } = useRefresh()
  const pathName = usePathname()
  const [isPending, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      const training = await countTraining()
      const testing = await countTesting()
      item.badge = 0
      if (item.url === '/training' && training) {
        item.badge = training
      }
      if (item.url === '/testing' && testing) {
        item.badge = testing
      }
    })
  }, [watch])

  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild isActive={pathName.startsWith(item.url)}>
        <Link href={item.url}>
          <item.icon />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuBadge>{isPending && pathName.startsWith(item.url) ? <Loader2 size={15} className="animate-spin" /> : item.badge}</SidebarMenuBadge>
    </SidebarMenuItem>
  )
}
