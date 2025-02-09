'use client'

import { index } from '@/actions/chart'
import AppCard from '@/components/app-card'
import { useLocation } from '@/hooks/use-location'
import { useEffect, useState, useTransition } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Page() {
  const [chartData, setChartData] = useState<ChartData>({ labels: [], data: [] })
  const { location } = useLocation()
  const [isPending, setTransition] = useTransition()

  useEffect(() => {
    setTransition(async () => {
      setChartData((await index(location.province)).total)
    })
  }, [])

  return (
    <div>
      <AppCard title="Chart">
        {isPending && 'Loading...'}
        <Line
          data={{
            labels: chartData.labels,
            datasets: [
              {
                label: 'My First Dataset',
                data: chartData.data,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
              },
            ],
          }}
        />
      </AppCard>
    </div>
  )
}
