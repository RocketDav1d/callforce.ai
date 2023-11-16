import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import User from '@/components/User'
import { useSession } from 'next-auth/react';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className='text-4xl'>
      {session ? (
        // If logged in, show button to admin page
      
        <Link className={buttonVariants()} href='/admin2'>
          Open my Admin
        </Link>
      ) : (
        // If not logged in, show button to sign-in page
        <Link className={buttonVariants()} href='/sign-in'>
          Sign In
        </Link>
      )}

      {/* Optionally display user info and session details */}
      <h2>User Session</h2>
      {session && <p>{session.user?.email}</p>}
    </div>
  )
}
