"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import '../styles/globals.css';
export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Use client-side navigation instead of redirect
    router.push("/auth/login")
  }, [router])

  // Return a loading state or empty div while redirecting
  return <div className="min-h-screen flex items-center justify-center">Redirecting...</div>
}
