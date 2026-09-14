import React from 'react';
import { Tabs } from 'expo-router';
export default function DesignTabs() {
  return (
    <Tabs tabBar={() => null} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="insights" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="care" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
