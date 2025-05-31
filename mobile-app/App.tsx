import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CouponProvider } from './context/CouponContext';
import HomeScreen from './screens/HomeScreen';
import AddCouponScreen from './screens/AddCouponScreen';
import CouponDetailsScreen from './screens/CouponDetailsScreen';
import ExpirationTrackerScreen from './screens/ExpirationTrackerScreen';
import SettingsScreen from './screens/SettingsScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <CouponProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#6200ea',
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
                options={{
                  title: 'CouponKeeper',
                  headerStyle: {
                    backgroundColor: '#6200ea',
                  },
                }}
              />
              <Stack.Screen
                name="AddCoupon"
                component={AddCouponScreen}
                options={{
                  title: 'Add Coupon',
                  presentation: 'modal',
                }}
              />
              <Stack.Screen
                name="CouponDetails"
                component={CouponDetailsScreen}
                options={{
                  title: 'Coupon Details',
                }}
              />
              <Stack.Screen
                name="ExpirationTracker"
                component={ExpirationTrackerScreen}
                options={{
                  title: 'Expiration Tracker',
                }}
              />
              <Stack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                  title: 'Settings',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </CouponProvider>
      </PaperProvider>
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}