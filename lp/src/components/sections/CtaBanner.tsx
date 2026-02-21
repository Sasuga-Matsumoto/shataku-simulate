import Button from "@/components/ui/Button";

interface CtaBannerProps {
  message?: string;
}

export default function CtaBanner({
  message = "まずはお気軽にご相談ください",
}: CtaBannerProps) {
  return (
    <section className="bg-linear-to-r from-dark-blue to-bright-blue py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-white text-lg md:text-xl font-bold mb-6">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* TODO: 実際のフォームURLに差し替え */}
          <Button variant="outline" href="#">
            資料ダウンロード
          </Button>
          <Button
            variant="primary"
            href="#"
            className="!bg-white !text-bright-blue hover:!bg-white/90"
          >
            お問い合わせ
          </Button>
        </div>
      </div>
    </section>
  );
}
