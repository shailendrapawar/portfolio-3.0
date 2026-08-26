import { useEffect, useState } from "react"
import { IProject } from "../model"

type ApiResponse<T> = {
  success: boolean
  statusCode: number
  message: string
  data?: T
}

type SearchProjectsData = {
  items: IProject[]
  count: number
}

export function useSearchProjects(query: string = "") {
  const [projects, setProjects] = useState<IProject[]>([])
  const [count, setCount] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const searchProjects = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/project?${query}`)
      const body: ApiResponse<SearchProjectsData> = await res.json()

      if (!res.ok || !body.success) {
        setError(body.message || "Failed to load projects")
        return
      }

      setProjects(body.data?.items ?? [])
      setCount(body.data?.count ?? 0)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    searchProjects()
  }, [query])

  return { projects, count, error, isLoading, searchProjects }
}
