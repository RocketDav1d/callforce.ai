'use client'
import { Root } from '@radix-ui/react-toast';
import React, { useEffect, useState } from 'react';
import RootLayout from './../../../layout';
import Sidebar,{ SidebarItem } from '@/components/Sidebar';
import MenuBarCall from '@/components/MenuBar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import TextareaForm from '@/components/TextAreaForm';
import axios, { AxiosError } from 'axios'; 
import { headers } from "next/headers"
import { ScrollArea } from "@/components/ui/scroll-area"
import { file } from 'googleapis/build/src/apis/file';
import Response from '@/components/Response';


 


type Prop = {
    params: {
      callId: string;
    }
  }

enum Role {
    USER,
    SYSTEM
  }

type Message = {
  id: string;
  content: string;
  createdAt: string;
  chatId: string;
  role: Role;
};


type Group = {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
};


type Chat = {
  id: string;
  fileKey: string;
  chatName: string;
  summary: string;
  transcript: string;
  pdfUrl: string;
  createdAt: string;
  userId: string;
  groupId: string;
  messages: Message[]; // Assuming Message is another type you might define
  group: Group;
};
  


const Page = ({params: {callId}}: Prop) => {
  const [chatData, setChatData] = useState<Chat | null>(null);
  const [apiResponse, setApiResponse] = useState({
    answer: '',
    context_text: ''
  });

  // const soemChatData = await fetch
  
  console.log("asdfjk")

  useEffect(() => {
    const fetchData = async () => {
      const rawResponse = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        // headers: Object.fromEntries(headers()),
        body: JSON.stringify({ callId })
      });
      const response = await rawResponse.json();
      setChatData(response);
    };

    fetchData();
  }, [callId]);

  const createMessage = async (message: Message) => {
    const response = await fetch('/api/create-message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message)
    });
    const responseData = await response.json();
    console.log("Create Message Response: ", responseData);
  }

  const getMessages = async (chatId: string) => {
    const response = await fetch('/api/get-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({chatId})
    });
    const responseData = await response.json();
  }

  useEffect(() => {
    getMessages(callId);
  }, [callId]);


  const handleApiResponse = (response: { answer: string; context_text: string }) => {
    setApiResponse(response);
  };

  if (!chatData) {
    return <div>Loading...</div>; // Or any other loading state
  }

  const { chatName, summary, fileKey } = chatData;


  return (
    <div className="flex w-screen h-screen overflow-hidden"> {/* Ensures the overall page doesn't scroll */}
      <Sidebar> {/* Sidebar */}
        <SidebarItem icon={undefined} text={'Calls'}></SidebarItem>
        <SidebarItem icon={undefined} text={'Scripts'}></SidebarItem>
        <SidebarItem icon={undefined} text={'Analytics'}></SidebarItem>
      </Sidebar>

      <div className="flex-grow flex flex-col"> {/* Container for the content next to the sidebar */}
        <div className="flex justify-between p-4 border-b"> {/* Top title and menu bar */}
          <h1 className="text-2xl font-bold">{chatName}</h1>
          <MenuBarCall />
        </div>

        <div className="flex flex-grow"> {/* Middle section for main containers  overflow-hidden*/} 

          <div className="w-1/4 p-4 border-r"> {/* Left container (1/3)  overflow-auto no-scrollbar*/}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Details</CardTitle>
                <CardDescription>Summary</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-full w-full rounded-md border p-4">
                  <p>{summary}</p>
                </ScrollArea>
                {/* <p>{summary}</p> */}
              </CardContent>
            </Card>
          </div>

          <div className="flex-1 p-4 "> {/* Right container (2/3) overflow-auto no-scrollbar*/}
          <Card className='w-full mr-5'>
            <CardHeader>
              <CardTitle>Create New Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <TextareaForm file_key={fileKey} onFormSubmit={handleApiResponse}/>
              <Response />
            </CardContent>
          </Card>
          </div>

        </div>
      </div>
    </div>
  );
};


export default Page;




// return (
//   <>
//       <div className='flex flex-row w-screen h-screen'> {/* Flex container for sidebar and grid */}
//           <Sidebar> {/* Sidebar remains flex item, not affected by grid */}
//           <SidebarItem icon={undefined} text={'Calls'}></SidebarItem>
//           <SidebarItem icon={undefined} text={'Scripts'}></SidebarItem>
//           <SidebarItem icon={undefined} text={'Analytics'}></SidebarItem>
//           </Sidebar>

//           <div className=" w-screen parent grid grid-cols-5 grid-rows-5 m-20 border border-red">
//               <div className="div1 col-start-1 row-start-1 col-span-1 row-span-1">
//                 <MenuBarCall/>
//               </div>
//               <div className="div2 col-start-2 row-start-1 col-span-1 row-span-1">
//               </div>
//               <div className="div3 col-start-3 row-start-1 col-span-1 row-span-1">

//               </div>
//               <div className="div4 col-start-1 row-start-2 col-span-3 row-span-1">

//               </div>
//           </div>
//           </div>
//         </>
// )




















      // <RootLayout layout="sidebar">
      //   <div className='flex w-screen border border-primary border-red-600'>
      //   <Sidebar>
      //     <SidebarItem icon={undefined} text={'Calls'}></SidebarItem>
      //     <SidebarItem icon={undefined} text={'Scripts'}></SidebarItem>
      //     <SidebarItem icon={undefined} text={'Analytics'}></SidebarItem>
      //   </Sidebar>
      //   <MenuBarCall/>
      //   </div>

      // </RootLayout>




// import { chats } from '@/lib/db/schema';
// import { auth } from '@clerk/nextjs';
// import { redirect } from 'next/navigation';
// import React from 'react';
// import { eq } from 'drizzle-orm'
// import {db} from '@/lib/db';

// type Prop = {
//   params: {
//     chatId: string;
//   }
// }

// const ChatPage =  async ({params: {chatId}}: Prop) => {
//   const {userId} = await auth();
//   if (!userId) {
//     return redirect('/sign-in');
//   }
//   const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
//   if (!_chats) {
//     return redirect("/");

//   }
//   // if (!_chats.find(chat=> chat.id === parseInt(chatId))) {
//   //   return redirect("/");
//   // }

//   return (
//     <div className='flex max-h-screen overflow-scroll'>
//       <div className='flex w-full max-h-screen overflow-scroll'>
//         {/* chat sidebar */}
//         <div className='flex-[1] max-w-xs'>
//           {/* <ChatSideBar/> */}
//         </div>
//         {/* pdf viewer */}
//         <div className='max-h-screen p-4 overflow-scroll flex-[5]'>
//           {/* <PDFViewer/> */}
//         </div>
//         {/* chat component */}
//         <div className='flex-[3] border-l-4 border-l-slate-200'>
//           {/* <ChatComponent/> */}
//         </div>
//       </div>
//     </div>
//   )
// }


// export default ChatPage;