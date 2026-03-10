import Link from 'next/link';
import Image from 'next/image';
import FadeIn from './FadeIn';

export default function PainSolutionSection() {
  return (
    <section className="section pain-solution" id="pain">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SOLUTION</div>
          <h2 className="section-title">こんなお悩みありませんか？</h2>
        </FadeIn>

        <FadeIn>
          <div className="pain-cards">
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>賃上げ圧力が高まっているが<br />原資が限られている</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>せっかく採用した人材が<br />好待遇の企業に転職してしまう</p>
            </div>
            <div className="pain-card">
              <div className="pain-icon">!</div>
              <p>福利厚生を強化したいが<br />何から始めればいいか分からない</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn>
          <div className="solution-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12l7 7 7-7" /></svg>
          </div>
        </FadeIn>

        <FadeIn className="section-center">
          <h3 className="section-title" style={{ fontSize: '1.3rem' }}>福利厚生社宅のお悩みをPLEXが解決します！</h3>
        </FadeIn>

        <FadeIn>
          <div className="solution-cards">
            <div className="solution-card">
              <div className="solution-num">01</div>
              <h4>給料を上げずに手取りアップ<br />社会保険の仕組みを活用</h4>
              <Image src="/solution_01.jpg" alt="手取りアップ" className="solution-card-icon" width={800} height={600} />
              <p>給与の一部を社宅提供に切り替えることで、社会保険料・税金の負担を軽減し、実質的な手取りをアップさせます。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">02</div>
              <h4>福利厚生の充実で定着率向上<br />離職率を1/3に改善</h4>
              <Image src="/solution_02.jpg" alt="定着率向上" className="solution-card-icon" width={800} height={600} />
              <p>従業員の実質手取りが年間20万〜50万円アップ。目に見える待遇改善で離職を防ぎます。</p>
            </div>
            <div className="solution-card">
              <div className="solution-num">03</div>
              <h4>手続きはすべてお任せ<br />最短1週間で導入</h4>
              <Image src="/solution_03.jpg" alt="最短1週間で導入" className="solution-card-icon" width={800} height={600} />
              <p>名義変更から社宅規定の整備まで、導入に必要な手続きはすべてPLEXが代行。担当者の負担はほぼゼロです。</p>
            </div>
          </div>
        </FadeIn>

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
