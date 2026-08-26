import { useEffect, useState } from "react"
import { IWorkExperience } from "../model"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

type SearchExperienceData = {
  items: IWorkExperience[]
  count: number
}

export function useSearchExperience() {
  const [experiences, setExperiences] = useState<IWorkExperience[]>([])
  const [count, setCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const searchExperiences = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/work-experience")
      const body: ApiResponse<SearchExperienceData> = await res.json()

      if (!res.ok || !body.success) {
        setError(body.message || "Failed to load work experiences")
        return
      }

      setExperiences(body.data?.items ?? [])
      setCount(body.data?.count ?? 0)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    searchExperiences()
  }, [])

  return { experiences, count, error, isLoading, searchExperiences }
}
