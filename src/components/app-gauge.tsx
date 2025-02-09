'use client'
import { useTheme } from 'next-themes'
//@ts-expect-error packaga doesn't include types
import GaugeChart from 'react-gauge-chart'

export default function AppGauge({ value }: { value: number }) {
  const { theme } = useTheme()

  return <GaugeChart id="gauge-chart2" colors={['#34D399', '#F87171']} nrOfLevels={20} arcWidth={0.2} textColor={theme === 'light' ? '' : '#D1D5DB'} needleColor={theme === 'light' ? '' : '#D1D5DB'} percent={value} />
}
