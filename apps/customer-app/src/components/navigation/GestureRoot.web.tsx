import React from 'react';
import { View } from 'react-native';

export const GestureRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <View style={{ flex: 1 }}>{children}</View>;
};
