import Link from 'next/link';
import FadeIn from './FadeIn';

export default function FinalCtaSection() {
  return (
    <section className="final-cta" id="contact">
      <FadeIn className="inner">
        <h2>まずはお気軽にお問い合わせください</h2>
        <p>具体的な導入効果・スケジュールについて、お客様のご状況に合わせて専任担当者がご案内いたします</p>
        <div className="cta-group">
          <Link href="/download/" className="btn btn-primary">資料ダウンロード</Link>
          <Link href="/contact/" className="btn btn-outline-blue hero-contact">お問い合わせ</Link>
        </div>
      </FadeIn>
    </section>
  );
}
