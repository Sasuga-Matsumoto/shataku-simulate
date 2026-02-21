'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ─── Simulation data ────────────────────────────────────────────────
const SIM_DATA: Record<number, { rent: number; employee: number; company: number }> = {
  30: { rent: 8, employee: 17.5, company: 10.6 },
  40: { rent: 11, employee: 28.7, company: 15.9 },
  50: { rent: 14, employee: 38.4, company: 21.1 },
  60: { rent: 16, employee: 53.1, company: 21.2 },
  70: { rent: 18, employee: 63.3, company: 19.8 },
  80: { rent: 20, employee: 65.2, company: 16.6 },
}
const SERVICE_COST_MONTHLY = 8900 // per user per month

// ─── FAQ data ────────────────────────────────────────────────────────
const FAQS = [
  {
    q: '現在の賃貸物件のまま借上社宅にできますか？',
    a: 'はい、引越しは不要です。現在お住まいの物件をそのままPLEXの借上社宅制度に切り替えることができます。手続きは全てPLEXが代行しますので、従業員の方にご負担はほとんどありません。',
  },
  {
    q: '「実質無料」とはどういう意味ですか？',
    a: '借上社宅制度を導入することで、会社・従業員双方の社会保険料が削減されます。この削減額がPLEXのサービス費用（月額8,900円/利用者）を上回るケースがほとんどのため、実質無料と表現しています。詳しくはシミュレーションページをご覧ください。',
  },
  {
    q: '導入までどれくらい時間がかかりますか？',
    a: '契約から最短2ヶ月で運用開始が可能です。制度設計・規程整備・従業員説明会・物件名義変更手続きまで、PLEXが一気通貫でサポートします。',
  },
  {
    q: '税務上・社会保険上のリスクはありませんか？',
    a: '税務署・年金事務所への個別照会を済ませており、制度の適法性を確認済みです。社労士・税理士と連携したサポート体制ですので、専門知識がなくても安心してご導入いただけます。',
  },
  {
    q: '何名から導入できますか？',
    a: '1名から導入可能です。スタートアップから大企業まで、規模を問わずご利用いただけます。まずはお気軽にご相談ください。',
  },
  {
    q: '既存の住宅手当と併用できますか？',
    a: '既存の住宅手当は廃止または見直しが必要な場合があります。ただし、借上社宅制度の方が従業員・会社双方にとって経済的メリットが大きいケースがほとんどです。詳細はご相談の上、最適な設計をご提案します。',
  },
  {
    q: '退去・解約時の手続きはどうなりますか？',
    a: '退去・解約手続きも全てPLEXが代行します。契約更新の交渉から退去立会い・原状回復対応まで対応しますので、担当者の工数はほぼゼロです。',
  },
]

// ─── Case Studies ────────────────────────────────────────────────────
const CASES = [
  {
    company: 'IT系スタートアップ',
    size: '社員数 50〜100名',
    before: '「社宅制度は大手しか使えないとあきらめていた」',
    after: '採用内定承諾率が向上。社員の手取りが実際に上がったと好評',
    metric: '内定承諾率 +18%',
    color: 'from-blue-500 to-blue-700',
  },
  {
    company: '物流・製造業',
    size: '社員数 約200名',
    before: '「離職率が高く、採用してもすぐ辞めてしまう」',
    after: '借上社宅制度導入後、1年で離職率が1/3に改善',
    metric: '離職率 1/3に改善',
    color: 'from-green-500 to-green-700',
  },
  {
    company: 'コンサル・HR系成長企業',
    size: '社員数 約150名',
    before: '「競合と給与が同じで差別化できなかった」',
    after: '採用条件の競争力が上がり、採用人数が1.5倍に',
    metric: '採用人数 1.5倍',
    color: 'from-orange-500 to-orange-600',
  },
]

// ─── Features ────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '📋',
    title: '制度設計支援',
    desc: '社宅規程・賃金規定・労使協定の制定を全サポート。専門家が貴社に最適な制度を設計します。',
  },
  {
    icon: '🎤',
    title: '従業員説明会',
    desc: 'PLEXがオンライン・オフラインで従業員向け説明会を実施。制度浸透をサポートします。',
  },
  {
    icon: '🏠',
    title: '物件名義変更代行',
    desc: '法人契約への名義変更手続きを一式代行。従業員・担当者の手続き負担をゼロにします。',
  },
  {
    icon: '☁️',
    title: 'クラウド物件管理',
    desc: '入居者・家賃・契約書を一元管理。いつでもどこでも物件状況を確認できます。',
  },
  {
    icon: '📊',
    title: '月変提出サポート',
    desc: '社労士が年金事務所への随時改定届出を代行。複雑な手続きも全て対応します。',
  },
  {
    icon: '🔄',
    title: '退去・更新対応',
    desc: '契約更新の交渉から退去手続きまで全対応。担当者の工数はほぼゼロです。',
  },
]

// ─── Benefits ────────────────────────────────────────────────────────
const EMPLOYEE_BENEFITS = [
  { icon: '💰', text: '社宅の仕組みで手取りアップ（年間最大65万円以上）' },
  { icon: '🎁', text: '会社は実質無料で導入可能（社保削減 > サービス費）' },
  { icon: '🏡', text: '引越し不要。今の物件のまま利用OK' },
  { icon: '🔍', text: '新規入居時は好きな物件を自由に選択' },
]

const COMPANY_BENEFITS = [
  { icon: '📉', text: '離職率が1/3に改善（PLEX自社データ）' },
  { icon: '📈', text: '採用人数が1.5倍に（PLEX自社データ）' },
  { icon: '🤝', text: '社会保険料の会社負担を大幅削減' },
  { icon: '✅', text: '実質無料（社保削減額 > 月額コスト）' },
]

// ─── Comparison table ────────────────────────────────────────────────
const COMPARE_ROWS = [
  { label: '制度設計支援', a: '✕', b: '△ 別途費用', plex: '✓ 無料' },
  { label: '従業員説明会', a: '✕', b: '✕', plex: '✓ 代行' },
  { label: '名義変更代行', a: '△ 一部', b: '△ 一部', plex: '✓ 全代行' },
  { label: '月変届出サポート', a: '✕', b: '△ 別途費用', plex: '✓ 社労士対応' },
  { label: '退去・更新対応', a: '△ 一部', b: '△ 一部', plex: '✓ 全対応' },
  { label: '税務署・年金照会済み', a: '✕', b: '△', plex: '✓ 個別照会済' },
  { label: '経済的メリット水準', a: '標準', b: '標準', plex: '業界最大' },
]

// ─── Component ───────────────────────────────────────────────────────
export default function Home() {
  const [salary, setSalary] = useState<number>(40)
  const [users, setUsers] = useState<number>(20)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [scrolled, setScrolled] = useState<boolean>(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const sim = SIM_DATA[salary]
  const totalEmployeeGain = sim.employee * users
  const totalCompanyGain = sim.company * users
  const totalServiceCost = (SERVICE_COST_MONTHLY * users * 12) / 10000
  const netBenefit = totalCompanyGain - totalServiceCost

  return (
    <>
      {/* ─── S1. Header ──────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="PLEX"
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {[
              ['シミュレーション', '#simulation'],
              ['サービス内容', '#features'],
              ['料金', '#pricing'],
              ['よくある質問', '#faq'],
            ].map(([label, href]) => (
              <a
                key={href}
                href={href}
                className={`transition-colors ${
                  scrolled
                    ? 'text-slate-700 hover:text-[#3366FF]'
                    : 'text-white/90 hover:text-white'
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className={`hidden md:inline-flex px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                scrolled
                  ? 'border-slate-300 text-slate-700 hover:bg-slate-50'
                  : 'border-white/40 text-white hover:bg-white/10'
              }`}
            >
              お問い合わせ
            </a>
            <a
              href="#"
              className="inline-flex px-4 py-2 rounded-lg text-sm font-semibold bg-[#3366FF] text-white hover:bg-blue-700 transition-colors"
            >
              資料ダウンロード
            </a>
          </div>
        </div>
      </header>

      {/* ─── S2. Hero ────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center pt-16"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}
      >
        <div className="dot-grid absolute inset-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 text-white">
          {/* Trust bar */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 text-sm">
            <span className="text-green-300">✓</span>
            <span>税務署・年金事務所 個別照会済み</span>
            <span className="mx-2 text-white/30">|</span>
            <span className="text-green-300">✓</span>
            <span>社労士・税理士 監修済み</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-6">
            借上社宅制度の導入・運用を、
            <br />
            <span className="text-yellow-300">PLEXが一気通貫で代行</span>
          </h1>

          <p className="text-lg md:text-2xl font-bold text-white/90 mb-4">
            実質無料で従業員の手取りを
            <span className="text-[#F97316] font-black text-2xl md:text-3xl mx-1">年28.7万円</span>
            増やす、
            <br className="hidden md:block" />
            新しい採用・定着戦略
          </p>

          <p className="text-sm text-white/60 mb-10">
            ※システム利用料よりも社会保険削減が上回るケースがほとんどのため実質無料と記載
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { val: '1/3', label: '離職率改善' },
              { val: '1.5倍', label: '採用人数UP' },
              { val: '28.7万円', label: '手取りUP/年' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl md:text-4xl font-black text-[#F97316] font-mono">{val}</div>
                <div className="text-xs text-white/70 mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-[#1E3A8A] font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              資料ダウンロード（無料）
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-white/60 text-white font-bold text-lg hover:bg-white/10 transition-colors"
            >
              オンラインデモ受付中 →
            </a>
          </div>
        </div>
      </section>

      {/* ─── S3. Benefits ────────────────────────────────────────── */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              従業員にも会社にも、大きなメリット
            </h2>
            <p className="text-[#64748B] text-lg">
              借上社宅制度は「給与を上げずに手取りを増やす」唯一の合法的な方法です
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            {/* Employee */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#3366FF] flex items-center justify-center text-white text-lg">
                  👤
                </div>
                <h3 className="text-xl font-bold text-[#1E3A8A]">従業員のメリット</h3>
              </div>
              <ul className="space-y-4">
                {EMPLOYEE_BENEFITS.map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className="text-[#0F172A]">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="rounded-2xl border border-green-100 bg-green-50 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#22B860] flex items-center justify-center text-white text-lg">
                  🏢
                </div>
                <h3 className="text-xl font-bold text-[#166534]">会社のメリット</h3>
              </div>
              <ul className="space-y-4">
                {COMPANY_BENEFITS.map(({ icon, text }) => (
                  <li key={text} className="flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">{icon}</span>
                    <span className="text-[#0F172A]">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mechanism image */}
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/mechanism.jpg"
              alt="借上社宅の仕組み"
              width={1200}
              height={600}
              className="w-full object-cover"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <a href="#" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3366FF] text-white font-bold text-lg hover:bg-blue-700 transition-colors">
              資料ダウンロード（無料）
            </a>
            <a href="#" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-[#3366FF] text-[#3366FF] font-bold text-lg hover:bg-blue-50 transition-colors">
              お問い合わせ
            </a>
          </div>
        </div>
      </section>

      {/* ─── S4. Simulation ──────────────────────────────────────── */}
      <section id="simulation" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              導入でいくらお得？今すぐシミュレーション
            </h2>
            <p className="text-[#64748B]">
              従業員の給与と人数に合わせて、会社全体のメリットを計算できます
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Salary selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-[#64748B] mb-3">月給を選択</label>
              <div className="flex flex-wrap gap-2">
                {[30, 40, 50, 60, 70, 80].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSalary(s)}
                    className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-colors ${
                      salary === s
                        ? 'bg-[#3366FF] text-white shadow-md'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s}万円
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#64748B] mt-2">
                想定家賃: {sim.rent}万円（月給の約25%）
              </p>
            </div>

            {/* Users slider */}
            <div className="mb-10">
              <label className="block text-sm font-bold text-[#64748B] mb-3">
                利用人数:{' '}
                <span className="text-[#3366FF] text-lg">{users}名</span>
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                className="w-full accent-[#3366FF]"
              />
              <div className="flex justify-between text-xs text-[#64748B] mt-1">
                <span>1名</span>
                <span>100名</span>
              </div>
            </div>

            {/* Results */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <p className="text-sm font-medium text-[#64748B] mb-2">従業員手取り効果</p>
                <p className="text-xs text-[#64748B] mb-1">（1人あたり / 年間）</p>
                <p className="text-3xl font-black text-[#F97316] font-mono">
                  +{sim.employee}万円
                </p>
              </div>
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-sm font-medium text-[#64748B] mb-2">会社の社保削減額</p>
                <p className="text-xs text-[#64748B] mb-1">（全員 / 年間）</p>
                <p className="text-3xl font-black text-[#22B860] font-mono">
                  +{totalCompanyGain.toFixed(1)}万円
                </p>
              </div>
              <div className={`rounded-xl p-6 text-center ${netBenefit >= 0 ? 'bg-orange-50' : 'bg-slate-50'}`}>
                <p className="text-sm font-medium text-[#64748B] mb-2">実質負担額</p>
                <p className="text-xs text-[#64748B] mb-1">（社保削減 − サービス費）</p>
                <p className={`text-3xl font-black font-mono ${netBenefit >= 0 ? 'text-[#F97316]' : 'text-slate-500'}`}>
                  {netBenefit >= 0 ? '+' : ''}{netBenefit.toFixed(1)}万円
                </p>
              </div>
            </div>

            <p className="text-xs text-[#64748B] mt-4 text-center">
              ※家賃額は給与の約25%相当と仮定。シミュレーション結果は2年以上運用した場合の1年間の数値
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-[#3366FF] text-white font-bold hover:bg-blue-700 transition-colors">
                詳細シミュレーションを依頼
              </a>
              <a href="#" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-[#3366FF] text-[#3366FF] font-bold hover:bg-blue-50 transition-colors">
                お問い合わせ
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── S5. Pain Points ─────────────────────────────────────── */}
      <section id="pain" className="py-20 bg-[#1E3A8A] text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              こんなお悩みはありませんか？
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {[
              {
                no: '01',
                title: '導入が大変そう',
                desc: '「借上社宅制度を導入したいけど、手続きが複雑で何から始めればいいか分からない」',
              },
              {
                no: '02',
                title: '管理業務が煩雑',
                desc: '「毎月の家賃処理・契約更新・退去対応など、管理業務に時間とコストがかかっている」',
              },
              {
                no: '03',
                title: '専門知識がない',
                desc: '「税務・社会保険の専門知識やノウハウを持った担当者がいない。リスクが心配」',
              },
            ].map(({ no, title, desc }) => (
              <div key={no} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-4xl font-black text-white/20 mb-3 font-mono">{no}</div>
                <h3 className="text-lg font-bold mb-3">{title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Solution */}
          <div className="bg-white rounded-2xl p-8 text-[#0F172A]">
            <h3 className="text-2xl font-black text-center text-[#1E3A8A] mb-8">
              PLEXがまるごと解決します！
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: '🚀', text: '充実したサポートで導入・運用を改革' },
                { icon: '💳', text: '支払/請求を一元管理・時間とコストを節約' },
                { icon: '✅', text: '税務署・年金事務所への照会済みで安心' },
                { icon: '👥', text: '専門知識は不要（社労士・税理士が連携）' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3 bg-blue-50 rounded-xl p-4">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium text-[#0F172A]">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── S6. Features ────────────────────────────────────────── */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              導入から退去まで、PLEXがまるごと代行
            </h2>
            <p className="text-[#64748B] text-lg">
              社宅管理に必要な全業務を一気通貫でサポート。担当者の工数はほぼゼロです。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2">{title}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S7. Comparison Table ────────────────────────────────── */}
      <section id="compare" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              なぜPLEXの経済的メリットが最大なのか
            </h2>
            <p className="text-[#64748B]">サービス内容・サポート範囲を他社と比較</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left p-4 text-sm font-bold text-[#64748B] w-1/3">比較項目</th>
                  <th className="p-4 text-center text-sm font-bold text-[#64748B]">他社A</th>
                  <th className="p-4 text-center text-sm font-bold text-[#64748B]">他社B</th>
                  <th className="p-4 text-center text-sm font-bold text-white bg-[#3366FF] rounded-t-lg">
                    PLEX
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map(({ label, a, b, plex }, i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  >
                    <td className="p-4 text-sm font-medium text-[#0F172A]">{label}</td>
                    <td className="p-4 text-center text-sm text-[#64748B]">{a}</td>
                    <td className="p-4 text-center text-sm text-[#64748B]">{b}</td>
                    <td className="p-4 text-center text-sm font-bold text-[#3366FF] bg-blue-50">
                      {plex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ─── S8. Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              シンプルで透明な料金体系
            </h2>
            <p className="text-[#64748B]">
              隠れたコストなし。導入規模に合わせた料金設計です。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: '初期費用',
                price: '応相談',
                sub: '規模・要件によって異なります',
                highlight: false,
              },
              {
                label: '運用コスト',
                price: '8,900円',
                sub: '/ 月・利用者',
                highlight: true,
              },
              {
                label: '早割プラン',
                price: '0円',
                sub: '1ヶ月以内お申込みで初期費用無料',
                highlight: false,
                badge: '期間限定',
              },
            ].map(({ label, price, sub, highlight, badge }) => (
              <div
                key={label}
                className={`rounded-2xl p-8 text-center border ${
                  highlight
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xl scale-105'
                    : 'bg-white text-[#0F172A] border-slate-200 shadow-sm'
                }`}
              >
                {badge && (
                  <span className="inline-block bg-[#F97316] text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                    {badge}
                  </span>
                )}
                <p className={`text-sm font-bold mb-2 ${highlight ? 'text-white/70' : 'text-[#64748B]'}`}>
                  {label}
                </p>
                <p className={`text-3xl font-black font-mono mb-2 ${highlight ? 'text-yellow-300' : 'text-[#0F172A]'}`}>
                  {price}
                </p>
                <p className={`text-sm ${highlight ? 'text-white/70' : 'text-[#64748B]'}`}>{sub}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-[#64748B] mt-6">
            ※ 社会保険料削減効果により、多くの場合サービス費用は実質無料となります
          </p>
        </div>
      </section>

      {/* ─── S9. Case Studies ────────────────────────────────────── */}
      <section id="cases" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              導入事例
            </h2>
            <p className="text-[#64748B]">PLEXを導入した企業の実績をご紹介します</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CASES.map(({ company, size, before, after, metric, color }) => (
              <div
                key={company}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className={`bg-gradient-to-r ${color} p-6 text-white`}>
                  <p className="text-lg font-bold">{company}</p>
                  <p className="text-white/80 text-sm">{size}</p>
                  <p className="text-2xl font-black mt-3 font-mono">{metric}</p>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <span className="text-xs font-bold text-[#F97316] bg-orange-50 px-2 py-1 rounded">Before</span>
                    <p className="mt-2 text-sm text-[#64748B] italic">{before}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#22B860] bg-green-50 px-2 py-1 rounded">After</span>
                    <p className="mt-2 text-sm text-[#0F172A]">{after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S10. FAQ ────────────────────────────────────────────── */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
              よくあるご質問
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-[#0F172A] pr-4">{q}</span>
                  <span className="text-[#3366FF] text-xl flex-shrink-0 font-mono">
                    {openFaq === i ? '−' : '+'}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-[#64748B] leading-relaxed text-sm border-t border-slate-100 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── S11. Final CTA ──────────────────────────────────────── */}
      <section
        id="contact"
        className="py-24 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)' }}
      >
        <div className="dot-grid absolute inset-0 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-4">
          {/* Early bird badge */}
          <div className="inline-block bg-[#F97316] text-white text-sm font-bold px-4 py-2 rounded-full mb-6">
            🎉 早割プラン: 1ヶ月以内お申込みで初期費用 0円
          </div>

          <h2 className="text-3xl md:text-4xl font-black mb-4">
            まずは無料でシミュレーション試算を
            <br />
            ご依頼ください
          </h2>
          <p className="text-white/80 text-lg mb-10">
            具体的な料金・導入スケジュールについて、担当者がご案内します
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-5 rounded-xl bg-white text-[#1E3A8A] font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              資料ダウンロード（無料）
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center px-10 py-5 rounded-xl border-2 border-white/60 text-white font-bold text-lg hover:bg-white/10 transition-colors"
            >
              お問い合わせ
            </a>
          </div>
        </div>
      </section>

      {/* ─── S12. Footer ─────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div>
              <Image
                src="/logo.png"
                alt="PLEX"
                width={120}
                height={32}
                className="h-8 w-auto object-contain brightness-0 invert mb-3"
              />
              <p className="text-slate-400 text-sm max-w-xs">
                借上社宅制度の導入から退去まで、一気通貫でサポートします。
              </p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm text-slate-400">
              {[
                ['シミュレーション', '#simulation'],
                ['サービス内容', '#features'],
                ['料金', '#pricing'],
                ['事例', '#cases'],
                ['FAQ', '#faq'],
                ['お問い合わせ', '#contact'],
              ].map(([label, href]) => (
                <a key={href} href={href} className="hover:text-white transition-colors">
                  {label}
                </a>
              ))}
            </nav>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
            <p>© 2024 PLEX Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-slate-300 transition-colors">プライバシーポリシー</a>
              <a href="#" className="hover:text-slate-300 transition-colors">利用規約</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
