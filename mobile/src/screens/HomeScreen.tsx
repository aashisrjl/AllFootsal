import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { facilities } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { isAuthenticated, user } = useAuth();

  const featuredFacilities = facilities.slice(0, 3);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <LinearGradient
        colors={['#0ea5e9', '#0284c7']}
        className="px-6 py-12"
      >
        <View className="items-center">
          <Text className="text-white text-3xl font-bold text-center mb-2">
            Goal Futsal Nepal
          </Text>
          <Text className="text-blue-100 text-lg text-center mb-8">
            Book your favorite futsal pitch in seconds
          </Text>
          
          {isAuthenticated && (
            <Text className="text-white text-base mb-4">
              Welcome back, {user?.name}!
            </Text>
          )}
          
          <TouchableOpacity
            onPress={() => navigation.navigate('Facilities' as never)}
            className="bg-white px-8 py-4 rounded-full"
          >
            <Text className="text-blue-600 font-semibold text-lg">
              Explore Facilities
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Featured Facilities */}
      <View className="px-6 py-8">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Featured Facilities
        </Text>
        
        {featuredFacilities.map((facility) => (
          <TouchableOpacity
            key={facility.id}
            onPress={() => navigation.navigate('FacilityDetails' as never, { facilityId: facility.id } as never)}
            className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden"
          >
            <Image
              source={{ uri: facility.image }}
              style={{ width: '100%', height: 200 }}
              className="rounded-t-xl"
            />
            <View className="p-4">
              <Text className="text-xl font-bold text-gray-800 mb-2">
                {facility.name}
              </Text>
              <Text className="text-gray-600 mb-2">
                📍 {facility.location}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-yellow-500 font-bold">
                  ⭐ {facility.rating}
                </Text>
                <Text className="text-gray-500 ml-2">
                  ({facility.reviews} reviews)
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View className="px-6 pb-8">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          Quick Actions
        </Text>
        
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => navigation.navigate('Facilities' as never)}
            className="bg-blue-500 flex-1 mr-2 p-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-lg mb-1">
              🏟️
            </Text>
            <Text className="text-white font-semibold">
              All Facilities
            </Text>
          </TouchableOpacity>
          
          {isAuthenticated ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('Bookings' as never)}
              className="bg-green-500 flex-1 ml-2 p-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg mb-1">
                📅
              </Text>
              <Text className="text-white font-semibold">
                My Bookings
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login' as never)}
              className="bg-green-500 flex-1 ml-2 p-4 rounded-xl items-center"
            >
              <Text className="text-white font-semibold text-lg mb-1">
                🔐
              </Text>
              <Text className="text-white font-semibold">
                Login
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* About Section */}
      <View className="px-6 pb-8">
        <TouchableOpacity
          onPress={() => navigation.navigate('About' as never)}
          className="bg-gray-100 p-6 rounded-xl"
        >
          <Text className="text-xl font-bold text-gray-800 mb-2">
            About Goal Futsal Nepal
          </Text>
          <Text className="text-gray-600">
            Learn more about our mission to make futsal accessible to everyone in Nepal.
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}