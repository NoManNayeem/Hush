'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to developer page since we don't have a separate about page
    router.replace('/developer')
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Redirecting...</h1>
          <p className="text-gray-300">Taking you to the developer page.</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
