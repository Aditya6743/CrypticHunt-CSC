import './globals.css'
import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

import Preloader from '@/components/Preloader'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const firaCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' })

export const metadata: Metadata = {
  title: 'CRYPTIC HUNT | Cybersecurity Platform',
  description: '50 Levels. One Final Boss. The ultimate CTF experience.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${firaCode.variable} font-sans bg-[#05070B] text-gray-100 min-h-screen antialiased relative`}>
        <Preloader />
        <div className="absolute top-6 left-12 lg:left-16 z-50 mix-blend-screen" style={{ filter: 'contrast(1.2)', clipPath: 'inset(0 1.5% 0 0)' }}>
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="Cryptic Hunt Home" 
              width={72} 
              height={72} 
              className="hover:scale-110 transition-transform duration-300 object-contain"
            />
          </Link>
        </div>
        {children}
      </body>
    </html>
  )
}
