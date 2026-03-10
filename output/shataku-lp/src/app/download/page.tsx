import type { Metadata } from 'next';
import Header from '@/src/components/Header';
import DownloadForm from '@/src/components/DownloadForm';

export const metadata: Metadata = {
  title: '資料ダウンロード | PLEX 福利厚生社宅',
  description: 'PLEX福利厚生社宅のサービス資料をダウンロードいただけます。福利厚生社宅の概要、手取りアップの仕組み、金額メリットの概算例、導入イメージをご確認ください。',
};

export default function DownloadPage() {
  return (
    <>
      <Header variant="download" />
      <DownloadForm />
    </>
  );
}
