"use client"

import { useEffect, useRef, useState } from "react"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"

type DogImage = {
  id: string
  url: string
}

export default function InfiniteScrollPage() {
  const [images, setImages] = useState<DogImage[]>([])
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Custom hook for infinite scrolling
  const shouldLoadMore = useInfiniteScroll(loadMoreRef)

  const fetchDogImages = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch("https://dog.ceo/api/breeds/image/random/5")
      const data = await response.json()

      if (data.status === "success") {
        const newImages = data.message.map((url: string) => ({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url,
        }))

        setImages((prevImages) => [...prevImages, ...newImages])
      } else {
        throw new Error("Failed to fetch dog images")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load more images. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchDogImages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load more when scrolling
  useEffect(() => {
    if (shouldLoadMore) {
      fetchDogImages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldLoadMore])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Infinite Scroll</h1>
      <p className="text-muted-foreground">Scroll down to load more dog images</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-4">
              <img
                src={image.url || "/placeholder.svg"}
                alt="Dog"
                className="w-full h-64 object-cover rounded-md"
                loading="lazy"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Loading indicator */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isLoading && (
          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        )}
      </div>
    </div>
  )
}
