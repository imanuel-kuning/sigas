'use client'

import { get } from '@/actions/training'
import AppCard from '@/components/app-card'
import { useEffect, useState, useTransition } from 'react'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const [data, setData] = useState<Training>()
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
      {isPending && 'Loading'}
      <h1>{data?.text}</h1>
    </AppCard>
  )
}
