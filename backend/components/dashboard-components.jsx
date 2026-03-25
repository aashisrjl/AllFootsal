import React from 'react'
import { ApiClient } from 'adminjs'

const api = new ApiClient()

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(Number(value || 0))

const formatDate = (value) => {
  if (!value) return '-'
  return new Date(value).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const Dashboard = () => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    api
      .getDashboard()
      .then((res) => {
        setData(res.data)
      })
      .catch(() => {
        setError('Failed to load dashboard analytics.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const stats = data?.stats || {}
  const recentPayments = data?.recentPayments || []

  const metricCards = [
    { label: 'Total Users', value: stats.totalUsers ?? 0 },
    { label: 'Active Users', value: stats.activeUsers ?? 0 },
    { label: 'Total Futsals', value: stats.totalFutsals ?? 0 },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions ?? 0 },
    { label: 'Forum Posts', value: stats.totalForums ?? 0 },
    { label: 'Forum Replies', value: stats.totalReplies ?? 0 },
    { label: 'Forum Likes', value: stats.totalLikes ?? 0 },
    { label: 'Completed Revenue', value: formatCurrency(stats.monthlyRevenue ?? 0) },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Operational snapshot of your futsal platform</p>
      </div>

      {loading && <p style={styles.info}>Loading dashboard data...</p>}
      {!loading && error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          <div style={styles.grid}>
            {metricCards.map((card) => (
              <div key={card.label} style={styles.card}>
                <p style={styles.cardLabel}>{card.label}</p>
                <p style={styles.cardValue}>{card.value}</p>
              </div>
            ))}
          </div>

          <div style={styles.tableSection}>
            <h2 style={styles.sectionTitle}>Recent Payments</h2>
            {recentPayments.length === 0 ? (
              <p style={styles.info}>No payment data available yet.</p>
            ) : (
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>ID</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Method</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td style={styles.td}>#{payment.id}</td>
                        <td style={styles.td}>{formatCurrency(payment.amount)}</td>
                        <td style={styles.td}>{payment.method}</td>
                        <td style={styles.td}>{payment.status}</td>
                        <td style={styles.td}>{formatDate(payment.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const styles = {
  page: {
    padding: '24px',
    background: '#f8fafc',
    minHeight: '100vh',
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  header: {
    marginBottom: '20px',
  },
  title: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 700,
    color: '#0f172a',
  },
  subtitle: {
    marginTop: '8px',
    color: '#475569',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
  },
  cardLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#64748b',
  },
  cardValue: {
    margin: '8px 0 0',
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
  },
  tableSection: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '16px',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '18px',
    color: '#0f172a',
  },
  tableWrap: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    fontSize: '13px',
    color: '#475569',
    borderBottom: '1px solid #e2e8f0',
    padding: '10px 8px',
  },
  td: {
    fontSize: '14px',
    color: '#0f172a',
    borderBottom: '1px solid #f1f5f9',
    padding: '10px 8px',
  },
  info: {
    color: '#475569',
  },
  error: {
    color: '#b91c1c',
  },
}

export default Dashboard