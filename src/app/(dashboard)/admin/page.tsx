import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'


const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session)
  
  if(session?.user) {
    return (
      <div>Welcome back - {session?.user.username}</div>
    )
  }

  return (
    <div>Please login to see this page</div>
  )
}

export default page