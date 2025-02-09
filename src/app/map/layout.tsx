import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Map',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="p-2">{children}</section>
}
