import { useState, useCallback } from 'react'

export function useLocalStorage(key, initialValue) {
  const [stored, setStored] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const newValue = value instanceof Function ? value(stored) : value
      setStored(newValue)
      localStorage.setItem(key, JSON.stringify(newValue))
    } catch { }
  }, [key, stored])

  return [stored, setValue]
}
