import { useEffect, useState } from "react"
import { IProject } from "../model"

export function useSearchProjects(query: string = "category=app") {
  const [projects, setProjects] = useState<IProject[]>([])
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const searchProjects = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement search logic
      const res = await fetch(`/api/project?${query}`)
      // const data = await res.json()
      //   setProjects(data)
      console.log("client side", res)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    searchProjects()
  }, [query])

  return { projects, error, isLoading, searchProjects }
}
