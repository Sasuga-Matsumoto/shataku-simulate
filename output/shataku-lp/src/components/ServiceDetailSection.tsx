import Link from 'next/link';
import Image from 'next/image';
import FadeIn from './FadeIn';

const services = [
  { num: '01', title: '社内規程の整備', img: '/service_01.jpg', desc: '制度導入に必要な規程類をパッケージでご提供。専門知識は不要。', delay: 0 },
  { num: '02', title: '従業員説明会', img: '/service_02.jpg', desc: '制度説明の場を設け、メリットや注意事項を従業員に直接ご説明。', delay: 1 },
  { num: '03', title: '従業員対応', img: '/service_03.jpg', desc: '従業員からの利用申請はLINEで簡単に。書類提出もスマホで完結。', delay: 2 },
  { num: '04', title: '契約手続き', img: '/service_04.jpg', desc: '個人契約から法人名義への切り替えをすべて代行。引越し不要。', delay: 0 },
  { num: '05', title: '更新・退去手続き', img: '/service_05.jpg', desc: '契約更新や退去時の手続きもPLEXが代行。管理業務の負担ゼロ。', delay: 1 },
  { num: '06', title: '給与計算・家賃支払い', img: '/service_06.jpg', desc: '社宅控除の給与天引き設定をご案内。毎月の家賃支払いもサポート。', delay: 2 },
];

export default function ServiceDetailSection() {
  return (
    <section className="section service-detail" id="service">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SERVICE</div>
          <h2 className="section-title">導入から運用まで、すべてお任せください</h2>
          <p className="section-desc">申請から契約手続き、従業員説明まで、面倒な作業はすべてPLEXが代行します。</p>
        </FadeIn>

        <div className="service-grid">
          {services.map((s) => (
            <FadeIn key={s.num} delay={s.delay}>
              <div className="service-card">
                <div className="service-card-num">{s.num}</div>
                <h4>{s.title}</h4>
                <Image src={s.img} alt={s.title} className="service-card-icon" width={800} height={600} />
                <p>{s.desc}</p>
              </div>
            </FadeIn>
          ))}
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
