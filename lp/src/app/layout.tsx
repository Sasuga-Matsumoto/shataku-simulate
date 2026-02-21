import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PLEX 福利厚生社宅 | 手取り年30万円UP・会社負担ゼロ・初期費用0円",
  description:
    "賃上げせずに従業員の手取りが年17〜63万円UP。会社の社会保険料も年10〜21万円/人削減。初期費用0円・手続き丸投げOK。内定承諾率1.5倍、離職率1/3の実績。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.className}>{children}</body>
    </html>
  );
}
