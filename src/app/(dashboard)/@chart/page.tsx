'use client'

import { index } from '@/actions/chart'
import AppCard from '@/components/app-card'
import AppGauge from '@/components/app-gauge'
import { useLocation } from '@/hooks/use-location'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'
import { useEffect, useState, useTransition } from 'react'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Page() {
  const { location } = useLocation()
  const [isPending, setTransition] = useTransition()
  const [total, setTotal] = useState<ChartData>({ labels: [], data: [] })
  const [ratio, setRatio] = useState<{ labels: string[]; data: { positive: number[]; negative: number[] } }>({ labels: [], data: { positive: [], negative: [] } })

  useEffect(() => {
    setTransition(async () => {
      const res = await index(location.province)
      setTotal(res.total)
      setRatio(res.ratio)
    })
  }, [location])

  return (
    <div className="grid md:grid-cols-3 gap-3">
      <div className="md:col-span-2">
        <AppCard title="Total">
          {isPending && 'Loading...'}
          <Bar
            options={{ responsive: true }}
            data={{
              labels: total.labels,
              datasets: [
                {
                  label: 'Total',
                  data: total.data,
                  borderColor: 'rgb(75, 192, 192)',
                  backgroundColor: '#9CA3AF',
                },
              ],
            }}
          />
        </AppCard>
      </div>
      <div>
        <AppCard title="Index">
          {isPending && 'Loading...'}
          <AppGauge value={location.negative / (location.negative + location.positive)} />
        </AppCard>
      </div>
      <div className="md:col-span-3">
        <AppCard title="Ratio">
          {isPending && 'Loading...'}
          <Line
            data={{
              labels: ratio.labels,
              datasets: [
                {
                  label: 'Negative',
                  data: ratio.data.negative,
                  fill: false,
                  borderColor: '#F87171',
                  tension: 0.1,
                },
                {
                  label: 'Positive',
                  data: ratio.data.positive,
                  fill: false,
                  borderColor: '#34D399',
                  tension: 0.1,
                },
              ],
            }}
          />
        </AppCard>
      </div>
    </div>
  )
}
