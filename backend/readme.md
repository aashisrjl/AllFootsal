# Goal Futsal Nepal Booking Backend

This is the backend server for Goal Futsal Nepal Booking, supporting user, admin, and futsal management. Built with Node.js and SQL, it provides RESTful APIs for booking, user management, payments, and facility administration.

## Features
- User registration, authentication, and profile management
- Admin panel for managing users, bookings, and facilities
- Facility listing and management
- Booking system for futsal grounds
- Payment integration
- Secure authentication and authorization

## Tech Stack
- **Node.js** (Express.js)
- **SQL** (e.g., MySQL, PostgreSQL)
- **JWT** for authentication
- **Multer** for file uploads

## Project Structure
```
backend/
├── app.js                # Main application entry point
├── controllers/          # Route controllers
├── middleware/           # Custom middleware (e.g., auth)
├── models/               # Database models
├── routes/               # API route definitions
├── services/             # Business logic/services
├── upload/               # Uploaded files
├── utils/                # Utility functions
├── package.json          # Project dependencies
└── readme.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- SQL database (MySQL/PostgreSQL)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (e.g., database credentials, JWT secret) in a `.env` file.
4. Start the server:
   ```bash
   npm start
   ```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
