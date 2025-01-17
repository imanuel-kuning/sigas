import AppCard from '@/components/app-card'
import { Button } from '@/components/ui/button'
import { PlusCircle, PlusSquare } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <AppCard title="Actions">
      <div className="grid gap-2">
        <Link href="/testing/add">
          <Button variant="outline" size="sm" className="w-full">
            <PlusCircle />
            Add
          </Button>
        </Link>
        <Link href="/testing/upload">
          <Button variant="outline" size="sm" className="w-full">
            <PlusSquare />
            Upload
          </Button>
        </Link>
      </div>
    </AppCard>
  )
}
