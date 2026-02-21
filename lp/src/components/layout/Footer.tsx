export default function Footer() {
  return (
    <footer className="bg-dark-blue text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              <span className="text-light-blue">PLEX</span> 福利厚生社宅
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              会社負担ゼロ・初期費用0円で従業員の手取りアップと
              会社の社会保険料削減を同時に実現。
              手続きはすべて丸投げOK。
            </p>
            <p className="text-white/50 text-xs mt-3 leading-relaxed">
              株式会社プレックス
              <br />
              〒103-0021 東京都中央区日本橋本石町3-2-4
              <br />
              共同ビル(日銀前)6階
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">サービス</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#benefits" className="hover:text-white transition-colors">
                  導入メリット
                </a>
              </li>
              <li>
                <a href="#simulation" className="hover:text-white transition-colors">
                  シミュレーション
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  機能紹介
                </a>
              </li>
              <li>
                <a href="#cases" className="hover:text-white transition-colors">
                  導入事例
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">お問い合わせ</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {/* TODO: 実際のフォームURLに差し替え */}
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  資料請求
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/50">
          <p>&copy; {new Date().getFullYear()} 株式会社プレックス All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
