'use client'

import { useTheme } from 'next-themes'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <Button size="icon" variant="ghost" className="w-7 h-7" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
    </Button>
  )
}
