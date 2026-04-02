import React from 'react'
import { ApiClient } from 'adminjs'

const api = new ApiClient()

// Get super admin key from backend (component runs server-side in AdminJS)
// For client-side: use REACT_APP_SUPER_ADMIN_KEY from .env
const SUPER_ADMIN_KEY = typeof process !== 'undefined' && process.env.SUPER_ADMIN_API_KEY 
  ? process.env.SUPER_ADMIN_API_KEY 
  : 'super-admin-secret-key-futsal-2024'

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

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-super-admin-key': SUPER_ADMIN_KEY,
    },
  }
  if (body) options.body = JSON.stringify(body)
  const response = await fetch(`/api/v1${endpoint}`, options)
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
  return response.json()
}

const Dashboard = () => {
  const [data, setData] = React.useState(null)
  const [tenants, setTenants] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [tenantsLoading, setTenantsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [tenantError, setTenantError] = React.useState('')
  const [expandedTenant, setExpandedTenant] = React.useState(null)
  const [actionLoading, setActionLoading] = React.useState({})

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await api.getDashboard()
        setData(res.data)
      } catch (err) {
        setError('Failed to load dashboard analytics.')
      } finally {
        setLoading(false)
      }
    }

    const fetchTenants = async () => {
      try {
        setTenantsLoading(true)
        const res = await apiCall('/super-admin/tenants')
        setTenants(res.data || [])
      } catch (err) {
        setTenantError('Failed to load tenant data. Check SUPER_ADMIN_KEY.')
      } finally {
        setTenantsLoading(false)
      }
    }

    fetchData()
    fetchTenants()
  }, [])

  const handleCreateTenant = async (futsalCode) => {
    try {
      setActionLoading((prev) => ({ ...prev, [`create-${futsalCode}`]: true }))
      await apiCall(`/super-admin/tenants/${futsalCode}/create`, 'POST')
      const res = await apiCall('/super-admin/tenants')
      setTenants(res.data || [])
      setExpandedTenant(null)
    } catch (err) {
      setTenantError(`Failed to create tenant tables: ${err.message}`)
    } finally {
      setActionLoading((prev) => ({ ...prev, [`create-${futsalCode}`]: false }))
    }
  }

  const handleDropTenant = async (futsalCode) => {
    if (!window.confirm(`Are you sure you want to drop tenant tables for ${futsalCode}?`)) return
    try {
      setActionLoading((prev) => ({ ...prev, [`drop-${futsalCode}`]: true }))
      await apiCall(`/super-admin/tenants/${futsalCode}/drop`, 'DELETE')
      const res = await apiCall('/super-admin/tenants')
      setTenants(res.data || [])
      setExpandedTenant(null)
    } catch (err) {
      setTenantError(`Failed to drop tenant tables: ${err.message}`)
    } finally {
      setActionLoading((prev) => ({ ...prev, [`drop-${futsalCode}`]: false }))
    }
  }

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

          <div style={styles.tableSection}>
            <h2 style={styles.sectionTitle}>
              Tenant Management ({tenants.length})
            </h2>
            {tenantError && <p style={styles.error}>{tenantError}</p>}
            {tenantsLoading && <p style={styles.info}>Loading tenant data...</p>}
            {!tenantsLoading && tenants.length === 0 && (
              <p style={styles.info}>No futsal tenants found.</p>
            )}
            {!tenantsLoading && tenants.length > 0 && (
              <div style={styles.tenantCards}>
                {tenants.map((tenant) => {
                  const isExpanded = expandedTenant === tenant.futsal.futsalCode
                  const allTablesExist =
                    tenant.tenantSummary.missingTables === 0
                  return (
                    <div
                      key={tenant.futsal.id}
                      style={styles.tenantCard}
                    >
                      <div
                        style={styles.tenantCardHeader}
                        onClick={() =>
                          setExpandedTenant(
                            isExpanded ? null : tenant.futsal.futsalCode
                          )
                        }
                      >
                        <div>
                          <p style={styles.tenantCardTitle}>
                            {tenant.futsal.futsalName} (Code: {tenant.futsal.futsalCode})
                          </p>
                          <p style={styles.tenantCardSubtitle}>
                            Owner: {tenant.futsal.ownerName}
                          </p>
                        </div>
                        <div style={styles.tenantCardStatus}>
                          <span
                            style={{
                              ...styles.badge,
                              ...(allTablesExist
                                ? styles.badgeSuccess
                                : styles.badgeWarning),
                            }}
                          >
                            {tenant.tenantSummary.existingTables}/{tenant.tenantSummary.totalExpectedTables} Tables
                          </span>
                          <span
                            style={{
                              ...styles.badge,
                              ...(tenant.futsal.isActive
                                ? styles.badgeActive
                                : styles.badgeInactive),
                            }}
                          >
                            {tenant.futsal.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <span style={styles.toggleIcon}>
                            {isExpanded ? '▼' : '▶'}
                          </span>
                        </div>
                      </div>

                      {isExpanded && (
                        <div style={styles.tenantCardDetails}>
                          <p style={styles.detailText}>
                            <strong>Email:</strong> {tenant.futsal.email}
                          </p>
                          <p style={styles.detailText}>
                            <strong>Phone:</strong> {tenant.futsal.phoneNumber}
                          </p>
                          <p style={styles.detailText}>
                            <strong>Status:</strong> {tenant.futsal.isVerified ? '✓ Verified' : '✗ Not Verified'}
                          </p>

                          <div style={styles.tableList}>
                            <h4>Tenant Tables:</h4>
                            <ul style={styles.tableListUl}>
                              {tenant.tables.map((table) => (
                                <li
                                  key={table.tableName}
                                  style={{
                                    color: table.exists ? '#4ade80' : '#f87171',
                                  }}
                                >
                                  {table.tableName} {table.exists ? '✓' : '✗'}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div style={styles.actionButtons}>
                            {!allTablesExist && (
                              <button
                                style={{
                                  ...styles.button,
                                  ...styles.buttonPrimary,
                                }}
                                onClick={() => handleCreateTenant(tenant.futsal.futsalCode)}
                                disabled={actionLoading[`create-${tenant.futsal.futsalCode}`]}
                              >
                                {actionLoading[`create-${tenant.futsal.futsalCode}`]
                                  ? 'Creating...'
                                  : 'Create Tables'}
                              </button>
                            )}
                            {allTablesExist && (
                              <button
                                style={{
                                  ...styles.button,
                                  ...styles.buttonDanger,
                                }}
                                onClick={() => handleDropTenant(tenant.futsal.futsalCode)}
                                disabled={actionLoading[`drop-${tenant.futsal.futsalCode}`]}
                              >
                                {actionLoading[`drop-${tenant.futsal.futsalCode}`]
                                  ? 'Dropping...'
                                  : 'Drop Tables'}
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
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
    background: '#0b1220',
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
    color: '#f8fafc',
  },
  subtitle: {
    marginTop: '8px',
    color: '#94a3b8',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  card: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '16px',
  },
  cardLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#9ca3af',
  },
  cardValue: {
    margin: '8px 0 0',
    fontSize: '24px',
    fontWeight: 700,
    color: '#f8fafc',
  },
  tableSection: {
    background: '#111827',
    border: '1px solid #1f2937',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '20px',
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontSize: '18px',
    color: '#f8fafc',
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
    color: '#cbd5e1',
    borderBottom: '1px solid #1f2937',
    padding: '10px 8px',
  },
  td: {
    fontSize: '14px',
    color: '#e5e7eb',
    borderBottom: '1px solid #1f2937',
    padding: '10px 8px',
  },
  info: {
    color: '#94a3b8',
  },
  error: {
    color: '#fca5a5',
  },
  tenantCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '12px',
  },
  tenantCard: {
    background: '#0f172a',
    border: '1px solid #1e293b',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tenantCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    cursor: 'pointer',
    backgroundColor: '#111827',
    borderBottom: '1px solid #1e293b',
  },
  tenantCardTitle: {
    margin: '0 0 4px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#f8fafc',
  },
  tenantCardSubtitle: {
    margin: 0,
    fontSize: '12px',
    color: '#94a3b8',
  },
  tenantCardStatus: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  badgeSuccess: {
    backgroundColor: '#14532d',
    color: '#bbf7d0',
  },
  badgeWarning: {
    backgroundColor: '#78350f',
    color: '#fde68a',
  },
  badgeActive: {
    backgroundColor: '#1e3a8a',
    color: '#bfdbfe',
  },
  badgeInactive: {
    backgroundColor: '#7f1d1d',
    color: '#fecaca',
  },
  toggleIcon: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  tenantCardDetails: {
    padding: '12px',
    borderTop: '1px solid #1e293b',
  },
  detailText: {
    margin: '0 0 8px',
    fontSize: '12px',
    color: '#cbd5e1',
  },
  tableList: {
    marginTop: '12px',
    marginBottom: '12px',
  },
  tableListUl: {
    margin: '8px 0 0',
    paddingLeft: '20px',
    fontSize: '12px',
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  },
  button: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
    color: '#ffffff',
  },
}

export default Dashboard