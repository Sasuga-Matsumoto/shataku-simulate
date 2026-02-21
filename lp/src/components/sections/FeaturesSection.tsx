import SectionHeading from "@/components/ui/SectionHeading";
import Card from "@/components/ui/Card";
import { features } from "@/data/features";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <SectionHeading
          title="充実の機能"
          subtitle="社宅管理に必要なすべてを網羅"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i} className="text-center hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-dark-blue mb-3">
                {f.title}
              </h3>
              <p className="text-sm text-text-light leading-relaxed">
                {f.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
