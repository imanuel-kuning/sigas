'use client'

import { classify, index, postsByLocation } from '@/actions/classification'
import AppCard from '@/components/app-card'
import { AppTable } from '@/components/app-table'
import { AppDatatableSorting } from '@/components/app-table-sort'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useRefresh } from '@/hooks/use-refresh'
import { getProvince } from '@/lib/utils'
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
  const [location, setLocation] = useState<string>()

  useEffect(() => {
    setTransition(async () => {
      if (location) {
        const result = await postsByLocation(location)
        setPosts(result)
      } else {
        const result = await index()
        setPosts(result.post)
        setFeatures(result.feat)
      }
    })
  }, [watch, location])

  function handleClick() {
    setTransition(async () => {
      const res = await classify(posts, features)
      toast.success(res)
      setTransition(refresh)
    })
  }

  function handleChange(value: string) {
    setLocation(value)
  }

  return (
    <>
      <AppCard title="Classification">
        <div className="flex gap-3">
          <div className="w-1/3">
            <Select onValueChange={handleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {getProvince().map(({ code, province }) => (
                  <SelectItem key={code} value={province.toLowerCase().replace(' ', '-')}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Button variant="outline" onClick={handleClick} disabled={isPending}>
              Classify
            </Button>
          </div>
        </div>
      </AppCard>
      <div className="grid gap-3 mt-3">
        <div>
          <AppCard title="Posts">{isPending ? <Skeleton className="h-[500px]" /> : <AppTable columns={columnsT} data={posts} />}</AppCard>
        </div>
        <div>
          <AppCard title="Dataset Features">{isPending ? <Skeleton className="h-[500px]" /> : <AppTable columns={columnsV} data={features} />}</AppCard>
        </div>
      </div>
    </>
  )
}
