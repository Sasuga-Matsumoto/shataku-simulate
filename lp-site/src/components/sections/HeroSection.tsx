import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="bg-linear-to-br from-dark-blue to-bright-blue text-white py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-sm md:text-base font-medium mb-4 text-white/80">
          初期費用0円・手続き丸投げ ｜ 会社負担実質ゼロの福利厚生制度
        </p>
        <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
          賃上げせずに従業員の
          <br />
          <span className="text-light-blue">手取りが年30万円UP</span>
        </h1>
        <p className="text-base md:text-lg text-white/85 mb-8 max-w-2xl mx-auto leading-relaxed">
          既存の賃貸を法人名義に変更するだけ。引越し不要で利用可能。
          <br />
          規程作成から名義変更・運用まで、すべて丸投げできます。
        </p>

        {/* 3つの数字 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-10">
          <div>
            <p className="text-4xl md:text-5xl font-bold">
              30<span className="text-lg font-normal">万円</span>
            </p>
            <p className="text-sm text-white/70 mt-1">手取りUP/年</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/30" />
          <div>
            <p className="text-4xl md:text-5xl font-bold">
              1.5<span className="text-lg font-normal">倍</span>
            </p>
            <p className="text-sm text-white/70 mt-1">内定承諾率</p>
          </div>
          <div className="hidden sm:block w-px h-12 bg-white/30" />
          <div>
            <p className="text-4xl md:text-5xl font-bold">
              1/3
            </p>
            <p className="text-sm text-white/70 mt-1">離職率</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* TODO: 実際のフォームURLに差し替え */}
          <Button variant="outline" href="#">
            無料シミュレーション
          </Button>
          <Button
            variant="primary"
            href="#"
            className="!bg-white !text-bright-blue hover:!bg-white/90"
          >
            資料ダウンロード
          </Button>
        </div>
      </div>
    </section>
  );
}
