'use client'

import { get } from '@/actions/testing'
import AppCard from '@/components/app-card'
import { Skeleton } from '@/components/ui/skeleton'
import { useEffect, useState, useTransition } from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<Testing>()
  const [isPending, setTransition] = useTransition()
  useEffect(() => {
    setTransition(async () => {
      const id = (await params).id
      const res = await get(id)
      setData(res)
    })
  }, [])
  return (
    <AppCard title="Detail Data">
      {isPending ? (
        <div className="space-y-5">
          <div className="space-y-1">
            <Skeleton className="w-10 h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </div>
          <div className="space-y-1">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-full h-6" />
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <h1>Text</h1>
            <p>{data?.text}</p>
          </div>
          <div>
            <h1>Location</h1>
            <p>{data?.location}</p>
          </div>
          <div>
            <h1>Date</h1>
            <p>{data?.date}</p>
          </div>
          <div>
            <h1>Sentiment</h1>
            <p>{data?.sentiment}</p>
          </div>
        </div>
      )}
    </AppCard>
  )
}
