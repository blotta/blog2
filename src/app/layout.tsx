import Footer from "./Footer"
import Header from "./Header"
import "./globals.css";

export const metadata = {
  title: 'Lucas Blotta MD',
  description: 'Developer Blog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body className="bg-neutral-800 text-neutral-400">
        <div className="flex flex-col h-screen">
          <Header />
          <div className="mx-auto max-w-2xl p-6 flex-grow">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
