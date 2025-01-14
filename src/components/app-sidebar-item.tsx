'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'
import { SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { useEffect, useTransition } from 'react'
import { count as countTraining } from '@/actions/training'
import { Loader2 } from 'lucide-react'
import { useRefresh } from '@/hooks/use-refresh'

export default function AppSidebarItem({ item }: { item: Sidebar }) {
  const { watch } = useRefresh()
  const pathName = usePathname()
  const [isPending, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      const training = await countTraining()
      item.badge = item.url === '/training' && training ? training : null
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
