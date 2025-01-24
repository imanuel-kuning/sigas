'use client'

import { useEffect, useState, useTransition } from 'react'
import { SidebarMenuBadge } from './ui/sidebar'
import { useRefresh } from '@/hooks/use-refresh'
import { count as countDataset } from '@/actions/dataset'
import { count as countTesting } from '@/actions/posts'
import { Loader2 } from 'lucide-react'

export default function AppSidebarBadge({ url, num }: { url: string; num: number }) {
  const [isPending, setTransition] = useTransition()
  const [countCurr, setCountCurr] = useState(num)
  const { watch } = useRefresh()

  useEffect(() => {
    setTransition(async () => {
      if (url.startsWith('/dataset')) {
        setCountCurr((await countDataset()) as number)
      }
      if (url.startsWith('/posts')) {
        setCountCurr((await countTesting()) as number)
      }
    })
  }, [watch])

  return <SidebarMenuBadge>{isPending ? <Loader2 className="animate-spin h-5 w-5" /> : <>{countCurr}</>}</SidebarMenuBadge>
}
