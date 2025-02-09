'use client'

import { index } from '@/actions/map'
import AppCard from '@/components/app-card'
import { Skeleton } from '@/components/ui/skeleton'
import { groupLocationSentiment } from '@/lib/utils'
import dynamic from 'next/dynamic'
import { useEffect, useMemo, useState, useTransition } from 'react'

export default function Page() {
  const [isPending, setTransition] = useTransition()
  const [posts, setPosts] = useState<GroupedResult[]>([])

  const LazyMap = useMemo(
    () =>
      dynamic(() => import('@/components/app-map'), {
        ssr: false,
        loading: () => <Skeleton className="h-96" />,
      }),
    []
  )

  useEffect(() => {
    setTransition(async () => {
      const res = await index()
      setPosts(groupLocationSentiment(res))
    })
  }, [])

  return (
    <AppCard title="Choropleth Map">
      {isPending && 'Loading...'}
      <LazyMap data={posts} width="auto" height="50vh" center={[-2.5, 120]} zoom={5} />
    </AppCard>
  )
}
