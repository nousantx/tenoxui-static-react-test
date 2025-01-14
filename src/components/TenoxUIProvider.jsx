import React, { useEffect } from 'react'
import { useTenoxUIEngine } from '../hooks/useTenoxUIEngine'

export const TenoxUIProvider = ({ config, children }) => {
  const { rescanDocument } = useTenoxUIEngine(config)
  useEffect(() => {
    rescanDocument()
  }, [rescanDocument])
  return <>{children}</>
}
