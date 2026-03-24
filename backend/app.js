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
app.use(BASE_URL, subscriptionRoutes)

//futsal payment and subscription routes
const subscriptionRoutes = require("./routes/footsalRoutes/subscription.route")
const paymentRoutes = require("./routes/footsalRoutes/payment.route")
const futsalRoutes = require("./routes/footsalRoutes/futsal.route");
app.use(BASE_URL, subscriptionRoutes)
app.use(BASE_URL, paymentRoutes)
app.use(BASE_URL, futsalRoutes)

//futsal tenants routes
const infoRoutes = require("./routes/footsalRoutes/infoRoutes/info.routes");
const pitchRoutes = require("./routes/footsalRoutes/pitch.route");
const timeslotRoutes = require("./routes/footsalRoutes/timeslot.route");
const ratingRoutes = require("./routes/footsalRoutes/rating.route");
const mediaRoutes = require("./routes/footsalRoutes/media.route");
const bookingRoutes = require("./routes/footsalRoutes/booking.route");
const locationRoutes = require("./routes/footsalRoutes/location.route");
const visitorsRoutes = require("./routes/footsalRoutes/visitorRoutes/visitors.route");
const analyticsRoutes = require("./routes/footsalRoutes/analytics.route");
const contactRoutes = require("./routes/footsalRoutes/contactRoutes/contact.route");
const userPaymentRoutes = require("./routes/footsalRoutes/paymentRoutes/payment.route")

// call routes
app.use(BASE_URL, userPaymentRoutes)
app.use(BASE_URL, infoRoutes)
app.use(BASE_URL, pitchRoutes)
app.use(BASE_URL, timeslotRoutes)
app.use(BASE_URL, ratingRoutes)
app.use(BASE_URL, mediaRoutes)
app.use(BASE_URL, bookingRoutes)
app.use(BASE_URL, locationRoutes)
app.use(BASE_URL, visitorsRoutes)
app.use(BASE_URL, analyticsRoutes)
app.use(BASE_URL, contactRoutes)
//users
const userRoutes = require("./routes/userRoutes/user.route");
app.use(BASE_URL, userRoutes)

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


//super admin operation using adminjs
const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSSequelize = require('@adminjs/sequelize')
const { sequelize } = require('./models')

AdminJS.registerAdapter(AdminJSSequelize)

const adminJs = new AdminJS({
  databases: [sequelize],
  rootPath: '/admin',
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
app.use(cors());
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