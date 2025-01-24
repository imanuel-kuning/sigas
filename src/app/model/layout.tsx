import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Model Evaluation',
}

export default function Layout({ children, actions }: { children: React.ReactNode; actions: React.ReactNode }) {
  return (
    <section className="p-2">
      {children}
      {actions}
    </section>
  )
}
