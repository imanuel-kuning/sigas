import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function Layout({ children, map, posts, chart }: { children: React.ReactNode; map: React.ReactNode; posts: React.ReactNode; chart: React.ReactNode }) {
  return (
    <section className="p-2">
      <div className="grid grid-cols-1 gap-3">
        <div>{children} </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="md:col-span-3">
            <div className="grid gap-3">
              <div>{map}</div>
              <div>{chart}</div>
            </div>
          </div>
          <div className="md:col-span-2">{posts}</div>
        </div>
      </div>
    </section>
  )
}
