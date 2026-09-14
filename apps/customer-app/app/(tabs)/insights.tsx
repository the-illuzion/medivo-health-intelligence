import React from 'react';
import { DesignFrame } from '../../src/features/design-preview/components/Shell';
import Metrics from '../../src/features/design-preview/screens/Metrics';

export default function InsightsScreen() {
  return (
    <DesignFrame>
      <Metrics />
    </DesignFrame>
  );
}
