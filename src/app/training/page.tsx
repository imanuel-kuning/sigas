'use client'

import { index } from '@/actions/training'
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

const columns: ColumnDef<Training>[] = [
  {
    accessorKey: 'text',
    header: 'Text',
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
            <Link href={`/training/detail/${id}`}>
              <DropdownMenuItem>Detail</DropdownMenuItem>
            </Link>
            <Link href={`/training/edit/${id}`}>
              <DropdownMenuItem>Edit</DropdownMenuItem>
            </Link>
            <Link href={`/training/delete/${id}`}>
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
  const [data, setData] = useState<Training[]>([])
  const [isPending, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      setData(await index())
    })
  }, [watch])

  return (
    <AppCard title="Data Training">
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
