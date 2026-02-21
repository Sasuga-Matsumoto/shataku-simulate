import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-lg text-dark-blue">
          <span className="text-bright-blue">PLEX</span> 福利厚生社宅
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="secondary"
            href="#"
            className="!py-2 !px-5 !text-sm"
          >
            資料請求
          </Button>
          <Button
            variant="primary"
            href="#"
            className="!py-2 !px-5 !text-sm"
          >
            お問い合わせ
          </Button>
        </div>
      </div>
    </header>
  );
}
