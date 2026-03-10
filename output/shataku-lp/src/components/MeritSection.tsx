import Link from 'next/link';
import Image from 'next/image';
import FadeIn from './FadeIn';

export default function MeritSection() {
  return (
    <section className="section merit" id="merit">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">MERIT</div>
          <h2 className="section-title">従業員にも会社にも大きなメリット</h2>
        </FadeIn>

        <div className="merit-grid" style={{ marginTop: '36px' }}>
          <FadeIn delay={1}>
            <div className="merit-block-label">従業員のメリット</div>
            <div className="merit-card card-employee">
              <h3>社宅の仕組みで従業員は手取りアップ。<br />会社は実質無料で導入可能！</h3>
              <p>福利厚生の中でも人気の高い「社宅」の仕組みを活用。社員の個人契約の賃貸を法人名義に切り替えるだけで、引越し不要で手取りが年間20万〜50万円アップします。</p>
              <Image src="/merit_1.png" alt="借上社宅の利用で実質の年収が5〜10%UP" width={1920} height={1440} loading="lazy" />
            </div>
          </FadeIn>
          <FadeIn delay={2}>
            <div className="merit-block-label">会社のメリット</div>
            <div className="merit-card card-company">
              <h3>PLEX福利厚生社宅の導入で<br />離職率改善！</h3>
              <p>福利厚生社宅を導入することで、離職率は1/3程度への低下が期待でき、採用面でも良い影響が期待できます。また、社会保険料のコスト削減も。</p>
              <Image src="/merit_2.png" alt="制度利用者の離職率は平均の1/3（13.3%→4.3%）" width={1920} height={1440} loading="lazy" />
            </div>
          </FadeIn>
        </div>

        <FadeIn className="mid-cta">
          <div className="cta-group">
            <Link href="/download/" className="btn btn-primary">資料ダウンロード</Link>
            <Link href="/contact/" className="btn btn-outline-blue">お問い合わせ</Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
