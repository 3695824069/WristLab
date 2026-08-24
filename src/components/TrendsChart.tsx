import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getWorkoutTrends } from '../lib/api'

interface TrendPoint {
  week_start: string
  count: number
}

export default function TrendsChart() {
  const { t } = useTranslation()
  const [data, setData] = useState<TrendPoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getWorkoutTrends(12)
      .then((res: { data?: { trends?: TrendPoint[] } }) => {
        setData(res.data?.trends || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Only show chart when there are at least 2 weeks with data
  const weeksWithData = data.filter(d => d.count > 0).length
  const hasEnoughData = weeksWithData >= 2

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 animate-pulse">
        <div className="h-4 w-32 bg-zinc-800 rounded mb-4" />
        <div className="h-40 bg-zinc-800 rounded" />
      </div>
    )
  }

  return (
    <section>
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-green-400" />
        {t('records.trendTitle')}
      </h2>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        {hasEnoughData ? (
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="week_start"
                  tick={{ fill: '#a1a1aa', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val: string) => {
                    const d = val.split('-')
                    return `${parseInt(d[1])}/${parseInt(d[2])}`
                  }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#a1a1aa', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#18181b',
                    border: '1px solid #27272a',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: '#a1a1aa' }}
                  formatter={(value: number) => [value, t('records.trendWorkouts')]}
                  labelFormatter={(label: string) => t('records.trendWeekLabel', { date: label })}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ fill: '#22c55e', r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-8 text-center text-sm text-zinc-600">
            <TrendingUp className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
            <p>{t('records.trendEmpty1')}</p>
            <p>{t('records.trendEmpty2')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
