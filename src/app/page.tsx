import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Sidebar } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
      <h1 className='text-4xl'>
        <Link className={buttonVariants()} href='/admin'>
          Open my Admin
        </Link>

      {JSON.stringify(session)}
      </h1>

  )
}
