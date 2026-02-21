import SectionHeading from "@/components/ui/SectionHeading";
import { painPoints } from "@/data/painPoints";

export default function PainPointsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeading
          title="こんなお悩みはありませんか？"
          subtitle="社宅制度の導入・運用で多くの企業が直面する課題"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {painPoints.map((p) => (
            <div
              key={p.number}
              className="relative bg-bg rounded-xl p-8 text-center"
            >
              <div className="text-4xl mb-4">{p.icon}</div>
              <span className="inline-block bg-dark-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                お悩み {p.number}
              </span>
              <h3 className="text-lg font-bold text-dark-blue mb-3">
                {p.title}
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
