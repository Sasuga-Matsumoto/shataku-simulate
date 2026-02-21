import type { Metadata } from 'next'
import { Noto_Sans_JP, IBM_Plex_Sans } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto',
  preload: false,
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm',
  preload: false,
})

export const metadata: Metadata = {
  title: 'PLEX 借上社宅 | 実質無料で従業員の手取りを年28.7万円増やす採用・定着戦略',
  description:
    '借上社宅制度の導入から退去まで、PLEXが一気通貫で代行。社会保険削減で実質無料。従業員の手取りUP・離職率1/3・採用人数1.5倍を実現。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${ibmPlexSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
