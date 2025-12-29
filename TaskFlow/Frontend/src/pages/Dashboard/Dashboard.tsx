import { useMemo } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { useTasks, useFavoriteTasks } from '../../lib/queries/tasks.queries'

export default function Dashboard() {
  const tasksQuery = useTasks()
  const favQuery = useFavoriteTasks()

  const loading = tasksQuery.isLoading || favQuery.isLoading
  const error = tasksQuery.isError || favQuery.isError

  // Build chart data: map dates => { date, total, favorites }
  const chartData = useMemo(() => {
    const tasks = tasksQuery.data ?? []
    const favs = favQuery.data ?? []

    const map = new Map<
      string,
      { date: string; total: number; favorites: number }
    >()

    // count all tasks
    for (const t of tasks) {
      const raw = (t as any).created_at
      const date = raw
        ? new Date(raw).toISOString().slice(0, 10)
        : 'unknown'

      const item = map.get(date) ?? { date, total: 0, favorites: 0 }
      item.total += 1

      if ((t as any).is_favorite) {
        item.favorites += 1
      }

      map.set(date, item)
    }

    // count favorite tasks (from favorites endpoint)
    for (const f of favs) {
      const raw = (f as any).created_at
      const date = raw
        ? new Date(raw).toISOString().slice(0, 10)
        : 'unknown'

      const item = map.get(date) ?? { date, total: 0, favorites: 0 }
      item.favorites += 1
      map.set(date, item)
    }

    // fallback when no dates exist
    if (map.size === 0) {
      return [
        {
          date: 'All',
          total: tasks.length,
          favorites: favs.length,
        },
      ]
    }

    // sort by date
    const arr = Array.from(map.values())
    arr.sort((a, b) => {
      if (a.date === 'unknown') return 1
      if (b.date === 'unknown') return -1
      return a.date < b.date ? -1 : 1
    })

    return arr
  }, [tasksQuery.data, favQuery.data])

  if (loading) return <div className="p-4">Loading data...</div>
  if (error)
    return (
      <div className="p-4 text-red-500">
        Failed to load dashboard data
      </div>
    )

  return (
    <div className="rounded-2xl shadow-sm p-4 bg-transparent">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Tasks Overview</h3>
        <p
          className="text-sm"
          style={{ color: 'var(--text-secondary, #64748b)' }}
        >
          All tasks vs favorite tasks
        </p>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 24, left: 0, bottom: 10 }}
          >
            {/* gradients */}
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--Priamrygreen, #0fe07a)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--Priamrygreen, #0fe07a)"
                  stopOpacity={0.05}
                />
              </linearGradient>

              <linearGradient id="favGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--green-dark, #0f5930)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor="var(--green-dark, #0f5930)"
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--text-muted, #94a3b8)"
              strokeDasharray="3 3"
              opacity={0.12}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: 'var(--text-secondary, #64748b)' }}
              axisLine={{ stroke: 'var(--text-muted, #94a3b8)' }}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: 'var(--text-secondary, #64748b)' }}
              axisLine={{ stroke: 'var(--text-muted, #94a3b8)' }}
            />

            <Tooltip
              contentStyle={{
                background: 'rgba(0,0,0,0.65)',
                borderRadius: 10,
                border: 'none',
              }}
              itemStyle={{ color: '#fff' }}
            />

            <Legend
              wrapperStyle={{
                color: 'var(--text-secondary, #64748b)',
              }}
            />

            {/* All Tasks */}
            <Area
              type="monotone"
              dataKey="total"
              name="All Tasks"
              stroke="var(--Priamrygreen, #0fe07a)"
              fill="url(#totalGradient)"
              strokeWidth={3}
              activeDot={{ r: 5 }}
            />

            {/* Favorite Tasks */}
            <Area
              type="monotone"
              dataKey="favorites"
              name="Favorite Tasks"
              stroke="var(--green-dark, #0f5930)"
              fill="url(#favGradient)"
              strokeWidth={3}
              strokeDasharray="5 4"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
