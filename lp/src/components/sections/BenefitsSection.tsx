import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import {
  employeeBenefits,
  companyBenefits,
  salaryTable,
  reasons,
} from "@/data/benefits";

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {/* 手取りUP額 & 社保削減額テーブル */}
        <SectionHeading
          title="従業員の手取りUP額 & 会社の社保削減額"
          subtitle="月給と家賃目安ごとの年間効果"
        />
        <div className="overflow-x-auto mb-16">
          <table className="w-full max-w-3xl mx-auto text-sm md:text-base">
            <thead>
              <tr className="bg-dark-blue text-white">
                <th className="px-4 py-3 text-left font-bold rounded-tl-lg">月給</th>
                <th className="px-4 py-3 text-center font-bold">家賃目安</th>
                <th className="px-4 py-3 text-center font-bold">手取りUP/年</th>
                <th className="px-4 py-3 text-center font-bold rounded-tr-lg">社保削減/年</th>
              </tr>
            </thead>
            <tbody>
              {salaryTable.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${
                    i % 2 === 0 ? "bg-white" : "bg-bg"
                  }`}
                >
                  <td className="px-4 py-3 font-bold text-dark-blue">
                    {row.salary}
                  </td>
                  <td className="px-4 py-3 text-center text-text-light">
                    {row.rent}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-bright-blue">
                    {row.takeHomeUp}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-dark-blue">
                    {row.siSaving}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 従業員のメリット */}
        <SectionHeading
          title="従業員のメリット"
          subtitle="社宅制度で手取りがアップする仕組み"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {employeeBenefits.map((b, i) => (
            <Card key={i} className="text-center">
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-lg font-bold text-dark-blue mb-3">
                {b.title}
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {b.description}
              </p>
            </Card>
          ))}
        </div>

        {/* 会社のメリット */}
        <SectionHeading
          title="会社のメリット"
          subtitle="社会保険料削減と人材面での効果"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {companyBenefits.map((b, i) => (
            <Card key={i} className="text-center">
              <div className="text-4xl mb-4">{b.icon}</div>
              <h3 className="text-lg font-bold text-dark-blue mb-3">
                {b.title}
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {b.description}
              </p>
            </Card>
          ))}
        </div>

        {/* 選ばれる4つの理由 */}
        <SectionHeading
          title="選ばれる4つの理由"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((r) => (
            <div
              key={r.number}
              className="bg-white rounded-xl p-6 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)] border-t-4 border-bright-blue"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-bright-blue text-white font-bold text-sm mb-3">
                {r.number}
              </span>
              <h3 className="text-base font-bold text-dark-blue mb-2">
                {r.title}
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
