"use client";

import { useState } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import { simulateLP, formatYen, SALARY_OPTIONS } from "@/lib/simulation";
import type { SimulationOutput } from "@/lib/simulation";

export default function SimulationSection() {
  const [salary, setSalary] = useState(300000);
  const [headcount, setHeadcount] = useState(10);
  const [result, setResult] = useState<SimulationOutput | null>(null);

  const handleCalculate = () => {
    if (headcount < 1) return;
    setResult(simulateLP({ monthlySalary: salary, headcount }));
  };

  return (
    <section
      id="simulation"
      className="py-16 md:py-24 bg-linear-to-b from-[#EEF2FF] to-bg"
    >
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeading
          title="導入効果シミュレーション"
          subtitle="月給と利用人数を入力するだけで、手取り増加額と社保削減額を試算できます"
        />

        {/* 入力フォーム */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.08)] mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 月給 */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">
                月給（額面）
              </label>
              <select
                value={salary}
                onChange={(e) => setSalary(Number(e.target.value))}
                className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg bg-white focus:outline-none focus:border-bright-blue transition-colors"
              >
                {SALARY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 利用人数 */}
            <div>
              <label className="block text-sm font-semibold text-text-light mb-2">
                利用人数
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHeadcount((h) => Math.max(1, h - 1))}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-200 text-xl font-bold text-text-light hover:border-bright-blue hover:text-bright-blue transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={headcount}
                  onChange={(e) =>
                    setHeadcount(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="flex-1 text-center px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-bright-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setHeadcount((h) => h + 1)}
                  className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-gray-200 text-xl font-bold text-text-light hover:border-bright-blue hover:text-bright-blue transition-colors"
                >
                  ＋
                </button>
                <span className="text-text-light ml-1">人</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCalculate}
            className="w-full py-4 text-base font-bold text-white bg-linear-to-br from-dark-blue to-bright-blue rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            シミュレーションを実行
          </button>
        </div>

        {/* 結果 */}
        {result && (
          <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
            {/* 1人あたり */}
            <div className="bg-linear-to-br from-[#EEF2FF] to-[#E8F0FE] rounded-xl p-6 md:p-8 text-center">
              <span className="inline-block bg-bright-blue text-white font-bold text-sm px-5 py-1.5 rounded-full mb-4">
                従業員1人あたりの効果
              </span>
              <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
                <div>
                  <p className="text-sm text-text-light mb-1">手取り増加額/月</p>
                  <p className="text-3xl md:text-4xl font-bold text-bright-blue">
                    {formatYen(result.perPerson.takeHomeIncreaseMonthly)}
                    <span className="text-base font-normal">円</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-light mb-1">手取り増加額/年</p>
                  <p className="text-3xl md:text-4xl font-bold text-bright-blue">
                    {formatYen(result.perPerson.takeHomeIncreaseAnnual)}
                    <span className="text-base font-normal">円</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 会社側削減 */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <h3 className="text-center text-lg font-bold text-dark-blue mb-4">
                会社の社会保険料削減効果
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-bg rounded-lg">
                  <p className="text-sm text-text-light mb-1">
                    1人あたり削減額/年
                  </p>
                  <p className="text-2xl font-bold text-dark-blue">
                    {formatYen(result.perPerson.siSavingsAnnual)}
                    <span className="text-sm font-normal">円</span>
                  </p>
                </div>
                <div className="text-center p-4 bg-bg rounded-lg">
                  <p className="text-sm text-text-light mb-1">
                    全{result.headcount}名の合計削減額/年
                  </p>
                  <p className="text-2xl font-bold text-dark-blue">
                    {formatYen(result.total.siSavingsAnnual)}
                    <span className="text-sm font-normal">円</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 全体合計 */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
              <h3 className="text-center text-lg font-bold text-dark-blue mb-4">
                全{result.headcount}名の合計効果
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center p-4 bg-[#EEF2FF] rounded-lg">
                  <p className="text-sm text-text-light mb-1">
                    従業員手取り増加/年
                  </p>
                  <p className="text-2xl font-bold text-bright-blue">
                    {formatYen(result.total.takeHomeIncreaseAnnual)}
                    <span className="text-sm font-normal">円</span>
                  </p>
                </div>
                <div className="text-center p-4 bg-[#EEF2FF] rounded-lg">
                  <p className="text-sm text-text-light mb-1">
                    会社負担削減/年
                  </p>
                  <p className="text-2xl font-bold text-bright-blue">
                    {formatYen(result.total.siSavingsAnnual)}
                    <span className="text-sm font-normal">円</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-text-light text-center leading-relaxed">
              ※ 上記は概算です。実際の効果は個々の条件により異なります。
              <br />
              ※ 健康保険料率は全国平均（9.9%）、家賃は月給の25%、減額割合は80%で計算しています。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
