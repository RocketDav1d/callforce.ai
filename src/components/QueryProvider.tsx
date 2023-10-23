'use client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React from 'react'

type Props = {
    children: React.ReactNode
}

const Providers = ({children}: Props) => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  )
}

export default Providers