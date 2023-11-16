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
import { useSession } from 'next-auth/react'

{/* <UpcomingEvents /> */}
{/* <GroupManager /> */}

// const Page = () => {
const page = async () => { 


    const session = await getServerSession(authOptions);
    if(session?.user) {
        return (
            // <RootLayout>
            <div className="flex w-screen h-screen overflow-hidden">
                {/* <div className='flex flex-row w-screen h-screen'> Flex container for sidebar and grid */}
                <div className='flex h-screen overflow-hidden'>
                    <Sidebar> 
                        <SidebarItem icon={undefined} text={'Calls'} href="/admin2"></SidebarItem>
                        <SidebarItem icon={undefined} text={'Analystics'} href="/analytics"></SidebarItem>
                        <SidebarItem icon={undefined} text={'Settings'} href="/settings"></SidebarItem>
                    </Sidebar>


                

                    {/* <div className=" w-screen parent grid grid-cols-5 grid-rows-5 m-20 border border-red-600"> */}
                    <div className="w-screen grid grid-cols-5 grid-rows-5 m-10 gap-y-52">
                        <div className="div1 col-start-1 row-start-1 col-span-1 row-span-1">
                            <UploadParentComponent />
                        </div>
                        <div className="div2 col-start-2 row-start-1 col-span-1 row-span-1">
                        </div>
                        <div className="div3 col-start-3 row-start-1 col-span-1 row-span-1">
                            {/* <UpcomingEvents /> */}
                        </div>
                        {/* <div className="div4 col-start-1 row-start-2 col-span-3 row-span-1"> */}
                        <div className="col-span-full row-start-2 mt-40">
                            <GroupManager/>
                        </div>
                    </div>
                    </div>
            </div>
                
            // </RootLayout>
        )
    }

    return ( <h1> Please login to see this page </h1>)

 }

export default page




