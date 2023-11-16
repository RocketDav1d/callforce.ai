'use client'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import React from 'react'

const queryClient = new QueryClient();

type Props = {
    children: React.ReactNode
}

const Providers = ({children}: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

export default Providers