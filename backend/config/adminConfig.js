const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSSequelize = require('@adminjs/sequelize')
const {
	sequelize,
	User,
	Footsal,
	Subscription,
	Payment,
	Forum,
	ForumReply,
	ForumLike,
} = require('../models')

const { ADMIN_COOKIE_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env

AdminJS.registerAdapter(AdminJSSequelize)

const buildDashboardHandler = async () => {
	const [
		totalUsers,
		activeUsers,
		totalFutsals,
		activeSubscriptions,
		totalForums,
		totalReplies,
		totalLikes,
		monthlyRevenue,
		recentPayments,
	] = await Promise.all([
		User.count(),
		User.count({ where: { isActive: true } }),
		Footsal.count(),
		Subscription.count({ where: { status: 'active' } }),
		Forum.count(),
		ForumReply.count(),
		ForumLike.count(),
		Payment.sum('amount', { where: { payment_status: 'completed' } }),
		Payment.findAll({
			limit: 5,
			order: [['createdAt', 'DESC']],
			attributes: ['id', 'amount', 'payment_status', 'payment_method', 'payment_date'],
		}),
	])

	return {
		stats: {
			totalUsers,
			activeUsers,
			totalFutsals,
			activeSubscriptions,
			totalForums,
			totalReplies,
			totalLikes,
			monthlyRevenue: Number(monthlyRevenue || 0),
		},
		recentPayments: recentPayments.map((payment) => ({
			id: payment.id,
			amount: Number(payment.amount || 0),
			status: payment.payment_status,
			method: payment.payment_method,
			date: payment.payment_date,
		})),
	}
}

const setupAdminPanel = (app) => {
	const adminJs = new AdminJS({
		databases: [sequelize],
		rootPath: '/admin',
		dashboard: {
			component: AdminJS.bundle('../components/dashboard-components.jsx'),
			handler: buildDashboardHandler,
		},
	})

	const router = AdminJSExpress.buildAuthenticatedRouter(
		adminJs,
		{
			authenticate: async (email, password) => {
				// Support multiple admin emails separated by commas
				const adminEmails = ADMIN_EMAIL.split(',').map((e) => e.trim())
				if (adminEmails.includes(email) && password === ADMIN_PASSWORD) {
					return { email }
				}
				return null
			},
			cookieName: 'adminjs',
			cookiePassword: ADMIN_COOKIE_SECRET,
		},
		null,
		{
			resave: false,
			saveUninitialized: true,
			secret: ADMIN_COOKIE_SECRET,
		}
	)

	app.use(adminJs.options.rootPath, router)
	return adminJs
}

module.exports = {
	setupAdminPanel,
}
