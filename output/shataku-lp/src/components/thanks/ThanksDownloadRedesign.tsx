import ScheduleButton from '@/src/components/ScheduleButton';

interface ThanksDownloadRedesignProps {
  testId: string;
  variant: string;
}

export default function ThanksDownloadRedesign({ testId, variant }: ThanksDownloadRedesignProps) {
  return (
    <section className="thanks-section">
      <div className="thanks-inner fade-up">
        <div className="thanks-card">
          <div className="thanks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>

          <h1 className="thanks-title">資料をお送りしました</h1>

          <p className="thanks-message">PLEX福利厚生社宅は、社会保険料を最適化し、<br />従業員の手取りを<strong>年間15〜33万円アップ</strong>させるサービスです。</p>

          <div className="thanks-schedule">
            <p className="thanks-schedule-text">30分程度のオンライン説明で、サービスの全体像をお伝えします</p>
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

          <div className="thanks-notice">
            <div className="thanks-notice-item">
              <span className="thanks-notice-icon">&#x1F4E9;</span>
              <span>フォームにご入力いただいたメールアドレス宛にサービス資料をお送りしています。届かない場合はお手数ですが、迷惑メールフォルダをご確認ください。</span>
            </div>
            <div className="thanks-notice-item">
              <span className="thanks-notice-icon">&#x1F4DE;</span>
              <span>翌営業日に担当者からお電話いたします。サービスについてのご質問もお気軽にどうぞ。</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
