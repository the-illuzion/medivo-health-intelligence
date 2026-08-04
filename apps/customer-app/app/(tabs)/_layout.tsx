import React from 'react';
import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, Sparkles, Camera, ShoppingBag, User } from 'lucide-react-native';
import { WebSidebar } from '../../src/components/navigation/WebSidebar';

export default function TabLayout() {
  return (
    <View className="flex-1 flex-row bg-surface">
      {/* Web Sidebar navigation for desktop (lg: >= 1024px) */}
      <WebSidebar />

      {/* Main App Screens Container */}
      <View className="flex-1">
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#10B981',
            tabBarInactiveTintColor: '#64748B',
            tabBarStyle: {
              backgroundColor: '#162E29',
              borderTopColor: '#2A4A43',
              borderTopWidth: 1,
              height: Platform.OS === 'ios' ? 88 : 64,
              paddingBottom: Platform.OS === 'ios' ? 28 : 10,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '600',
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="routines"
            options={{
              title: 'Routines',
              tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="scan"
            options={{
              title: 'Scan',
              tabBarIcon: ({ color, size }) => <Camera size={size + 4} color={color} />,
            }}
          />
          <Tabs.Screen
            name="products"
            options={{
              title: 'Shop',
              tabBarIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: 'Profile',
              tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}
