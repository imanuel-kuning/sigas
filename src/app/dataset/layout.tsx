import { Metadata } from 'next'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'

export const metadata: Metadata = {
  title: 'Dataset',
}

export default function Layout({ children, actions }: { children: React.ReactNode; actions: React.ReactNode }) {
  return (
    <section>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={70} minSize={50} className="p-2">
          {children}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} className="p-2">
          {actions}
        </ResizablePanel>
      </ResizablePanelGroup>
    </section>
  )
}
