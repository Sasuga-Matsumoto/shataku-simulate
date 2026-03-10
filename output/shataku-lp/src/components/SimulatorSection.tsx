'use client';
import { useState, useRef } from 'react';
import Link from 'next/link';
import FadeIn from './FadeIn';

const SST: [number, number, number, number, number][] = [
  [58000,0,63000,2873.9,8052],[68000,63000,73000,3369.4,8052],
  [78000,73000,83000,3864.9,8052],[88000,83000,93000,4360.4,8052],
  [98000,93000,101000,4855.9,8967],[104000,101000,107000,5153.2,9516],
  [110000,107000,114000,5450.5,10065],[118000,114000,122000,5846.9,10797],
  [126000,122000,130000,6243.3,11529],[134000,130000,138000,6639.7,12261],
  [142000,138000,146000,7036.1,12993],[150000,146000,155000,7432.5,13725],
  [160000,155000,165000,7928,14640],[170000,165000,175000,8423.5,15555],
  [180000,175000,185000,8919,16470],[190000,185000,195000,9414.5,17385],
  [200000,195000,210000,9910,18300],[220000,210000,230000,10901,20130],
  [240000,230000,250000,11892,21960],[260000,250000,270000,12883,23790],
  [280000,270000,290000,13874,25620],[300000,290000,310000,14865,27450],
  [320000,310000,330000,15856,29280],[340000,330000,350000,16847,31110],
  [360000,350000,370000,17838,32940],[380000,370000,395000,18829,34770],
  [410000,395000,425000,20315.5,37515],[440000,425000,455000,21802,40260],
  [470000,455000,485000,23288.5,43005],[500000,485000,515000,24775,45750],
  [530000,515000,545000,26261.5,48495],[560000,545000,575000,27748,51240],
  [590000,575000,605000,29234.5,53985],[620000,605000,635000,30721,56730],
  [650000,635000,665000,32207.5,59475],[680000,665000,695000,33694,59475],
  [710000,695000,730000,35180.5,59475],[750000,730000,770000,37162.5,59475],
  [790000,770000,810000,39144.5,59475],[830000,810000,855000,41126.5,59475],
  [880000,855000,905000,43604,59475],[930000,905000,955000,46081.5,59475],
  [980000,955000,1005000,48559,59475],[1030000,1005000,1055000,51036.5,59475],
  [1090000,1055000,1115000,54009.5,59475],[1150000,1115000,1175000,56982.5,59475],
  [1210000,1175000,1235000,59955.5,59475],[1270000,1235000,1295000,62928.5,59475],
  [1330000,1295000,1355000,65901.5,59475],[1390000,1355000,Infinity,68874.5,59475]
];

function lookupIns(salary: number) {
  for (const r of SST) { if (salary < r[2]) return { health: r[3], pension: r[4] }; }
  const l = SST[SST.length - 1]; return { health: l[3], pension: l[4] };
}

function getEarnedIncome(annualIncome: number) {
  if (annualIncome <= 0) return 0;
  let v: number;
  if (annualIncome <= 1900000) v = annualIncome - 650000;
  else if (annualIncome <= 3600000) v = annualIncome * 0.7 - 80000;
  else if (annualIncome <= 6600000) v = annualIncome * 0.8 - 440000;
  else if (annualIncome <= 8500000) v = annualIncome * 0.9 - 1100000;
  else v = annualIncome - 1950000;
  return Math.max(0, v);
}

function getBasicDeductionIT(earned: number) {
  if (earned < 1320000) return 950000;
  if (earned < 3360000) return 880000;
  if (earned < 4890000) return 680000;
  if (earned < 6550000) return 630000;
  if (earned < 23500000) return 580000;
  if (earned < 24000000) return 480000;
  if (earned < 24500000) return 320000;
  if (earned < 25000000) return 160000;
  return 0;
}

function getIncomeTax(taxable: number) {
  if (taxable <= 0) return 0;
  if (taxable <= 1949000) return taxable * 0.05;
  if (taxable <= 3299000) return taxable * 0.10 - 97500;
  if (taxable <= 6949000) return taxable * 0.20 - 427500;
  if (taxable <= 8999000) return taxable * 0.23 - 636000;
  if (taxable <= 17999000) return taxable * 0.33 - 1536000;
  if (taxable <= 39999000) return taxable * 0.40 - 2796000;
  return taxable * 0.45 - 4796000;
}

function calcDetails(monthlySalary: number, rent: number, reductionRate: number) {
  const effSalary = monthlySalary - rent * reductionRate;
  const annual = effSalary * 12;
  const ins = lookupIns(effSalary);
  const empIns = effSalary * 0.006;
  const monthSI = ins.health + ins.pension + empIns;
  const annualSI = monthSI * 12;
  const earned = getEarnedIncome(annual);
  const taxableRes = Math.max(0, earned - annualSI - 430000);
  const resTax = taxableRes * 0.1 + 5000;
  const basicIT = getBasicDeductionIT(earned);
  const taxableIT = Math.max(0, earned - annualSI - basicIT);
  const incTax = Math.max(0, getIncomeTax(taxableIT));
  const empRent = rent * (1 - reductionRate);
  const annualTakeHome = annual - annualSI - resTax - incTax;
  return {
    effSalary, monthSI,
    monthlyResTax: resTax / 12, monthlyIncTax: incTax / 12,
    monthlyTakeHome: annualTakeHome / 12, empRent,
    companyHP: (ins.health + ins.pension) * 12,
  };
}

function formatNum(n: number) { return Math.round(n).toLocaleString('ja-JP'); }
function formatMan(n: number) { return (Math.round(n / 1000) / 10).toFixed(1); }

interface Results {
  tedori: string; count: string; tedoriTotal: string;
  shaho: string; shahoPer: string; count2: string;
  salaryBefore: string; salaryAfter: string;
  taxBefore: string; taxAfter: string;
  rentBefore: string; rentAfter: string;
  netBefore: string; netAfter: string;
  diffMonthly: string; diffAnnual: string;
}

export default function SimulatorSection() {
  const [salary, setSalary] = useState('300000');
  const [count, setCount] = useState('10');
  const [error, setError] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const calculate = () => {
    const salaryVal = parseInt(salary, 10);
    const rent = Math.round(salaryVal / 4);
    const countRaw = count.replace(/[^0-9]/g, '');
    const countVal = parseInt(countRaw, 10);

    if (!countVal || countVal < 1) {
      setError('利用人数を1以上の半角数字で入力してください。');
      return;
    }
    if (countVal > 10000) {
      setError('利用人数は10,000人以下で入力してください。');
      return;
    }
    setError('');

    const before = calcDetails(salaryVal, 0, 0);
    const after = calcDetails(salaryVal, rent, 0.8);

    const beforeNet = before.monthlyTakeHome - rent;
    const afterNet = after.monthlyTakeHome - after.empRent;
    const monthlyDiff = afterNet - beforeNet;
    const annualDiff = monthlyDiff * 12;

    const companySavingsPerPerson = before.companyHP - after.companyHP;
    const companySavingsTotal = companySavingsPerPerson * countVal;

    const beforeTaxSI = before.monthSI + before.monthlyResTax + before.monthlyIncTax;
    const afterTaxSI = after.monthSI + after.monthlyResTax + after.monthlyIncTax;

    setResults({
      tedori: '+' + formatNum(annualDiff),
      count: formatNum(countVal),
      tedoriTotal: formatNum(annualDiff * countVal),
      shaho: '-' + formatNum(companySavingsTotal),
      shahoPer: formatNum(companySavingsPerPerson),
      count2: formatNum(countVal),
      salaryBefore: formatMan(salaryVal) + '万円',
      salaryAfter: formatMan(after.effSalary) + '万円',
      taxBefore: formatMan(beforeTaxSI) + '万円',
      taxAfter: formatMan(afterTaxSI) + '万円',
      rentBefore: formatMan(rent) + '万円',
      rentAfter: formatMan(after.empRent) + '万円',
      netBefore: formatMan(beforeNet) + '万円',
      netAfter: formatMan(afterNet) + '万円',
      diffMonthly: '+' + formatNum(monthlyDiff),
      diffAnnual: '+' + formatNum(annualDiff),
    });
    setShowResults(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  return (
    <section className="section simulator" id="simulator">
      <div className="inner">
        <FadeIn className="section-center">
          <div className="section-label">SIMULATION</div>
          <h2 className="section-title">会社のコスト削減シミュレーター</h2>
          <p className="section-desc">従業員の給与と人数に合わせて、会社全体のメリットをシミュレーションできます。</p>
        </FadeIn>

        <FadeIn>
          <div className="sim-form-card">
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '20px' }}>条件を入力してください</div>
            <div className="input-group">
              <label htmlFor="sim-salary">月給（額面）</label>
              <select id="sim-salary" value={salary} onChange={e => setSalary(e.target.value)}>
                <option value="250000">25万円</option>
                <option value="300000">30万円</option>
                <option value="350000">35万円</option>
                <option value="400000">40万円</option>
                <option value="500000">50万円</option>
                <option value="600000">60万円</option>
                <option value="700000">70万円</option>
                <option value="800000">80万円</option>
                <option value="900000">90万円</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="sim-count">利用人数</label>
              <div className="input-with-unit">
                <input
                  type="text"
                  id="sim-count"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="例: 50"
                  value={count}
                  onChange={e => setCount(e.target.value)}
                />
                <span className="input-unit">人</span>
              </div>
              <div className="inline-error">{error}</div>
            </div>
            <button className="calc-btn" onClick={calculate}>計算する</button>
            <div className="sim-notes">
              ※ 家賃額は月給の25%相当と仮定<br />
              ※ 会社負担額は家賃の80%、残りの20%は従業員天引き<br />
              ※ 賞与なし・扶養等の控除は考慮しない
            </div>
          </div>
        </FadeIn>

        {results && (
          <div
            ref={resultsRef}
            style={{
              marginTop: '28px',
              opacity: showResults ? 1 : 0,
              transform: showResults ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div className="sim-results-card">
              <div className="result-badge">シミュレーション結果</div>
              <div className="result-row">
                <div className="result-item">
                  <div className="r-label">従業員手取り効果（1人あたり）</div>
                  <div className="r-value"><span>{results.tedori}</span><span className="r-unit">円/年</span></div>
                  <div className="r-sub">&times; {results.count}人 = {results.tedoriTotal}円</div>
                </div>
                <div className="result-divider"></div>
                <div className="result-item">
                  <div className="r-label">会社負担 社会保険料 年間削減額</div>
                  <div className="r-value"><span>{results.shaho}</span><span className="r-unit">円/年</span></div>
                  <div className="r-sub">1人あたり{results.shahoPer}円 &times; {results.count2}人</div>
                </div>
              </div>
            </div>

            <div className="sim-breakdown-card">
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--dark-blue)', marginBottom: '16px' }}>1人あたり月額内訳</div>
              <table className="breakdown-table">
                <thead>
                  <tr><th></th><th>利用前</th><th></th><th>利用後</th></tr>
                </thead>
                <tbody>
                  <tr><td>月収（額面）</td><td>{results.salaryBefore}</td><td className="bd-arrow">&rarr;</td><td>{results.salaryAfter}</td></tr>
                  <tr><td>税金・社保</td><td>{results.taxBefore}</td><td className="bd-arrow">&rarr;</td><td>{results.taxAfter}</td></tr>
                  <tr><td>家賃負担</td><td>{results.rentBefore}</td><td className="bd-arrow">&rarr;</td><td>{results.rentAfter}</td></tr>
                  <tr className="bd-total"><td>実質手取り</td><td>{results.netBefore}</td><td className="bd-arrow">&rarr;</td><td>{results.netAfter}</td></tr>
                </tbody>
              </table>
              <div className="bd-diff">月 <span>{results.diffMonthly}</span>円 / 年 <span>{results.diffAnnual}</span>円 手取りアップ</div>
            </div>
          </div>
        )}

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
