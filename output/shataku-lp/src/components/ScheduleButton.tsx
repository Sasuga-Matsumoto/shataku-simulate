'use client';

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface ScheduleButtonProps {
  testId: string;
  variant: string;
  label: string;
  className?: string;
}

export default function ScheduleButton({
  testId,
  variant,
  label,
  className,
}: ScheduleButtonProps) {
  const handleClick = () => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'ab_test_conversion',
      ab_test_name: testId,
      ab_test_variant: variant,
    });
  };

  return (
    <a
      href="https://calendar.app.google/engNqwccyxSXtCs66"
      target="_blank"
      rel="noopener noreferrer"
      className={className || 'thanks-cta'}
      onClick={handleClick}
    >
      {label}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
    </a>
  );
}
