import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import { getVariant } from '@/src/lib/get-variant';
import ABTestTracker from '@/src/components/ABTestTracker';
import ThanksContactControl from '@/src/components/thanks/ThanksContactControl';
import ThanksContactRedesign from '@/src/components/thanks/ThanksContactRedesign';

export const metadata: Metadata = {
  title: 'お問い合わせありがとうございます | PLEX 福利厚生社宅',
  robots: 'noindex, nofollow',
};

export default async function ThanksContactPage() {
  const variant = await getVariant('thanks-page');
  return (
    <>
      <Header variant="thanks-contact" />
      <ABTestTracker testId="thanks-page" variant={variant} />
      {variant === 'control'
        ? <ThanksContactControl testId="thanks-page" variant={variant} />
        : <ThanksContactRedesign testId="thanks-page" variant={variant} />}
    </>
  );
}
