import React from 'react';
import { DesignFrame } from '../src/features/design-preview/components/Shell';
import { ConnectDevice } from '../src/features/design-preview/screens/Devices';

export default function ConnectDeviceScreen() {
  return (
    <DesignFrame>
      <ConnectDevice />
    </DesignFrame>
  );
}
