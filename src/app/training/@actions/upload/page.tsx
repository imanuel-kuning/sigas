'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRefresh } from '@/hooks/use-refresh'
import { Loader2, Save } from 'lucide-react'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import AppCard from '@/components/app-card'
import { storeMany } from '@/actions/training'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import csv from 'csvtojson'

const formSchema = z.object({
  file: z.any(),
})

export default function Page() {
  const { refresh } = useRefresh()
  const [isPending, setTransition] = useTransition()
  const [data, setData] = useState<TrainingData[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: '',
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setTransition(async () => {
        await storeMany(data)
        toast.success(`Successfully upload data from file ${values.file}`)
        setTransition(refresh)
      })
    } catch (error) {
      console.log(error)
    }
  }

  // eslint-disable-next-line
  function handleChange(event: any) {
    const file = event.target.files[0]
    const reader = new FileReader()

    // eslint-disable-next-line
    reader.onload = (e: any) => {
      const text = e.target.result
      setTransition(async () => {
        const json = await csv({ delimiter: ',', headers: ['text', 'sentiment'] }).fromString(text)
        setData(json)
      })
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-4">
      <AppCard title="Upload Bulk Data ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} onChangeCapture={handleChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" variant="outline" size="sm" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Save
              <Save />
            </Button>
          </form>
        </Form>
      </AppCard>
      {data.length > 0 && (
        <AppCard title="Preview">
          <div className="max-w-prose">
            <pre className="overflow-auto">
              <code>{JSON.stringify(data.splice(0, 3), null, 2)}</code>
              ... {data.length - 3} more data
            </pre>
          </div>
        </AppCard>
      )}
    </div>
  )
}
