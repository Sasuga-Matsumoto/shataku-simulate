import SectionHeading from "@/components/ui/SectionHeading";
import { solutions } from "@/data/solutions";

export default function SolutionSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4">
        <SectionHeading
          title="私たちが解決します"
          subtitle="導入から運用まで、ワンストップでサポート"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((s) => (
            <div
              key={s.number}
              className="bg-white rounded-xl p-8 text-center shadow-[0_1px_4px_rgba(0,0,0,0.08)] border-t-4 border-bright-blue"
            >
              <div className="text-4xl mb-4">{s.icon}</div>
              <span className="inline-block bg-bright-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-3">
                解決策 {s.number}
              </span>
              <h3 className="text-lg font-bold text-dark-blue mb-3">
                {s.title}
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
