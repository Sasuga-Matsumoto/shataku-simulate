'use client';
import { useState, useRef, useCallback } from 'react';
import FadeIn from './FadeIn';

const faqs = [
  { q: 'Q. 社宅導入時に社会保険料はどれぐらい削減できますか？', a: '条件によりますが、月給30万円・家賃8万円の場合、1人あたり年間約1〜2万円の企業側社会保険料の削減が見込めます。' },
  { q: 'Q. 従業員の手取りはどれぐらい増えますか？', a: '月給30万円の場合、年間約17〜18万円程度の手取り向上が見込めます。給与額や家賃によって変動します。' },
  { q: 'Q. 今住んでいる家を社宅にできますか？', a: 'はい、現在お住まいの賃貸物件を個人名義から法人名義に変更して借上社宅とすることが可能です。引越しは不要です。' },
  { q: 'Q. 会社が家賃を負担する必要がありますか？', a: '会社が追加で家賃を支払う必要はありません。従業員の給与の一部を現物支給（社宅提供）に切り替える仕組みのため、会社の実質的な追加コストはゼロです。' },
  { q: 'Q. 導入にどれくらい時間がかかりますか？', a: '最短1週間で導入可能です。規定の作成から名義変更手続きまで、PLEXがすべてサポートいたします。' },
];

export default function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = useCallback((i: number) => {
    setActiveIndex(prev => prev === i ? null : i);
  }, []);

  return (
    <section className="section faq" id="faq">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">FAQ</div>
          <h2 className="section-title">よくあるご質問</h2>
        </FadeIn>

        <FadeIn>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className={`faq-item${activeIndex === i ? ' active' : ''}`}>
                <button
                  className="faq-question"
                  aria-expanded={activeIndex === i}
                  aria-controls={`faq-a${i + 1}`}
                  onClick={() => toggle(i)}
                >
                  {faq.q}
                </button>
                <div
                  className="faq-answer"
                  id={`faq-a${i + 1}`}
                  role="region"
                  ref={el => { answerRefs.current[i] = el; }}
                  style={{ maxHeight: activeIndex === i ? `${answerRefs.current[i]?.scrollHeight || 200}px` : '0' }}
                >
                  <div className="faq-answer-inner">{faq.a}</div>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
