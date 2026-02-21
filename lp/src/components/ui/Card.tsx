interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-card-bg rounded-xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.08)] ${className}`}
    >
      {children}
    </div>
  );
}
