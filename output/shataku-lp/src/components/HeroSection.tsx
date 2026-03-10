import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-glow"></div>
      <div className="inner">
        <div className="hero-label">PLEX EMPLOYEE BENEFITS</div>
        <h1 className="hero-title">企業負担ゼロで従業員の手取りを増やす<br />新しい福利厚生</h1>
        <div className="hero-sub-pitch">
          <span>初期費用 0円</span>
          <span>手間なし</span>
          <span>1週間で導入可能</span>
        </div>
        <div className="cta-group">
          <Link href="/download/" className="btn btn-primary">資料ダウンロード</Link>
          <Link href="/contact/" className="btn btn-outline-blue hero-contact">お問い合わせ</Link>
        </div>
      </div>
    </section>
  );
}
