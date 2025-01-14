import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AppCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="rounded-sm overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
