import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const GestureRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>;
};
