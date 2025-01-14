import AppBreadcrumb from './app-breadcrumb'
import ThemeToggle from './theme-toggle'
import { SidebarTrigger } from './ui/sidebar'

export default function AppNavbar() {
  return (
    <nav className="flex justify-between gap-2 mx-4">
      <SidebarTrigger />
      <AppBreadcrumb />
      <ThemeToggle />
    </nav>
  )
}
