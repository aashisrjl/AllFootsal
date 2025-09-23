import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { facilities } from '../data/mockData';
import { Facility } from '../types';

export default function FacilitiesScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredFacilities = facilities.filter(facility =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    facility.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderFacility = ({ item }: { item: Facility }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('FacilityDetails' as never, { facilityId: item.id } as never)}
      className="bg-white rounded-xl shadow-lg mb-4 mx-4 overflow-hidden"
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: '100%', height: 200 }}
        className="rounded-t-xl"
      />
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          {item.name}
        </Text>
        <Text className="text-gray-600 mb-2">
          📍 {item.location}
        </Text>
        <Text className="text-gray-700 mb-3" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-yellow-500 font-bold">
              ⭐ {item.rating}
            </Text>
            <Text className="text-gray-500 ml-2">
              ({item.reviews} reviews)
            </Text>
          </View>
          <Text className="text-blue-600 font-semibold">
            {item.pitches.length} pitches
          </Text>
        </View>
        {item.isUnderMaintenance && (
          <View className="mt-2 bg-red-100 p-2 rounded">
            <Text className="text-red-600 font-semibold">
              ⚠️ Under Maintenance
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white p-4 shadow-sm">
        <TextInput
          className="bg-gray-100 p-3 rounded-lg"
          placeholder="Search facilities or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Results Header */}
      <View className="px-4 py-3">
        <Text className="text-gray-600">
          {filteredFacilities.length} facilities found
        </Text>
      </View>

      {/* Facilities List */}
      <FlatList
        data={filteredFacilities}
        renderItem={renderFacility}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}