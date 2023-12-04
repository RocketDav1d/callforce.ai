import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'
import  Sidebar, { SidebarItem } from '@/components/Sidebar';
import UploadParentComponent from '@/components/UploadParentComponent';
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import RootLayout from '@/app/layout';
import prisma from '@/lib/db';
import GroupManager, { Group } from '@/components/GroupManager2';



type Session = {
    user: {
      name: string,
      email: string,
      image: string | null,
      username: string | null
    }
  }





const fetchGroups = async (userEmail: string) => {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        groups: {
          include: {
            chats: true, // Include chats for each group
          },
        },
      },
    });
  
    if (!user) {
      throw new Error('User not found');
    }
    return user.groups;
  };
  



// const Page = () => {
const page = async () => { 

    const session = await getServerSession(authOptions);

    let groupsData: Group[] = [];

    if (!session?.user) {
        throw new Error("User is not authenticated");
        }
    const userEmail = session.user.email;
    try {
        groupsData = await fetchGroups(userEmail!);
        console.log("Groups data inside Page.tsx" , groupsData)
        console.log("Chats data inside first Group Page.tsx" , groupsData[0].chats)
    } catch (error) {
    console.error('Error fetching groups:', error);
    }


    console.log("Session inside Page.tsx" , session)
    if(session?.user) {
        return (
            <RootLayout>
            <div className="flex w-screen h-screen overflow-hidden">
                {/* <div className='flex flex-row w-screen h-screen'> Flex container for sidebar and grid */}
                <div className='flex h-screen overflow-hidden'>
                    <Sidebar> 
                        <SidebarItem icon={undefined} text={'Calls'} href="/admin"></SidebarItem>
                        <SidebarItem icon={undefined} text={'Analytics'} href="/analytics"></SidebarItem>
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
                            <GroupManager initialGroups={groupsData} />
                        </div>
                    </div>
                    </div>
            </div>
                
            </RootLayout>
        )
    }

    return ( 
        <div>
            <h1> Please login to see this page </h1>
            <Link className={buttonVariants()} href='/sign-in'>
          Sign In
        </Link>
        </div>
    
    )

 }

export default page








// const fetchGroups = async (userEmail: string) => {
//     const user = await prisma.user.findUnique({
//         where: { email: userEmail },
//         select: {
//           id: true,
//           name: true,
//           username: true,
//           // Include other fields you want
//           groups: true,
//         },
//       })
//       if (!user) {
//         throw new Error('User not found')
//       }
//       return user.groups
// }







// const fetchChats = async (groupId: string, userEmail: string) => {
//     const chats = await prisma.group.findUnique({
//         where: {
//           id: groupId!,
//           user : {
//             email: userEmail
//           } // replace groupId with the actual id of the group
//         },
//         include: {
//           chats: true, // This will include all the chats associated with the group
//         },
//       });
//       if (!chats) {
//         throw new Error('Chats not found')
//       }
//       return chats
// }


// const prefetchGroups = async (queryClient: QueryClient, userEmail: string) => {
//     await queryClient.prefetchQuery(['groups'], () => fetchGroups(userEmail));
//   };



// export async function getServerSideProps(session: Session) {
//     const queryClient = new QueryClient();
//     if (!session?.user) {
//         throw new Error('User not found')
//     }
//     const userEmail = session.user!.email as string 
  
//     await prefetchGroups(queryClient, userEmail);
  
//     return {
//       props: {
//         dehydratedState: dehydrate(queryClient),
//       },
//     };
//   }
  