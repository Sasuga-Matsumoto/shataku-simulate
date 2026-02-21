import Button from "@/components/ui/Button";

export default function FinalCtaSection() {
  return (
    <section className="bg-linear-to-br from-dark-blue to-bright-blue py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
          まずはお気軽にお問い合わせください
        </h2>
        <p className="text-white/80 text-base md:text-lg mb-10 leading-relaxed">
          具体的な導入効果・料金・スケジュールについて専任担当者がご案内いたします
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
