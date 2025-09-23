import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (success) {
      navigation.goBack();
    }
  };

  const fillDemoCredentials = (userType: 'user' | 'admin') => {
    if (userType === 'user') {
      setEmail('johndoe@example.com');
      setPassword('password');
    } else {
      setEmail('admin@example.com');
      setPassword('password');
    }
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 justify-center">
      <View className="bg-white p-8 rounded-xl shadow-lg">
        <Text className="text-3xl font-bold text-center text-gray-800 mb-8">
          Welcome Back
        </Text>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-semibold mb-2">Email</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-lg"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="text-gray-700 font-semibold mb-2">Password</Text>
            <TextInput
              className="bg-gray-100 p-4 rounded-lg"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className="bg-blue-500 p-4 rounded-lg mt-6"
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-center text-lg">
                Login
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Demo Credentials */}
        <View className="mt-8 border-t pt-6">
          <Text className="text-gray-600 text-center mb-4">
            Demo Credentials
          </Text>
          <View className="flex-row justify-between space-x-2">
            <TouchableOpacity
              onPress={() => fillDemoCredentials('user')}
              className="bg-green-100 px-4 py-2 rounded-lg flex-1 mr-2"
            >
              <Text className="text-green-700 text-center font-semibold">
                User Demo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => fillDemoCredentials('admin')}
              className="bg-purple-100 px-4 py-2 rounded-lg flex-1 ml-2"
            >
              <Text className="text-purple-700 text-center font-semibold">
                Admin Demo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}