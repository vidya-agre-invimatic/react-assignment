"use client"

import { useEffect, useState, type RefObject } from "react"

export function useInfiniteScroll(ref: RefObject<HTMLElement>, options = { threshold: 0.1 }) {
  const [shouldLoadMore, setShouldLoadMore] = useState(false)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(([entry]) => {
      setShouldLoadMore(entry.isIntersecting)
    }, options)

    observer.observe(currentRef)

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [ref, options])

  return shouldLoadMore
}
