'use client'

export const maxDuration = 60

import { analysis, index, store, vectorizer } from '@/actions/model'
import AppCard from '@/components/app-card'
import { AppTable } from '@/components/app-table'
import { AppDatatableSorting } from '@/components/app-table-sort'
import { Skeleton } from '@/components/ui/skeleton'
import { ColumnDef } from '@tanstack/react-table'
import { useState, useTransition } from 'react'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RefreshCcw, Save, Settings } from 'lucide-react'
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
  const [data, setData] = useState<PreprocessingData[]>([])
  const [vectors, setVectors] = useState<Vector[]>([])
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
    <section>
      <div className="mb-3">
        <AppCard title="Model Evaluation">
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

          {isPending ? (
            <Skeleton className="h-[100px]" />
          ) : (
            <div>
              <h1>{`Accuracy : ${result?.accuracy}`}</h1>
            </div>
          )}
        </AppCard>
      </div>

      <ResizablePanelGroup direction="horizontal" className="space-x-2">
        <ResizablePanel defaultSize={65}>
          <AppCard title="Text Preprocessing">{isPending ? <Skeleton className="h-[100px]" /> : <AppTable columns={columnsTP} data={data} />}</AppCard>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel>
          <AppCard title="Features Extraction">{isPending ? <Skeleton className="h-[100px]" /> : <AppTable columns={columnsV} data={vectors} />}</AppCard>
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  )
}
