import { useEffect, useRef, useCallback } from 'react'
import { TenoxUIEngine } from '../engine1'

export function useTenoxUIEngine(config) {
  const engineRef = useRef(null)
  useEffect(() => {
    engineRef.current = new TenoxUIEngine(config)
    engineRef.current.initialize()
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, [])
  const rescanDocument = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.scanDocument()
    }
  }, [])

  return { rescanDocument }
}
