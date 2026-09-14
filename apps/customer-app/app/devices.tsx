import React from 'react';
import { DesignFrame } from '../src/features/design-preview/components/Shell';
import Devices from '../src/features/design-preview/screens/Devices';

export default function DevicesScreen() {
  return (
    <DesignFrame>
      <Devices />
    </DesignFrame>
  );
}
