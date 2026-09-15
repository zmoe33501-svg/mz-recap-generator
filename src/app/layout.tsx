import './globals.css'

export const metadata = {
  title: 'MZ Studio: Recap & Prompt Generator',
  description: 'AI powered movie recap and prompt generator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
