import React from 'react'
import { ApiClient } from 'adminjs'

const api = new ApiClient()

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
  const [theme, setTheme] = React.useState('dark')
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-theme') || 'dark';
      setTheme(saved);
      if (saved === 'dark') {
        document.documentElement.classList.remove('theme-light');
        document.documentElement.classList.add('theme-dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
        document.documentElement.classList.add('theme-light');
      }
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-theme', next);
        if (next === 'dark') {
          document.documentElement.classList.remove('theme-light');
          document.documentElement.classList.add('theme-dark');
        } else {
          document.documentElement.classList.remove('theme-dark');
          document.documentElement.classList.add('theme-light');
        }
      }
      return next;
    });
  }

  const styles = React.useMemo(() => getStyles(theme), [theme])
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
        setTenantError('Failed to load tenant data. Verify API key.')
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
    if (!window.confirm(`DANGER: Are you sure you want to drop all tables for ${futsalCode}? Data will be lost.`)) return
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
    { label: 'Total Users', value: stats.totalUsers ?? 0, icon: '👥' },
    { label: 'Active Users', value: stats.activeUsers ?? 0, icon: '✅' },
    { label: 'Total Futsals', value: stats.totalFutsals ?? 0, icon: '🏟️' },
    { label: 'Active Subscriptions', value: stats.activeSubscriptions ?? 0, icon: '💳' },
    { label: 'Forum Posts', value: stats.totalForums ?? 0, icon: '📝' },
    { label: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue ?? 0), icon: '💰' },
  ]

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>System Overview</h1>
          <p style={styles.subtitle}>Real-time metrics and infrastructure management</p>
        </div>
        <button onClick={toggleTheme} style={styles.themeToggleBtn}>
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </header>

      {loading ? (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Analyzing platform data...</p>
        </div>
      ) : error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : (
        <>
          <section style={styles.metricsGrid}>
            {metricCards.map((card) => (
              <div key={card.label} style={styles.metricCard}>
                <div style={styles.metricIcon}>{card.icon}</div>
                <div>
                  <p style={styles.metricLabel}>{card.label}</p>
                  <p style={styles.metricValue}>{card.value}</p>
                </div>
              </div>
            ))}
          </section>

          <main style={styles.contentGrid}>
            {/* Tenant Management */}
            <div style={styles.mainCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Tenant Infrastructure</h2>
                <span style={styles.countBadge}>{tenants.length} Total</span>
              </div>

              {tenantError && <div style={styles.errorText}>{tenantError}</div>}

              <div style={styles.tenantListContainer}>
                {tenantsLoading ? (
                  <p style={styles.placeholderText}>Refreshing tenant status...</p>
                ) : tenants.length === 0 ? (
                  <p style={styles.placeholderText}>No tenants found in system.</p>
                ) : (
                  tenants.map((tenant) => {
                    const isExpanded = expandedTenant === tenant.futsal.futsalCode
                    const allTablesExist = tenant.tenantSummary.missingTables === 0

                    return (
                      <div key={tenant.futsal.id} style={{
                        ...styles.tenantItem,
                        borderLeft: `4px solid ${allTablesExist ? '#10b981' : '#f59e0b'}`
                      }}>
                        <div style={styles.tenantSummary} onClick={() => setExpandedTenant(isExpanded ? null : tenant.futsal.futsalCode)}>
                          <div style={styles.tenantInfo}>
                            <p style={styles.tenantName}>{tenant.futsal.futsalName}</p>
                            <p style={styles.tenantMeta}>Code: {tenant.futsal.futsalCode} • {tenant.futsal.email}</p>
                          </div>
                          <div style={styles.tenantStatus}>
                            <span style={{
                              ...styles.statusBadge,
                              backgroundColor: allTablesExist ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                              color: allTablesExist ? '#10b981' : '#f59e0b'
                            }}>
                              {tenant.tenantSummary.existingTables}/{tenant.tenantSummary.totalExpectedTables}
                            </span>
                            <span style={styles.dropdownArrow}>{isExpanded ? '▴' : '▾'}</span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={styles.tenantDetails}>
                            <div style={styles.detailsGrid}>
                              <div>
                                <p style={styles.detailLabel}>Owner Info</p>
                                <p style={styles.detailValue}>{tenant.futsal.ownerName}</p>
                                <p style={styles.detailValue}>{tenant.futsal.phoneNumber}</p>
                              </div>
                              <div>
                                <p style={styles.detailLabel}>System Status</p>
                                <p style={styles.detailValue}>{tenant.futsal.isActive ? '✅ Active' : '❌ Inactive'}</p>
                                <p style={styles.detailValue}>{tenant.futsal.isVerified ? '🛡️ Verified' : '⚠️ Unverified'}</p>
                              </div>
                            </div>

                            <div style={styles.tableStatusGrid}>
                              <p style={styles.detailLabel}>Infrastructure Integrity</p>
                              <div style={styles.tableChips}>
                                {tenant.tables.map(table => (
                                  <span key={table.tableName} style={{
                                    ...styles.tableChip,
                                    color: table.exists ? '#10b981' : '#ef4444',
                                    borderColor: table.exists ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'
                                  }}>
                                    {table.tableName}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div style={styles.actionRow}>
                              {!allTablesExist ? (
                                <button
                                  style={styles.btnPrimary}
                                  onClick={() => handleCreateTenant(tenant.futsal.futsalCode)}
                                  disabled={actionLoading[`create-${tenant.futsal.futsalCode}`]}
                                >
                                  {actionLoading[`create-${tenant.futsal.futsalCode}`] ? 'Initializing...' : 'Initialize Infrastructure'}
                                </button>
                              ) : (
                                <button
                                  style={styles.btnDanger}
                                  onClick={() => handleDropTenant(tenant.futsal.futsalCode)}
                                  disabled={actionLoading[`drop-${tenant.futsal.futsalCode}`]}
                                >
                                  {actionLoading[`drop-${tenant.futsal.futsalCode}`] ? 'Dropping...' : 'Drop Infrastructure'}
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={styles.mainCard}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Recent Financial Activity</h2>
              </div>
              <div style={styles.tableWrapper}>
                <table style={styles.customTable}>
                  <thead>
                    <tr>
                      <th style={styles.tableTh}>ID</th>
                      <th style={styles.tableTh}>Amount</th>
                      <th style={styles.tableTh}>Method</th>
                      <th style={styles.tableTh}>Status</th>
                      <th style={styles.tableTh}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.length === 0 ? (
                      <tr><td colSpan="5" style={styles.emptyTd}>No recent transactions</td></tr>
                    ) : (
                      recentPayments.map((p) => (
                        <tr key={p.id} style={styles.tableTr}>
                          <td style={styles.tableTd}>#{p.id}</td>
                          <td style={{ ...styles.tableTd, fontWeight: 'bold' }}>{formatCurrency(p.amount)}</td>
                          <td style={styles.tableTd}>{p.method}</td>
                          <td style={styles.tableTd}>
                            <span style={{
                              ...styles.statusDot,
                              backgroundColor: p.status === 'completed' ? '#10b981' : '#f59e0b'
                            }}></span>
                            {p.status}
                          </td>
                          <td style={styles.tableTd}>{formatDate(p.date)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </>
      )}
    </div>
  )
}

const getStyles = (theme) => {
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? 'transparent' : '#f8fafc',
    text: isDark ? '#f8fafc' : '#0f172a',
    textSecondary: isDark ? '#94a3b8' : '#64748b',
    cardBg: isDark ? '#111827' : '#ffffff',
    border: isDark ? '#1f2937' : '#e2e8f0',
    itemBg: isDark ? '#0f172a' : '#f8fafc',
    badgeBg: isDark ? '#1e293b' : '#f1f5f9',
    titleGradient: isDark ? 'linear-gradient(135deg, #111827 0%, #111826 100%)' : 'linear-gradient(135deg, #111827 0%, #111826 100%)',
    iconBg: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
  };

  return {
    themeToggleBtn: {
      padding: '8px 16px',
      backgroundColor: colors.cardBg,
      color: colors.text,
      border: `1px solid ${colors.border}`,
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
    },
    container: {
      padding: '24px',
      width: '100%',
      margin: '0',
      color: colors.text,
      backgroundColor: colors.bg,
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      boxSizing: 'border-box',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: '32px',
    },
    title: {
      fontSize: '32px',
      fontWeight: 800,
      margin: 0,
      background: colors.titleGradient,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    subtitle: {
      color: colors.textSecondary,
      margin: '8px 0 0',
      fontSize: '15px',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '20px',
      marginBottom: '32px',
    },
    metricCard: {
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      transition: 'transform 0.2s, border-color 0.2s',
    },
    metricIcon: {
      fontSize: '28px',
      background: colors.iconBg,
      width: '56px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '12px',
    },
    metricLabel: {
      margin: 0,
      fontSize: '13px',
      color: colors.textSecondary,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
    },
    metricValue: {
      margin: '4px 0 0',
      fontSize: '24px',
      fontWeight: 700,
      color: colors.text,
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
      gap: '24px',
    },
    mainCard: {
      background: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    cardHeader: {
      padding: '20px 24px',
      borderBottom: `1px solid ${colors.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)',
    },
    cardTitle: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 600,
    },
    countBadge: {
      fontSize: '12px',
      background: colors.badgeBg,
      padding: '4px 10px',
      borderRadius: '20px',
      color: colors.textSecondary,
    },
    tenantListContainer: {
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    tenantItem: {
      background: colors.itemBg,
      borderRadius: '12px',
      border: `1px solid ${colors.border}`,
      overflow: 'hidden',
    },
    tenantSummary: {
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
    },
    tenantName: {
      margin: 0,
      fontSize: '15px',
      fontWeight: 600,
      color: colors.text,
    },
    tenantMeta: {
      margin: '4px 0 0',
      fontSize: '12px',
      color: colors.textSecondary,
    },
    tenantStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    statusBadge: {
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '11px',
      fontWeight: 700,
    },
    dropdownArrow: {
      fontSize: '10px',
      color: colors.textSecondary,
    },
    tenantDetails: {
      padding: '0 20px 20px',
      borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.05)'}`,
      marginTop: '-4px',
      paddingTop: '20px',
    },
    detailsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '24px',
      marginBottom: '24px',
    },
    detailLabel: {
      fontSize: '11px',
      textTransform: 'uppercase',
      color: colors.textSecondary,
      fontWeight: 700,
      letterSpacing: '0.05em',
      marginBottom: '8px',
    },
    detailValue: {
      fontSize: '13px',
      color: colors.textSecondary,
      margin: '0 0 4px',
    },
    tableChips: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
    },
    tableChip: {
      fontSize: '10px',
      padding: '3px 8px',
      borderRadius: '4px',
      border: '1px solid',
      background: colors.iconBg,
    },
    actionRow: {
      marginTop: '24px',
      display: 'flex',
      gap: '12px',
    },
    btnPrimary: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      flex: 1,
    },
    btnDanger: {
      backgroundColor: '#991b1b',
      color: '#fecaca',
      border: '1px solid #7f1d1d',
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      fontWeight: 600,
      cursor: 'pointer',
      flex: 1,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
    customTable: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    tableTh: {
      textAlign: 'left',
      padding: '16px 24px',
      fontSize: '12px',
      color: colors.textSecondary,
      fontWeight: 700,
      textTransform: 'uppercase',
      borderBottom: `1px solid ${colors.border}`,
      background: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.02)',
    },
    tableTd: {
      padding: '16px 24px',
      fontSize: '14px',
      color: colors.textSecondary,
      borderBottom: `1px solid ${colors.border}`,
    },
    tableTr: {
      transition: 'background 0.2s',
    },
    statusDot: {
      display: 'inline-block',
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      marginRight: '8px',
    },
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '400px',
      color: colors.textSecondary,
    },
    spinner: {
      width: '40px',
      height: '40px',
      border: '3px solid rgba(59,130,246,0.1)',
      borderTopColor: '#3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '16px',
    },
    placeholderText: {
      textAlign: 'center',
      color: colors.textSecondary,
      padding: '40px',
      fontSize: '14px',
    },
    errorText: {
      margin: '16px',
      padding: '12px',
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      borderRadius: '8px',
      fontSize: '13px',
      border: '1px solid rgba(239, 68, 68, 0.2)',
    }
  }

};

export default Dashboard