import ScheduleButton from '@/src/components/ScheduleButton';

interface ThanksContactRedesignProps {
  testId: string;
  variant: string;
}

export default function ThanksContactRedesign({ testId, variant }: ThanksContactRedesignProps) {
  return (
    <section className="thanks-section">
      <div className="thanks-inner fade-up">
        <div className="thanks-card">
          <div className="thanks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>

          <h1 className="thanks-title">お問い合わせありがとうございます</h1>

          <p className="thanks-message">PLEX福利厚生社宅は、社会保険料を最適化し、<br />従業員の手取りを<strong>年間15〜33万円アップ</strong>させるサービスです。</p>

          <div className="thanks-schedule">
            <p className="thanks-schedule-text">お問い合わせ内容を踏まえて、30分程度でご説明します</p>
            <ScheduleButton testId={testId} variant={variant} label="空き日程を見る" />
          </div>

          <div className="thanks-divider"></div>

          <div className="thanks-features">
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">0<span style={{ fontSize: '0.9rem' }}>円</span></div>
              <div className="thanks-feature-label">初期費用</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number">5~10<span style={{ fontSize: '0.9rem' }}>分</span></div>
              <div className="thanks-feature-label">月の運用工数</div>
            </div>
            <div className="thanks-feature-item">
              <div className="thanks-feature-number"><span style={{ fontSize: '0.9rem' }}>最短</span>1<span style={{ fontSize: '0.9rem' }}>週間</span></div>
              <div className="thanks-feature-label">導入完了</div>
            </div>
          </div>

          <div className="thanks-divider"></div>

          <div className="thanks-steps">
            <div className="thanks-steps-label">Next Steps</div>
            <div className="thanks-step">
              <div className="thanks-step-num">1</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">お電話でヒアリング</div>
                <div className="thanks-step-desc">翌営業日</div>
              </div>
            </div>
            <div className="thanks-step">
              <div className="thanks-step-num">2</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">30分程度のオンライン説明</div>
                <div className="thanks-step-desc">サービスの全体像をご案内</div>
              </div>
            </div>
            <div className="thanks-step">
              <div className="thanks-step-num">3</div>
              <div className="thanks-step-content">
                <div className="thanks-step-title">導入サポート</div>
                <div className="thanks-step-desc">最短1週間で運用開始</div>
              </div>
            </div>
          </div>

          <div className="thanks-notice">
            <div className="thanks-notice-item">
              <span className="thanks-notice-icon">&#x1F4DE;</span>
              <span>翌営業日に担当者からお電話いたします。お問い合わせ内容について詳しくご案内いたします。</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
