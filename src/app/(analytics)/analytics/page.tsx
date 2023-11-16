import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React, { useState } from 'react'
import  Sidebar, { SidebarItem } from '@/components/Sidebar';
import RootLayout from '../../layout'
import FileUpload from '@/components/FileUpload';
import FileUpload2 from '@/components/FileUpload2';
import Calendar from '@/components/UpcomingEvents';
import UpcomingEvents from '@/components/UpcomingEvents';
import GroupManager from '@/components/GroupManager2';
import { Button } from '@/components/ui/button';
import { Dialog } from '@radix-ui/react-dialog';
import { UploadDialog } from '@/components/Dialog';
import UploadParentComponent from '@/components/UploadParentComponent';

{/* <UpcomingEvents /> */}
{/* <GroupManager /> */}

const page = async () => { 
    const session = await getServerSession(authOptions);
    if(session?.user) {
        return (
            <RootLayout>
                <div className='flex flex-row w-screen h-screen'> {/* Flex container for sidebar and grid */}
                    <Sidebar> {/* Sidebar remains flex item, not affected by grid */}
                    <SidebarItem icon={undefined} text={'Calls'} href="/admin"></SidebarItem>
                    <SidebarItem icon={undefined} text={'Analystics'} href="/analytics"></SidebarItem>
                    <SidebarItem icon={undefined} text={'Settings'} href="/settings"></SidebarItem>
                    </Sidebar>

                    {/* <div className=" w-screen parent grid grid-cols-5 grid-rows-5 m-20 border border-red-600"> */}
                    <div className="w-screen grid grid-cols-5 grid-rows-5 m-10 gap-y-52">
                        <h2>coming soon !</h2>
                    </div>
                    </div>
            </RootLayout>
        )
    }

    return ( <h1> Please login to see this page </h1>)

 }

export default page