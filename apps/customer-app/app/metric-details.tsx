import React from 'react';
import { DesignFrame } from '../src/features/design-preview/components/Shell';
import { MetricDetails } from '../src/features/design-preview/screens/Metrics';

export default function MetricDetailsScreen() {
  return (
    <DesignFrame>
      <MetricDetails />
    </DesignFrame>
  );
}
