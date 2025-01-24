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

interface Dataset {
  _id: string
  text: string
  sentiment: string
}

interface DatasetData {
  text: string
  sentiment: string
}

interface Posts {
  _id: string
  text: string
  location: string
  date: string
  sentiment: string
}

interface PostsData {
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

interface Settings {
  vector_size: string
  dataset_size: string
  split_size: string
}

interface Features {
  feature: number[]
  label: number
}
