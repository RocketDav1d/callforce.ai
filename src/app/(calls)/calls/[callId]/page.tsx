'use client'
import React, { useEffect, useState } from 'react';
import Sidebar,{ SidebarItem } from '@/components/Sidebar';
import MenuBarCall from '@/components/MenuBar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import TextareaForm from '@/components/TextAreaForm';
import { ScrollArea } from "@/components/ui/scroll-area"
import Response from '@/components/Response';
import cuid from 'cuid';
import { toast } from "@/components/ui/use-toast"
import authOptions from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { ArrowLeft } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import HubspotTable from '@/components/HubspotTable';



 


type Prop = {
    params: {
      callId: string;
    }
  }

enum Role {
    USER = 'USER',
    SYSTEM = 'SYSTEM'
  }

type Message = {
  id: string;
  content: string;
  createdAt: string;
  chatId: string;
  role: Role;
  prompt: string;
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

const truncateSummary = (summary: string, wordCount: number) => {
  return summary.split(" ").slice(0, wordCount).join(" ") + '…';
};
  


const Page = ({params: {callId}}: Prop) => {

  const [chatData, setChatData] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [displaySummary, setDisplaySummary] = useState('');

  useEffect(() => {
    if (chatData) {
      setDisplaySummary(truncateSummary(chatData.summary, 100));
    }
  }, [chatData]);

  const handleReadAllClick = () => {
    setIsDialogOpen(true);
  };

  // const [apiResponse, setApiResponse] = useState({
  //   answer: '',
  //   context_text: ''
  // });

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
    try {
      const response = await fetch('/api/message/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Error creating message');
      }
  
      console.log("Create Message Response: ", responseData);
      return responseData; // Return the response data for the caller to handle
    } catch (error) {
      console.error("Error in createMessage:", error);
      toast({
            title: "Something went wrong :(",
            description: "Please try again later."
          })
      throw error; // Rethrow the error for the caller to handle
      }}


  const getMessages = async (chatId: string) => {
    const response = await fetch(`/api/message/get/?chatId=${chatId}`);
    const responseData = await response.json();
    if (response.ok) {
      setMessages(responseData); // Assuming the response has a 'messages' field
    } else {
      // Handle errors here
      console.error('Failed to fetch messages:', responseData);
    }
  }

  useEffect(() => {
    getMessages(callId);
  }, [callId]);


  // const handleApiResponse = (response: { answer: string; context_text: string }) => {
  //   setApiResponse(response);
  //   console.log("API Response: ", response);
  // };


  const handleFormSubmit = async (response: { answer: string; context_text: string, createdAt: string, prompt: string }) => {
    // You need to define what the role should be, here I'm assuming USER role.
    const newMessage = {
      id: cuid(),
      content: response.answer,
      createdAt: response.createdAt,
      chatId: callId,
      role: Role.USER, // or SYSTEM, depending on the logic of your app
      prompt: response.prompt
    };
    try {
      const createdMessage = await createMessage(newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }
    catch (error) {
      console.error("Error in handleFormSubmit:", error);
      toast({
            title: "Something went wrong :(",
            description: "Message not created. Please try again later."
          })
    throw error; 
    }
  };



  if (!chatData) {
    return <div>Loading...</div>; // Or any other loading state
  }

  const { chatName, summary, fileKey } = chatData;


  const handleEditMessage = async (id: string) => {
    // Logic to handle editing message
    // This might involve setting some state to show an input field for editing
    // and then sending a PATCH or PUT request to your API
  };

  const handleDeleteMessage = async (messageId: string) => {
    console.log("Delete Message Request: ", messageId);
    try {
      const response = await fetch('/api/message/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageId)
      });
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Error deleting message');
      }
  
      console.log("Delete Message Response: ", responseData);
      setMessages(prevMessages => prevMessages.filter(message => message.id !== messageId));
      toast({
        title: "Message deleted",
      })
    } catch (error) {
      console.error("Error in createMessage:", error);
      toast({
            title: "Something went wrong :(",
            description: "Message not deleted. Please try again later."
          })
      }}


  return (
    <div className="flex w-screen h-screen overflow-hidden"> {/* Ensures the overall page doesn't scroll */}
      <Sidebar> {/* Sidebar remains flex item, not affected by grid */}
        <SidebarItem icon={undefined} text={'Calls'} href="/admin2"></SidebarItem>
        <SidebarItem icon={undefined} text={'Analystics'} href="/analytics"></SidebarItem>
        <SidebarItem icon={undefined} text={'Settings'} href="/settings"></SidebarItem>
      </Sidebar>

      <div className="flex-grow flex flex-col"> {/* Container for the content next to the sidebar */}
        <div className="flex justify-between p-4 border-b"> {/* Top title and menu bar */}
          <div className="flex items-center">
            <a href="/admin2">
              <ArrowLeft className="h-6 w-6 mr-2"/>
            </a>
            <h1 className="text-2xl font-bold">{chatName}</h1>
          </div>
          <MenuBarCall />
        </div>

        <div className="flex flex-grow"> {/* Middle section for main containers  overflow-hidden*/} 

          <div className="w-1/4 p-4 border-r"> {/* Left container (1/3)  overflow-auto no-scrollbar*/}
            <Card>
              <CardHeader>
                <CardTitle>Meeting Details</CardTitle>
                <CardDescription className='pt-5'>
                  <p>{displaySummary}</p>
                  <button onClick={handleReadAllClick} className="text-blue-600 hover:underline">
                    Read all
                  </button>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* <ScrollArea className="h-full w-full rounded-md border p-4">
                  <p>{summary}</p>
                </ScrollArea> */}
                {/* <p>{summary}</p> */}
              </CardContent>
            </Card>
          </div>

          {chatData && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent>
                <DialogTitle>Full Summary</DialogTitle>
                <DialogDescription>
                  {chatData.summary}
                </DialogDescription>
              </DialogContent>
            </Dialog>
          )}

          <div className="flex-1 p-4 border"> {/* Right container (2/3) overflow-auto no-scrollbar*/}

          <Tabs defaultValue="questions" className="w-full">
          < TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="questions">Ask Questions</TabsTrigger>
              <TabsTrigger value="hubspot">Hubspot</TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <Card className='w-full mr-5'>
              <CardHeader>
                <CardTitle>Create New Answer</CardTitle>
              </CardHeader>
              <CardContent>
                <TextareaForm file_key={fileKey} onFormSubmit={handleFormSubmit}/>
              </CardContent>
            </Card>
            <div className="w-full"
              style={{
                overflowY: 'scroll',
                msOverflowStyle: 'none', /* IE and Edge */
                scrollbarWidth: 'none' /* Firefox */
              }}
            >
            {/* Render messages using the Response component */}
            {messages && messages.map((message) => (
            <Response
              key={message.id}
              id={message.id}
              query={message.prompt}
              answer={message.content}
              onEdit={handleEditMessage}
              onDelete={handleDeleteMessage}
              />
              ))}
            </div>
          </TabsContent>


          <TabsContent value="hubspot">
              <HubspotTable/>
          </TabsContent>

          </Tabs>



          </div>

        </div>
      </div>
    </div>
  );
};


export default Page;













  // const createMessage = async (message: Message) => {
  //   try {
  //   const response = await fetch('/api/message/create', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(message)
  //   });
  //   const responseData = await response.json();
    
  //   if (!response.ok) {
  //     throw new Error(responseData.message || 'Error creating message');
  //   }

  //   console.log("Create Message Response: ", responseData);
  //   setMessages((prevMessages) => [...prevMessages, responseData]);
    
  //   }
  // catch (error) {
  //   console.log("Error creating message: ", error);
  //   toast({
  //     title: "Something went wrong :(",
  //   })
  // }