'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface ABTestTrackerProps {
  testId: string;
  variant: string;
}

export default function ABTestTracker({ testId, variant }: ABTestTrackerProps) {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'ab_test_impression',
      ab_test_name: testId,
      ab_test_variant: variant,
    });
  }, [testId, variant]);

  return null;
}
