'use client'

import { index, update } from '@/actions/settings'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

const formSchema = z.object({
  vector_size: z.string().nonempty(),
  dataset_size: z.string().nonempty(),
  split_size: z.string().nonempty(),
})

export default function Page() {
  const router = useRouter()
  const [isPending, setTransition] = useTransition()
  const [data, setData] = useState<Settings>()
  const [id, setId] = useState<string>()

  useEffect(() => {
    setTransition(async () => {
      const result = await index()
      setId(result._id)
      setData(result)
    })
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vector_size: '',
      dataset_size: '',
      split_size: '',
    },
    values: {
      vector_size: data?.vector_size as string,
      dataset_size: data?.dataset_size as string,
      split_size: data?.split_size as string,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setTransition(async () => {
      const res = await update(id as string, values)
      toast.success(res.message)
      router.push('/model')
    })
  }

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Settings</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            {isPending ? (
              <>
                <div className="space-y-1">
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="w-20 h-6" />
                  <Skeleton className="w-full h-10" />
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
                  name="vector_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature Size</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataset_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dataset Size</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="split_size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Training Split Ratio</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" step="0.1" max={0.9} min={0.1} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <AlertDialogFooter>
              <Link href="/model">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
              </Link>
              <AlertDialogAction asChild>
                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending && <Loader2 className="animate-spin" />}
                  Save
                  <Save />
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
