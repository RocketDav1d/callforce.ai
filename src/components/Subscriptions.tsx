'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import axios from 'axios'
import { set } from 'zod'

const Subscriptions = () => {
    const [loading, setLoading] = React.useState(false)

    const handleSubscription = async () => {
        try {
        setLoading(true)
        const response = await axios.get('/api/stripe')
        window.location.href = response.data.url
        } catch (error) {
        console.log(error)
        throw error   
        } finally { 
            setLoading(false)
        }
    }

  return (
    <div>
        <Button onClick={handleSubscription}>Upgrade to Pro</Button>
    </div>
  )
}

export default Subscriptions