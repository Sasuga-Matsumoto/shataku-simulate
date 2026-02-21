import SectionHeading from "@/components/ui/SectionHeading";
import { caseStudies } from "@/data/caseStudies";

export default function CaseStudiesSection() {
  return (
    <section id="cases" className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading
          title="導入事例"
          subtitle="福利厚生社宅サービスを導入された企業様の声"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {caseStudies.map((cs, i) => (
            <div
              key={i}
              className="bg-white rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
            >
              {/* ヘッダー */}
              <div className="bg-dark-blue text-white px-6 py-4">
                <h3 className="font-bold text-lg">{cs.company}</h3>
                <p className="text-sm text-white/70">
                  {cs.industry} ｜ {cs.employees}
                </p>
              </div>

              <div className="p-6">
                {/* Before */}
                <div className="mb-4">
                  <span className="inline-block bg-gray-200 text-text-light text-xs font-bold px-3 py-1 rounded-full mb-2">
                    Before
                  </span>
                  <p className="text-sm text-text-light leading-relaxed">
                    {cs.before.issue}
                  </p>
                </div>

                {/* After */}
                <div className="mb-4">
                  <span className="inline-block bg-bright-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                    After
                  </span>
                  <p className="text-sm text-text leading-relaxed">
                    {cs.after.result}
                  </p>
                </div>

                {/* Quote */}
                <div className="border-l-4 border-accent-blue pl-4 mt-4">
                  <p className="text-sm text-text-light italic leading-relaxed">
                    &ldquo;{cs.quote}&rdquo;
                  </p>
                  <p className="text-xs text-text-light mt-2">
                    — {cs.company} {cs.person}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-light text-center mt-8">
          ※ 導入事例はプレースホルダーです。実際のお客様事例は準備中です。
        </p>
      </div>
    </section>
  );
}
