import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ContactScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Message Sent!',
      'Thank you for reaching out. We will get back to you soon.',
      [
        {
          text: 'OK',
          onPress: () => {
            setName('');
            setEmail('');
            setMessage('');
          }
        }
      ]
    );
  };

  const openEmail = () => {
    Linking.openURL('mailto:info@goalfutsalnepal.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+977-01-1234567');
  };

  const openWhatsApp = () => {
    Linking.openURL('https://wa.me/9779876543210');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <LinearGradient
        colors={['#0ea5e9', '#0284c7']}
        className="px-6 py-12"
      >
        <Text className="text-white text-3xl font-bold text-center mb-4">
          Contact Us
        </Text>
        <Text className="text-blue-100 text-center text-lg">
          We'd love to hear from you
        </Text>
      </LinearGradient>

      {/* Contact Info */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Get in Touch
        </Text>
        
        <TouchableOpacity
          onPress={openEmail}
          className="flex-row items-center p-4 bg-gray-50 rounded-lg mb-3"
        >
          <Text className="text-2xl mr-4">📧</Text>
          <View>
            <Text className="font-semibold text-gray-800">Email</Text>
            <Text className="text-blue-600">info@goalfutsalnepal.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openPhone}
          className="flex-row items-center p-4 bg-gray-50 rounded-lg mb-3"
        >
          <Text className="text-2xl mr-4">📞</Text>
          <View>
            <Text className="font-semibold text-gray-800">Phone</Text>
            <Text className="text-blue-600">+977-01-1234567</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={openWhatsApp}
          className="flex-row items-center p-4 bg-gray-50 rounded-lg mb-3"
        >
          <Text className="text-2xl mr-4">💬</Text>
          <View>
            <Text className="font-semibold text-gray-800">WhatsApp</Text>
            <Text className="text-blue-600">+977-9876543210</Text>
          </View>
        </TouchableOpacity>

        <View className="flex-row items-center p-4 bg-gray-50 rounded-lg">
          <Text className="text-2xl mr-4">📍</Text>
          <View>
            <Text className="font-semibold text-gray-800">Address</Text>
            <Text className="text-gray-600">
              Kathmandu, Nepal{'\n'}
              New Baneshwor, Ward No. 10
            </Text>
          </View>
        </View>
      </View>

      {/* Contact Form */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Send us a Message
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Name</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-lg"
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-lg"
              placeholder="Your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-2">Message</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-lg"
              placeholder="How can we help you?"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-500 p-4 rounded-lg mt-4"
          >
            <Text className="text-white font-bold text-center text-lg">
              Send Message
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Business Hours */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Business Hours
        </Text>
        
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Monday - Friday</Text>
            <Text className="font-semibold">9:00 AM - 8:00 PM</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Saturday</Text>
            <Text className="font-semibold">10:00 AM - 6:00 PM</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-700">Sunday</Text>
            <Text className="font-semibold">Closed</Text>
          </View>
        </View>
      </View>

      {/* FAQ Section */}
      <View className="bg-white mx-4 my-6 p-6 rounded-xl shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Frequently Asked Questions
        </Text>
        
        <View className="space-y-4">
          <View>
            <Text className="font-semibold text-gray-800 mb-2">
              How do I cancel a booking?
            </Text>
            <Text className="text-gray-600">
              You can cancel your booking from the "My Bookings" section in the app. 
              Cancellations are free up to 2 hours before your booking time.
            </Text>
          </View>
          
          <View>
            <Text className="font-semibold text-gray-800 mb-2">
              Can I modify my booking?
            </Text>
            <Text className="text-gray-600">
              Currently, you need to cancel your existing booking and make a new one. 
              We're working on a modification feature.
            </Text>
          </View>
          
          <View>
            <Text className="font-semibold text-gray-800 mb-2">
              What payment methods do you accept?
            </Text>
            <Text className="text-gray-600">
              We accept cash payments at the facility. Online payment options 
              will be available soon.
            </Text>
          </View>
        </View>
      </View>

      <View className="h-6" />
    </ScrollView>
  );
}