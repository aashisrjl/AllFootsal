import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { facilities, pitches } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { Pitch, TimeSlot } from '../types';

export default function FacilityDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { facilityId } = route.params as { facilityId: string };
  const { isAuthenticated, user } = useAuth();
  const {
    selectedDate,
    selectedPitchId,
    selectedTimeSlotId,
    availableTimeSlots,
    setSelectedDate,
    setSelectedPitchId,
    selectTimeSlot,
    fetchAvailableTimeSlots,
    createBooking,
  } = useBooking();

  const facility = facilities.find(f => f.id === facilityId);
  const facilityPitches = pitches.filter(p => p.facilityId === facilityId);
  const selectedPitch = facilityPitches.find(p => p.id === selectedPitchId);

  useEffect(() => {
    if (selectedPitchId && selectedDate) {
      fetchAvailableTimeSlots(selectedPitchId, selectedDate);
    }
  }, [selectedPitchId, selectedDate]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to make a booking.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login' as never) }
        ]
      );
      return;
    }

    if (!selectedPitch || !user) {
      Alert.alert('Error', 'Please select a pitch and time slot.');
      return;
    }

    const booking = await createBooking(
      user.id,
      facilityId,
      selectedPitch.pricePerHour
    );

    if (booking) {
      Alert.alert(
        'Booking Successful!',
        `Your booking for ${facility?.name} - ${selectedPitch.name} has been created.`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNextSevenDays = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (!facility) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Facility not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Facility Image */}
      <Image
        source={{ uri: facility.image }}
        style={{ width: '100%', height: 250 }}
      />

      {/* Facility Info */}
      <View className="bg-white p-6 -mt-6 rounded-t-3xl">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {facility.name}
        </Text>
        <Text className="text-gray-600 mb-4">
          📍 {facility.location}
        </Text>
        <View className="flex-row items-center mb-4">
          <Text className="text-yellow-500 font-bold text-lg">
            ⭐ {facility.rating}
          </Text>
          <Text className="text-gray-500 ml-2">
            ({facility.reviews} reviews)
          </Text>
        </View>
        <Text className="text-gray-700 leading-6 mb-6">
          {facility.description}
        </Text>

        {facility.isUnderMaintenance && (
          <View className="bg-red-100 p-4 rounded-lg mb-6">
            <Text className="text-red-600 font-semibold mb-1">
              ⚠️ Under Maintenance
            </Text>
            <Text className="text-red-600">
              {facility.maintenanceReason || 'This facility is currently under maintenance.'}
            </Text>
          </View>
        )}
      </View>

      {/* Pitches Selection */}
      <View className="bg-white mx-4 my-4 p-6 rounded-xl shadow-sm">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Select a Pitch
        </Text>
        {facilityPitches.map((pitch) => (
          <TouchableOpacity
            key={pitch.id}
            onPress={() => setSelectedPitchId(pitch.id)}
            className={`p-4 rounded-lg mb-3 border-2 ${
              selectedPitchId === pitch.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <View className="flex-row justify-between items-center">
              <Text className="font-semibold text-gray-800">
                {pitch.name}
              </Text>
              <Text className="text-blue-600 font-bold">
                NPR {pitch.pricePerHour}/hr
              </Text>
            </View>
            {pitch.isUnderMaintenance && (
              <Text className="text-red-500 text-sm mt-1">
                ⚠️ Under maintenance
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Selection */}
      {selectedPitchId && (
        <View className="bg-white mx-4 my-4 p-6 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Select Date
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {getNextSevenDays().map((date) => (
              <TouchableOpacity
                key={date}
                onPress={() => setSelectedDate(date)}
                className={`p-3 rounded-lg mr-3 min-w-[80px] items-center ${
                  selectedDate === date
                    ? 'bg-blue-500'
                    : 'bg-gray-100'
                }`}
              >
                <Text className={`font-semibold ${
                  selectedDate === date ? 'text-white' : 'text-gray-700'
                }`}>
                  {formatDate(date)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Time Slots */}
      {selectedPitchId && selectedDate && (
        <View className="bg-white mx-4 my-4 p-6 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Available Time Slots
          </Text>
          {availableTimeSlots.length === 0 ? (
            <Text className="text-gray-500 text-center py-4">
              No available time slots for this date
            </Text>
          ) : (
            <View className="flex-row flex-wrap">
              {availableTimeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => selectTimeSlot(slot.id)}
                  className={`p-3 rounded-lg m-1 ${
                    selectedTimeSlotId === slot.id
                      ? 'bg-blue-500'
                      : 'bg-gray-100'
                  }`}
                >
                  <Text className={`font-semibold ${
                    selectedTimeSlotId === slot.id ? 'text-white' : 'text-gray-700'
                  }`}>
                    {slot.startTime} - {slot.endTime}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Booking Summary */}
      {selectedPitchId && selectedTimeSlotId && selectedPitch && (
        <View className="bg-white mx-4 my-4 p-6 rounded-xl shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Booking Summary
          </Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Facility:</Text>
              <Text className="font-semibold">{facility.name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Pitch:</Text>
              <Text className="font-semibold">{selectedPitch.name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Date:</Text>
              <Text className="font-semibold">{formatDate(selectedDate)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Time:</Text>
              <Text className="font-semibold">
                {availableTimeSlots.find(s => s.id === selectedTimeSlotId)?.startTime} - 
                {availableTimeSlots.find(s => s.id === selectedTimeSlotId)?.endTime}
              </Text>
            </View>
            <View className="flex-row justify-between border-t pt-2">
              <Text className="text-gray-600 font-bold">Total:</Text>
              <Text className="font-bold text-blue-600 text-lg">
                NPR {selectedPitch.pricePerHour}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleBooking}
            className="bg-blue-500 p-4 rounded-lg mt-6"
          >
            <Text className="text-white font-bold text-center text-lg">
              {isAuthenticated ? 'Book Now' : 'Login to Book'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}