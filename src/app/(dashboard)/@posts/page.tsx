'use client'

import { index } from '@/actions/posts'
import AppCard from '@/components/app-card'
import { AppTable } from '@/components/app-table'
import { AppDatatableSorting } from '@/components/app-table-sort'
import { Skeleton } from '@/components/ui/skeleton'
import { useLocation } from '@/hooks/use-location'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState, useTransition } from 'react'

const columns: ColumnDef<Posts>[] = [
  {
    accessorKey: 'text',
    header: 'Text',
  },
  {
    accessorKey: 'sentiment',
    header: ({ column }) => <AppDatatableSorting column={column} title="Sentiment" />,
  },
  {
    accessorKey: 'date',
    sortingFn: 'datetime',
    header: ({ column }) => <AppDatatableSorting column={column} title="Date" />,
    cell: ({ row }) => new Date(row.original.date).toLocaleString('en-us'),
  },
]

export default function Page() {
  const { location } = useLocation()
  const [isPending, setTransition] = useTransition()
  const [data, setData] = useState<Posts[]>([])

  useEffect(() => {
    setTransition(async () => {
      const res = await index()
      setData(res.filter((post: Posts) => post.location === location.province))
    })
  }, [location])

  return <AppCard title="Data">{isPending ? <Skeleton className="h-svh" /> : <AppTable columns={columns} data={data} />}</AppCard>
}
