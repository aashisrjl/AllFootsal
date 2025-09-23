# Goal Futsal Nepal - Mobile App

This is the React Native mobile application for Goal Futsal Nepal, built with Expo and NativeWind (Tailwind CSS for React Native).

## Features

- **Browse Facilities**: Explore futsal facilities across Nepal
- **Book Pitches**: Select date, time, and pitch for booking
- **User Authentication**: Login system with demo credentials
- **Booking Management**: View and cancel your bookings
- **Responsive Design**: Optimized for mobile devices
- **Real-time Updates**: See available time slots in real-time

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **NativeWind** for styling (Tailwind CSS for React Native)
- **React Navigation** for navigation
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Expo CLI: `npm install -g @expo/cli`
- Expo Go app on your mobile device

### Installation

1. Navigate to the mobile_native directory:
   ```bash
   cd mobile_native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your phone

## Project Structure

```
src/
├── contexts/          # React Context providers
│   ├── AuthContext.tsx
│   └── BookingContext.tsx
├── data/             # Mock data and API functions
│   └── mockData.ts
├── screens/          # Screen components
│   ├── HomeScreen.tsx
│   ├── FacilitiesScreen.tsx
│   ├── FacilityDetailsScreen.tsx
│   ├── LoginScreen.tsx
│   ├── BookingsScreen.tsx
│   ├── AboutScreen.tsx
│   └── ContactScreen.tsx
└── types/            # TypeScript type definitions
    └── index.ts
```

## Key Features

### Home Screen
- Hero section with app branding
- Featured facilities carousel
- Quick action buttons
- Welcome message for logged-in users

### Facilities Screen
- Search functionality
- Filter by location or name
- Facility cards with ratings and reviews
- Maintenance status indicators

### Facility Details Screen
- Detailed facility information
- Pitch selection with pricing
- Date picker for booking
- Time slot selection
- Booking summary and confirmation

### Booking Management
- View all user bookings
- Cancel pending bookings
- Booking status tracking
- Facility and pitch details

### Authentication
- Simple login form
- Demo credentials for testing
- User session management
- Role-based access (user/admin)

## Demo Credentials

### User Account
- Email: `johndoe@example.com`
- Password: `password`

### Admin Account
- Email: `admin@example.com`
- Password: `password`

## Development

### Running on Physical Device
1. Install Expo Go from App Store/Play Store
2. Make sure your phone and computer are on the same network
3. Run `npm start` and scan the QR code

### Running on Simulator
1. Install iOS Simulator (Mac) or Android Studio (Windows/Mac/Linux)
2. Run `npm run ios` or `npm run android`

## Customization

### Styling
The app uses NativeWind for styling. You can customize colors and themes in:
- `tailwind.config.js`
- Individual component styles using Tailwind classes

### Data
Mock data is stored in `src/data/mockData.ts`. Replace with real API calls when integrating with backend.

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA
```bash
expo build:ios
```

### Expo Application Services (EAS)
```bash
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.