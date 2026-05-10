const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const passport = require('./utils/passport/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const { setupAdminPanel } = require('./config/adminConfig')
const { CORS_ALLOWED_ORIGINS } = process.env

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

//cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Core middleware (must be before routes)
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(cors({
  origin: CORS_ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// super admin operation using adminjs
setupAdminPanel(app)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static("./uploads/"));

// Routes
const authRoutes = require("./routes/authRoutes/authRoute");
app.use('/api/v1/', authRoutes)
const userRoutes = require("./routes/usersRoutes/users.routes")
app.use('/api/v1/', userRoutes)

// notification routes
const notificationRoutes = require("./routes/notificationRoutes/notification.routes")
app.use('/api/v1/', notificationRoutes)

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

// //futsal routes
// const futsalRoutes = require("./routes/footsalRoutes/futsal.route")
// app.use('/api/v1/', futsalRoutes)

// super admin tenant operations
const superAdminTenantRoutes = require("./routes/adminRoutes/superAdminTenant.route")
app.use('/api/v1/', superAdminTenantRoutes)

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
const faqRoutes = require("./routes/footsalRoutes/faqRoutes/faq.routes")

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
app.use('/api/v1/', faqRoutes)

//futsal routes (must come after specific tenant routes like contact, analytics)
const futsalRoutes = require("./routes/footsalRoutes/futsal.route")
app.use('/api/v1/', futsalRoutes)

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


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
  if (res.headersSent) {
    return next(err);
  }
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