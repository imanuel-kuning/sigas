'use server'

import db from '@/lib/database'

const collection = (await db())?.collection('posts')

function groupByWeeks(data: PostsData[]): WeekGroup[] {
  if (data.length < 1) return []

  // Sort data by date
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // Get the first and last dates
  const firstDate = new Date(sortedData[0].date)
  const lastDate = new Date(sortedData[sortedData.length - 1].date)

  // Initialize weeks array
  const weeks: WeekGroup[] = []

  // Set start date to beginning of the week (Sunday)
  const currentDate = new Date(firstDate)
  currentDate.setDate(currentDate.getDate() - currentDate.getDay())

  // Create week groups until we pass the last date
  while (currentDate <= lastDate) {
    const weekEnd = new Date(currentDate)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const weekData = sortedData.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= currentDate && itemDate <= weekEnd
    })

    if (weekData.length > 0) {
      const weekLabel = `Week ${weeks.length + 1}`
      // (${currentDate.toLocaleDateString()} - ${weekEnd.toLocaleDateString()})
      weeks.push({
        label: weekLabel,
        data: weekData,
      })
    }

    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7)
  }

  return weeks
}

export async function index(location: string) {
  const result = await collection?.find({ location }).sort({ _id: -1 }).toArray()
  const temp = result?.map((data) => {
    const result: PostsData = { location: data.location, sentiment: data.sentiment, text: data.text, date: data.date.split('T')[0] }
    return result
  })
  const groupedByWeeks = groupByWeeks(temp ?? [])

  const total = {
    labels: groupedByWeeks.map((date) => date.label),
    data: groupedByWeeks.map((date) => date.data.length),
  }

  const ratio = {
    labels: groupedByWeeks.map((date) => date.label),
    data: {
      positive: groupedByWeeks.map((date) => date.data.filter((e) => e.sentiment === 'positive').length),
      negative: groupedByWeeks.map((date) => date.data.filter((e) => e.sentiment === 'negative').length),
    },
  }

  return { total, ratio }
}
