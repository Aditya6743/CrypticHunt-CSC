import './globals.css'
import type { Metadata } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'

import Preloader from '@/components/Preloader'
import TopLeftLogo from '@/components/TopLeftLogo'

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
      <body className={`${inter.variable} ${firaCode.variable} font-sans bg-[#05070B] text-gray-100 min-h-screen antialiased relative select-none`}>
        <Preloader />
        <TopLeftLogo />
        {children}
      </body>
    </html>
  )
}
