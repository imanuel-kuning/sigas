import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Testing',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>
}
