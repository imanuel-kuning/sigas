'use client'

export const maxDuration = 60

import { analysis, index, store, vectorizer } from '@/actions/model'
import AppCard from '@/components/app-card'
import { AppTable } from '@/components/app-table'
import { AppDatatableSorting } from '@/components/app-table-sort'
import { Skeleton } from '@/components/ui/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import { useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Loader2, RefreshCcw, Save, Settings } from 'lucide-react'
import { toast } from 'sonner'

const columnsTP: ColumnDef<PreprocessingData>[] = [
  {
    accessorKey: 'text',
    header: 'Text',
  },
  {
    accessorKey: 'clean',
    header: 'Clean',
  },
  {
    accessorKey: 'stem',
    header: 'Stem',
  },
  {
    accessorKey: 'stopword',
    header: 'Stopword',
  },
  {
    accessorKey: 'sentiment',
    header: 'Sentiment',
  },
]

const columnsV: ColumnDef<Features>[] = [
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
  const [data, setData] = useState<PreprocessingData[]>([])
  const [vectors, setVectors] = useState<Features[]>([])
  const [result, setResult] = useState<{ accuracy: number }>({ accuracy: 0 })
  const [isPending, setTransition] = useTransition()

  function handleGenerate() {
    setTransition(async () => {
      const resultIndex = await index()
      setData(resultIndex)
      const resultVectorizer = await vectorizer(resultIndex)
      setVectors(resultVectorizer)
      const resultAnalysis = await analysis(resultVectorizer)
      setResult(resultAnalysis)
    })
  }

  function handleSave() {
    setTransition(async () => {
      const res = await store(vectors)
      toast.success(res.message)
    })
  }

  return (
    <section className="space-y-3 grid grid-cols-1">
      <div>
        <AppCard title="Model Evaluation">
          <div className="flex justify-between">
            <div className="mb-3 flex gap-3">
              <Link href="/model/settings">
                <Button variant="outline" size="sm">
                  <Settings />
                  Settings
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isPending}>
                <RefreshCcw />
                Generate Features
              </Button>
              <Button variant="outline" size="sm" onClick={handleSave} disabled={vectors.length < 1 || isPending}>
                <Save />
                Save Features
              </Button>
            </div>

            <div className="flex flex-col items-center">
              {isPending ? <Loader2 className="animate-spin" size={40} /> : <h1 className="text-4xl">{`${result?.accuracy * 100}%`}</h1>}
              <h1>Accuracy</h1>
            </div>
          </div>
        </AppCard>
      </div>

      <div>
        <AppCard title="Text Preprocessing">{isPending ? <Skeleton className="h-[100px]" /> : <AppTable columns={columnsTP} data={data} />}</AppCard>
      </div>
      <div>
        <AppCard title="Features Extraction">{isPending ? <Skeleton className="h-[100px]" /> : <AppTable columns={columnsV} data={vectors} />}</AppCard>
      </div>
    </section>
  )
}
