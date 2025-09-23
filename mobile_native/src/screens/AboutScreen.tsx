import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function AboutScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <LinearGradient
        colors={['#0ea5e9', '#0284c7']}
        className="px-6 py-12"
      >
        <Text className="text-white text-3xl font-bold text-center mb-4">
          About Goal Futsal Nepal
        </Text>
        <Text className="text-blue-100 text-center text-lg">
          Your trusted partner for futsal bookings across Nepal
        </Text>
      </LinearGradient>

      {/* Mission Section */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Our Mission
        </Text>
        <Text className="text-gray-700 leading-6 mb-4">
          At Goal Futsal Nepal, we're passionate about making futsal accessible to everyone. 
          Our platform connects players with the best futsal facilities across Nepal, 
          making it easier than ever to book your favorite pitch.
        </Text>
        <Text className="text-gray-700 leading-6">
          Whether you're a casual player or a competitive team, we have the perfect 
          facilities to match your needs.
        </Text>
      </View>

      {/* Features Section */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Why Choose Us?
        </Text>
        
        <View className="space-y-4">
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">🏟️</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">
                Quality Facilities
              </Text>
              <Text className="text-gray-600">
                Partnered with the best futsal facilities across Nepal
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">📱</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">
                Easy Booking
              </Text>
              <Text className="text-gray-600">
                Book your pitch in just a few taps, anytime, anywhere
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">💰</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">
                Transparent Pricing
              </Text>
              <Text className="text-gray-600">
                No hidden fees, see exactly what you're paying for
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-start">
            <Text className="text-2xl mr-3">⭐</Text>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800 mb-1">
                Trusted Reviews
              </Text>
              <Text className="text-gray-600">
                Real reviews from real players to help you choose
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Section */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Our Impact
        </Text>
        
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-3xl font-bold text-blue-600">50+</Text>
            <Text className="text-gray-600 text-center">Facilities</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-bold text-blue-600">1000+</Text>
            <Text className="text-gray-600 text-center">Happy Users</Text>
          </View>
          <View className="items-center">
            <Text className="text-3xl font-bold text-blue-600">5000+</Text>
            <Text className="text-gray-600 text-center">Bookings</Text>
          </View>
        </View>
      </View>

      {/* Contact CTA */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">
          Have Questions?
        </Text>
        <Text className="text-gray-600 text-center mb-4">
          We're here to help! Get in touch with our friendly team.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Contact' as never)}
          className="bg-blue-500 p-4 rounded-lg"
        >
          <Text className="text-white font-bold text-center">
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>

      {/* Team Section */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Our Team
        </Text>
        <Text className="text-gray-700 leading-6">
          Goal Futsal Nepal is built by a passionate team of futsal enthusiasts 
          and technology experts based in Kathmandu. We understand the challenges 
          of finding and booking quality futsal facilities, and we're committed 
          to making the process as smooth as possible.
        </Text>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}