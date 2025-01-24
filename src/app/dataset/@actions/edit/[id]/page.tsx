'use client'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useRefresh } from '@/hooks/use-refresh'
import { Loader2, Save } from 'lucide-react'
import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import AppCard from '@/components/app-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { get, update } from '@/actions/dataset'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  text: z.string().nonempty(),
  sentiment: z.string().nonempty(),
})

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { refresh } = useRefresh()
  const router = useRouter()
  const [data, setData] = useState<Dataset>()
  const [isPending, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      const id = (await params).id
      const res = await get(id)
      setData(res)
    })
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      sentiment: '',
    },
    values: {
      text: data?.text as string,
      sentiment: data?.sentiment as string,
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    setTransition(async () => {
      const res = await update(data?._id as string, values)
      toast.success(res.message)
      router.push('/dataset')
      setTransition(refresh)
    })
  }

  return (
    <AppCard title="Edit Data">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          {isPending ? (
            <>
              <div className="space-y-1">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-full h-32" />
              </div>
              <div className="space-y-1">
                <Skeleton className="w-20 h-6" />
                <Skeleton className="w-full h-10" />
              </div>
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Full Text" className="resize-none" rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sentiment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sentiment</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="positive">Positive</SelectItem>
                          <SelectItem value="negative">Negative</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" variant="outline" size="sm" disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Save
            <Save />
          </Button>
        </form>
      </Form>
    </AppCard>
  )
}
