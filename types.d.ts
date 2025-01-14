interface Sidebar {
  title: string
  url: string
  icon: LucideIcon
  badge: number | null
}

interface Watcher {
  watch: number
  refresh: () => void
}

interface Training {
  _id: string
  text: string
  sentiment: string
}

interface TrainingData {
  text: string
  sentiment: string
}
