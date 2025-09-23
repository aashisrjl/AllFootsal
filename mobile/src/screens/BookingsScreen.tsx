import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { facilities, pitches } from '../data/mockData';
import { Booking } from '../types';

export default function BookingsScreen() {
  const navigation = useNavigation();
  const { user, isAuthenticated } = useAuth();
  const { userBookings, fetchUserBookings, cancelBooking } = useBooking();

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserBookings(user.id);
    }
  }, [isAuthenticated, user]);

  const handleCancelBooking = (booking: Booking) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            if (user) {
              await cancelBooking(booking.id, user.id);
            }
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderBooking = ({ item }: { item: Booking }) => {
    const facility = facilities.find(f => f.id === item.facilityId);
    const pitch = pitches.find(p => p.id === item.pitchId);

    return (
      <View className="bg-white rounded-xl shadow-sm mb-4 mx-4 p-4">
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800">
              {facility?.name}
            </Text>
            <Text className="text-gray-600">
              {pitch?.name} • {formatDate(item.date)}
            </Text>
            <Text className="text-gray-600">
              {item.startTime} - {item.endTime}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
            <Text className="text-sm font-semibold capitalize">
              {item.status}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-600">
            📍 {facility?.location}
          </Text>
          <Text className="font-bold text-blue-600">
            NPR {item.totalPrice}
          </Text>
        </View>

        <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
          <Text className="text-sm text-gray-500">
            Booked on {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          
          {item.status === 'pending' && (
            <TouchableOpacity
              onPress={() => handleCancelBooking(item)}
              className="bg-red-500 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Login Required
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          Please login to view your bookings
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login' as never)}
          className="bg-blue-500 px-8 py-4 rounded-lg"
        >
          <Text className="text-white font-semibold text-lg">
            Login
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {userBookings.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
            No Bookings Yet
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            You haven't made any bookings yet. Start by exploring our facilities!
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Facilities' as never)}
            className="bg-blue-500 px-8 py-4 rounded-lg"
          >
            <Text className="text-white font-semibold text-lg">
              Explore Facilities
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="px-4 py-3 bg-white">
            <Text className="text-gray-600">
              {userBookings.length} booking(s) found
            </Text>
          </View>
          <FlatList
            data={userBookings}
            renderItem={renderBooking}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          />
        </>
      )}
    </View>
  );
}