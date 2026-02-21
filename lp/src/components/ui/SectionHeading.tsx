interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, light }: SectionHeadingProps) {
  return (
    <div className="text-center mb-12">
      <h2
        className={`text-2xl md:text-3xl font-bold mb-4 ${
          light ? "text-white" : "text-dark-blue"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg ${
            light ? "text-white/80" : "text-text-light"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
