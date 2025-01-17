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

interface Testing {
  _id: string
  text: string
  location: string
  date: string
  sentiment: string
}

interface TestingData {
  text: string
  location: string
  date: string
}

interface PreprocessingData {
  _id: string
  text: string
  clean: string
  stem: string
  stopword: string
  sentiment: string
}

interface Vector {
  feature: number[]
  label: number
}

interface Settings {
  vector_size: string
  dataset_size: string
  split_size: string
}

interface Features {
  feature: number[]
  label: number
}
