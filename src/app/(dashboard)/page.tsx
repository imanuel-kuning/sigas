'use client'

import { sentimentCount as posts } from '@/actions/posts'
import { sentimentCount as dataset } from '@/actions/dataset'
import AppCard from '@/components/app-card'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [isPending, setTransition] = useTransition()
  const [postsCount, setPostsCount] = useState({ positive: 0, negative: 0 })
  const [datasetCount, setDatasetCount] = useState({ positive: 0, negative: 0 })

  useEffect(() => {
    setTransition(async () => {
      setPostsCount((await posts()) as { positive: number; negative: number })
      setDatasetCount((await dataset()) as { positive: number; negative: number })
    })
  }, [])

  return (
    <div className="grid md:grid-cols-3 gap-3">
      <div>
        <AppCard title="Dashboard">
          <h1>Dashboard</h1>
        </AppCard>
      </div>
      <div>
        <Link href="/dataset">
          <AppCard title="Dataset">
            <div className="flex justify-around ">
              <div className="flex flex-col items-center">
                {isPending ? <Loader2 className="animate-spin" /> : <h1 className="text-xl">{datasetCount.positive}</h1>}
                <h1>Positive</h1>
              </div>
              <Separator orientation="vertical" />
              <div className="flex flex-col items-center">
                {isPending ? <Loader2 className="animate-spin" /> : <h1 className="text-xl">{datasetCount.negative}</h1>}
                <h1>Negative</h1>
              </div>
            </div>
          </AppCard>
        </Link>
      </div>
      <div>
        <Link href="/posts">
          <AppCard title="X Posts">
            <div className="flex justify-around ">
              <div className="flex flex-col items-center">
                {isPending ? <Loader2 className="animate-spin" /> : <h1 className="text-xl">{postsCount.positive}</h1>}
                <h1>Positive</h1>
              </div>
              <Separator orientation="vertical" />
              <div className="flex flex-col items-center">
                {isPending ? <Loader2 className="animate-spin" /> : <h1 className="text-xl">{postsCount.negative}</h1>}
                <h1>Negative</h1>
              </div>
            </div>
          </AppCard>
        </Link>
      </div>
    </div>
  )
}
