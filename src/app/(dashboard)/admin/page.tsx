import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import  Sidebar, { SidebarItem } from '@/components/Sidebar';
import RootLayout from '../../layout'
import FileUpload from '@/components/FileUpload';



const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session)

  if(session?.user) {
    return (
      <RootLayout layout="sidebar">
        <div className='flex w-screen border border-primary border-red-600'>
        <Sidebar>
          <SidebarItem icon={undefined} text={'Calls'}></SidebarItem>
          <SidebarItem icon={undefined} text={'Scripts'}></SidebarItem>
          <SidebarItem icon={undefined} text={'Analytics'}></SidebarItem>
        </Sidebar>
        <div className='w-screen flex flex-col'>
          <div className='h-screen flex flex-row pt-10 pr-10'>
            <FileUpload />
          </div>
          <div className='h-screen flex flex-row pr-10'>
            <div className='flex w-3/5 h-3/5 items-center justify-center ml-9 border border-primary border-red-600'>Welcome back - {session?.user.username}</div>
            <div className='flex w-3/5 h-3/5 items-center justify-center ml-9 border border-primary border-red-600'>Welcome back - {session?.user.username}</div>
          </div>
        </div>
      </div>
      </RootLayout>
    )
  }

  return (
    <div>Please login to see this page</div>
  )
}

export default page