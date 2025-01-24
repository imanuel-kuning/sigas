'use client'

import { destroy } from '@/actions/dataset'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useRefresh } from '@/hooks/use-refresh'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { toast } from 'sonner'

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { refresh } = useRefresh()
  const router = useRouter()
  const [isPending, setTransition] = useTransition()
  function onSubmit() {
    setTransition(async () => {
      const id = (await params).id
      const res = await destroy(id)
      toast.success(res.message)
      router.push('/dataset')
      setTransition(refresh)
    })
  }
  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone. This will permanently delete data from server.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link href="/dataset">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
          </Link>
          <AlertDialogAction onClick={onSubmit} disabled={isPending}>
            {isPending && <Loader2 className="animate-spin" />}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
