const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const passport = require('./utils/passport/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const {BASE_URL, ADMIN_COOKIE_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD} = process.env



const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Routes
const authRoutes = require("./routes/authRoutes/authRoute");
app.use('/api/v1/', authRoutes)

//futsal payment and subscription routes
const subscriptionRoutes = require("./routes/footsalRoutes/subscription.route")
const paymentRoutes = require("./routes/footsalRoutes/payment.route")
app.use('/api/v1/', subscriptionRoutes)
app.use('/api/v1/', paymentRoutes)

//forum routes
const forumRoutes = require("./routes/forumRoutes/forum.routes")
const forumReplyRoutes = require("./routes/forumRoutes/forumReply.routes")
const forumlikesRoutes = require("./routes/forumRoutes/forumLike.routes")  
app.use('/api/v1/', forumRoutes)
app.use('/api/v1/', forumReplyRoutes)
app.use('/api/v1/', forumlikesRoutes)

//futsal routes
const futsalRoutes = require("./routes/footsalRoutes/futsal.route")
app.use('/api/v1/', futsalRoutes) 

//tanents
const analyticsRoutes = require("./routes/footsalRoutes/analyticsRoutes/analytics.route")
const contactRoutes = require("./routes/footsalRoutes/contactRoutes/contact.route")
const locationRoutes = require("./routes/footsalRoutes/locationRoutes/location.route")
const ratingRoutes = require("./routes/footsalRoutes/ratingRoutes/rating.route")
const bookingRoutes = require("./routes/footsalRoutes/bookingRoutes/booking.route")
const infoRoutes = require("./routes/footsalRoutes/infoRoutes/info.routes")
const mediaRoutes = require("./routes/footsalRoutes/mediaRoutes/media.route")
const paymentFutsalRoutes = require("./routes/footsalRoutes/paymentRoutes/payment.route")
const pitchRoutes = require("./routes/footsalRoutes/pitchRoutes/pitch.route")
const timeslotRoutes = require("./routes/footsalRoutes/timeslotsRoutes/timeslot.route")
const visitorRoutes = require("./routes/footsalRoutes/visitorRoutes/visitors.route")

app.use('/api/v1/', analyticsRoutes)
app.use('/api/v1/', contactRoutes)
app.use('/api/v1/', locationRoutes)
app.use('/api/v1/', ratingRoutes)
app.use('/api/v1/', bookingRoutes)
app.use('/api/v1/', infoRoutes)
app.use('/api/v1/', mediaRoutes)
app.use('/api/v1/', paymentFutsalRoutes)
app.use('/api/v1/', pitchRoutes)
app.use('/api/v1/', timeslotRoutes)
app.use('/api/v1/', visitorRoutes)

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


//super admin operation using adminjs
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
} = require('./models')

AdminJS.registerAdapter(AdminJSSequelize)

const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
  dashboard:{
    component: AdminJS.bundle('./components/dashboard-components.jsx'),
    handler: async () => {
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
    },
  }
})

// const router = AdminJSExpress.buildRouter(adminJs)
const router = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate: async (email, password) => {
      if (
        email === ADMIN_EMAIL &&
        password === ADMIN_PASSWORD
      ) {
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


// Middleware
app.use(helmet());
app.use(cors(
  origin => {
    if (origin === 'http://localhost:3000' || origin === 'http://localhost:3001' || origin === 'http://localhost:3002' || origin === 'http://localhost:3003' || origin === 'http://localhost:5173') {
      return true; // Allow requests from localhost:3000 and localhost:5173
    }
    return false; // Block requests from other origins
  },
  {
    credentials: true, // Allow cookies to be sent with requests
  }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// redis connection
const { connectRedis } = require("./config/redisConfig");
connectRedis();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);


// Health check
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Footsal Backend Server running on port ${PORT}`);
  console.log(` Health check available at http://localhost:${PORT}/health`);
});