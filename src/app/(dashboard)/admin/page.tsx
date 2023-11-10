import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React, { useState } from 'react'
import  Sidebar, { SidebarItem } from '@/components/Sidebar';
import RootLayout from '../../layout'
import FileUpload from '@/components/FileUpload';
import FileUpload2 from '@/components/FileUpload2';
import Calendar from '@/components/UpcomingEvents';
import UpcomingEvents from '@/components/UpcomingEvents';
import GroupManager from '@/components/GroupManager';
import { Button } from '@/components/ui/button';

import { Dialog } from '@radix-ui/react-dialog';
import { UploadDialog } from '@/components/Dialog';
import UploadParentComponent from '@/components/UploadParentComponent';

const page = async () => {
  const session = await getServerSession(authOptions);

  if(session?.user) {
    return (
      <RootLayout>
        <div>
        {/* <div className='flex w-screen'> */}
        <Sidebar>
          <SidebarItem icon={undefined} text={'Calls'}></SidebarItem>
          <SidebarItem icon={undefined} text={'Scripts'}></SidebarItem>
          <SidebarItem icon={undefined} text={'Analytics'}></SidebarItem>
        </Sidebar>
        {/* <div className='w-screen flex flex-col'> */}
        <div>
          {/* <div className='h-screen flex flex-row pt-10 pr-10'> */}
          <div>
            {/* <FileUpload /> */}

            <UploadParentComponent/>
            {/* <UpcomingEvents /> */}
            <GroupManager />
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