'use client'

import { index } from '@/actions/posts'
import AppCard from '@/components/app-card'
import { AppTable } from '@/components/app-table'
import { AppDatatableSorting } from '@/components/app-table-sort'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { useRefresh } from '@/hooks/use-refresh'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'

const columns: ColumnDef<Posts>[] = [
  {
    accessorKey: 'text',
    header: 'Text',
  },
  {
    accessorKey: 'location',
    header: ({ column }) => <AppDatatableSorting column={column} title="Location" />,
  },
  {
    accessorKey: 'date',
    sortingFn: 'datetime',
    header: ({ column }) => <AppDatatableSorting column={column} title="Date" />,
    cell: ({ row }) => new Date(row.original.date).toLocaleString('en-us'),
  },
  {
    accessorKey: 'sentiment',
    header: ({ column }) => <AppDatatableSorting column={column} title="Sentiment" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original._id
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal size={15} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/posts/detail/${id}`}>
              <DropdownMenuItem>Detail</DropdownMenuItem>
            </Link>
            <Link href={`/posts/edit/${id}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <Link href={`/posts/delete/${id}`}>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function Page() {
  const { watch } = useRefresh()
  const [data, setData] = useState<Posts[]>([])
  const [isPending, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      setData(await index())
    })
  }, [watch])

  return (
    <AppCard title="X Posts">
      {isPending ? (
        <Skeleton className="w-full h-[350px] p-2 space-y-2">
          <Skeleton className="w-1/3 h-[35px]" />
          <Skeleton className="w-full h-[40px]" />
          <Skeleton className="w-full h-[33px]" />
          <Skeleton className="w-full h-[33px]" />
          <Skeleton className="w-full h-[33px]" />
          <Skeleton className="w-full h-[33px]" />
          <Skeleton className="w-full h-[33px]" />
          <Skeleton className="w-full h-[40px]" />
        </Skeleton>
      ) : (
        <AppTable columns={columns} data={data} />
      )}
    </AppCard>
  )
}
