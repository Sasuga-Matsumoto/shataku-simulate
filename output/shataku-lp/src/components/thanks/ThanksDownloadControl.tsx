import ScheduleButton from '@/src/components/ScheduleButton';

interface ThanksDownloadControlProps {
  testId: string;
  variant: string;
}

export default function ThanksDownloadControl({ testId, variant }: ThanksDownloadControlProps) {
  return (
    <section className="thanks-section">
      <div className="thanks-inner fade-up">
        <div className="thanks-card">
          <div className="thanks-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </div>
          <h1 className="thanks-title">資料ご請求ありがとうございます</h1>
          <p className="thanks-text">フォームにご入力いただいたメールアドレス宛にサービス資料をお送りいたします。届かない場合はお手数ですが、迷惑メールフォルダをご確認ください。</p>
          <div className="thanks-divider"></div>
          <div className="thanks-next-title">オンラインでのご説明も可能です</div>
          <ScheduleButton testId={testId} variant={variant} label="日程調整はこちら" />
          <br />
          <a href="/" className="thanks-back" target="_blank" rel="noopener">&larr; トップページに戻る</a>
        </div>
      </div>
    </section>
  );
}
