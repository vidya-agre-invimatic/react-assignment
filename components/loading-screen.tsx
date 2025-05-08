import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  )
}
