const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const passport = require('./utils/passport/passport');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const {User, Futsal,Subscription,Payment} = require("./models/index");


const BASE_URL = process.env.BASE_URL
const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// Routes
const authRoutes = require("./routes/authRoutes/authRoute");
const subscriptionRoutes = require("./routes/footsalRoutes/subscription.route")
const paymentRoutes = require("./routes/footsalRoutes/payment.route")
app.use(BASE_URL, authRoutes)
app.use(BASE_URL, subscriptionRoutes)
app.use(BASE_URL, paymentRoutes)  
//forum routes
const forumRoutes = require("./routes/forumRoutes/forum.routes")
const forumReplyRoutes = require("./routes/forumRoutes/forumReply.routes")
const forumlikesRoutes = require("./routes/forumRoutes/forumLikes.routes")  
app.use(BASE_URL, forumRoutes)
app.use(BASE_URL, forumReplyRoutes)
app.use(BASE_URL, forumlikesRoutes)

//futsal routes
const futsalRoutes = require("./routes/footsalRoutes/futsal.route")
app.use(BASE_URL, futsalRoutes) 

//tanents

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
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
      ) {
        return { email }
      }
      return null
    },
    cookieName: 'adminjs',
    cookiePassword: process.env.ADMIN_COOKIE_SECRET,
  },
  null,
  {
    resave: false,
    saveUninitialized: true,
    secret: process.env.ADMIN_COOKIE_SECRET,
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