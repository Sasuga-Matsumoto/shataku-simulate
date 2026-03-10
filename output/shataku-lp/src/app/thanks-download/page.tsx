import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import { getVariant } from '@/src/lib/get-variant';
import ABTestTracker from '@/src/components/ABTestTracker';
import ThanksDownloadControl from '@/src/components/thanks/ThanksDownloadControl';
import ThanksDownloadRedesign from '@/src/components/thanks/ThanksDownloadRedesign';

export const metadata: Metadata = {
  title: '資料をお送りしました | PLEX 福利厚生社宅',
  robots: 'noindex, nofollow',
};

export default async function ThanksDownloadPage() {
  const variant = await getVariant('thanks-page');
  return (
    <>
      <Header variant="thanks-download" />
      <ABTestTracker testId="thanks-page" variant={variant} />
      {variant === 'control'
        ? <ThanksDownloadControl testId="thanks-page" variant={variant} />
        : <ThanksDownloadRedesign testId="thanks-page" variant={variant} />}
    </>
  );
}
