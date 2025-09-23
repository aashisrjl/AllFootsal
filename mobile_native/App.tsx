import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { BookingProvider } from './src/contexts/BookingContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import FacilitiesScreen from './src/screens/FacilitiesScreen';
import FacilityDetailsScreen from './src/screens/FacilityDetailsScreen';
import LoginScreen from './src/screens/LoginScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import AboutScreen from './src/screens/AboutScreen';
import ContactScreen from './src/screens/ContactScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#0ea5e9',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Goal Futsal Nepal' }}
            />
            <Stack.Screen 
              name="Facilities" 
              component={FacilitiesScreen} 
              options={{ title: 'Facilities' }}
            />
            <Stack.Screen 
              name="FacilityDetails" 
              component={FacilityDetailsScreen} 
              options={{ title: 'Facility Details' }}
            />
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ title: 'Login' }}
            />
            <Stack.Screen 
              name="Bookings" 
              component={BookingsScreen} 
              options={{ title: 'My Bookings' }}
            />
            <Stack.Screen 
              name="About" 
              component={AboutScreen} 
              options={{ title: 'About Us' }}
            />
            <Stack.Screen 
              name="Contact" 
              component={ContactScreen} 
              options={{ title: 'Contact Us' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BookingProvider>
    </AuthProvider>
  );
}