'use client'

import { classify, index } from '@/actions/classification'
import AppCard from '@/components/app-card'
import { AppTable } from '@/components/app-table'
import { AppDatatableSorting } from '@/components/app-table-sort'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useRefresh } from '@/hooks/use-refresh'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

const columnsT: ColumnDef<Posts>[] = [
  {
    accessorKey: 'text',
    header: 'Text',
  },
  {
    accessorKey: 'location',
    header: 'Location',
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'sentiment',
    header: 'Sentiment',
  },
]

const columnsV: ColumnDef<{ feature: number[]; label: number }>[] = [
  {
    accessorKey: 'feature',
    header: 'Feature',
    cell: ({ row }) => (
      <pre>
        <code>{JSON.stringify(row.original.feature, null, 2)}</code>
      </pre>
    ),
  },
  {
    accessorKey: 'label',
    header: ({ column }) => <AppDatatableSorting column={column} title="Label" />,
  },
]

export default function Page() {
  const { watch, refresh } = useRefresh()
  const [isPending, setTransition] = useTransition()
  const [posts, setPosts] = useState<Posts[]>([])
  const [features, setFeatures] = useState<Features[]>([])

  useEffect(() => {
    setTransition(async () => {
      const result = await index()
      setPosts(result.post)
      setFeatures(result.feat)
    })
  }, [watch])

  function handleClick() {
    setTransition(async () => {
      const res = await classify(posts, features)
      toast.success(res)
      setTransition(refresh)
    })
  }

  return (
    <>
      <AppCard title="Classification">
        <Button size="sm" variant="outline" onClick={handleClick}>
          Classify
        </Button>
      </AppCard>
      <div className="flex gap-3 mt-3">
        <div className="w-4/6">
          <AppCard title="Posts">{isPending ? <Skeleton className="h-[500px]" /> : <AppTable columns={columnsT} data={posts} />}</AppCard>
        </div>
        <div className="w-2/6">
          <AppCard title="Features">{isPending ? <Skeleton className="h-[500px]" /> : <AppTable columns={columnsV} data={features} />}</AppCard>
        </div>
      </div>
    </>
  )
}
