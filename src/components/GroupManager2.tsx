'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { set } from 'react-hook-form';
import Link from 'next/link';

type Group = {
  id: string;
  name: string;
  chats?: Chat[]; // Add this line
  // Include other properties of a group here
};

type Chat = {
  id: string;
  chatName: string;
  createdAt: string;
  summary: string;
  fileKey: string;
  // Include other properties of a chat here
};

const GroupManager = () => {
  // const [groups, setGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [chats, setChats] = useState<Group[]>([]);

  const [newGroupName, setNewGroupName] = useState('');

  // const getChatsFromGroup = async (group: Group) => {
  //   const response = await fetch(`/api/groups/get-chats/?groupId=${group.id}`);
  //   const responseData = await response.json();
  //   if (response.ok) {
  //     // setMessages(responseData);
  //     group.chats = responseData.chats;
  //     console.log("Inside getChatsFromGroup", responseData.chats);
  //     setGroups(groups.map(g => g.id === group.id ? { ...g, chats: responseData.chats } : g));

  //   } else {
  //     setChats(responseData);
  //     console.error('Failed to fetch messages:', responseData);
  //   }
  
  const getChatsFromGroup = async (group: Group) => {
    const response = await fetch(`/api/groups/get-chats/?groupId=${group.id}`);
    const responseData = await response.json();
    if (response.ok) {
      // Use functional form of setState to ensure we're working with the most current state
      setGroups(currentGroups => currentGroups.map(g => {
        if (g.id === group.id) {
          // Be sure to spread any other group properties you may need
          return { ...g, chats: responseData.chats };
        } else {
          return g;
        }
      }));
    } else {
      console.error('Failed to fetch chats:', responseData);
    }
  }

  useEffect(() => {
    const loadGroups = async () => {
      const res = await fetch('/api/groups/get');
      const data = await res.json();
      if (data.groups && Array.isArray(data.groups)) {
        // Fetch all chats for all groups before updating the state
        const groupsWithChats = await Promise.all(data.groups.map(async (group: Group) => {
          const response = await fetch(`/api/groups/get-chats/?groupId=${group.id}`);
          const responseData = await response.json();
          if (response.ok) {
            return { ...group, chats: responseData.chats };
          } else {
            console.error('Failed to fetch chats for group:', group.id, responseData);
            return group; // Return the group without chats if the fetch failed
          }
        }));
        console.log("Groups with Chats", groupsWithChats);
        setGroups(groupsWithChats);
      } else {
        console.error('Unexpected data structure for groups:', data);
      }
    };
    loadGroups();
  }, []);
  
  

  const handleAddGroup = async () => {
    if (newGroupName) {
      console.log("Inside handleAddGroup", newGroupName);
      // Save the new group to the database
      const response = await axios.post(`/api/groups/create`, { name: newGroupName },
      {
        headers: {
            'Content-Type': 'application/json'
          }
      }
      
      );
      console.log(response.data);

      // Update the local state
      setGroups([...groups, response.data]);
      setNewGroupName('');
    }
  };
  
  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  }

  return (
    <div className='w-full mb-5 overflow-auto' style={{ maxHeight: '500px' }}>
    <Card className='p-5'>
       <CardTitle className='pb-5'>Calls</CardTitle>
       <div className="flex w-full max-w-sm items-center space-x-2 pb-5">
          <Input 
            type="text" 
            value={newGroupName} 
            onChange={(e) => setNewGroupName(e.target.value)} 
            placeholder="Group"
            />
          <Button type="submit" onClick={handleAddGroup}>Add new Group</Button>
      </div>
    <Accordion type="single" collapsible className="w-full">
          {groups.map((group, index) => (
            console.log("Inside GroupManager", group),
            <AccordionItem key={index} value={`group-${index}`}>
              <AccordionTrigger>{group.name}</AccordionTrigger>
              <AccordionContent>
                {group.chats && group.chats.map((chat, chatIndex) => (

                <Card key={chatIndex} className="flex justify-between items-center p-4 border rounded shadow-sm mb-4"> {/* Adjust padding, border, rounded corners, and shadow as needed */}
                <div className="flex items-center space-x-4"> {/* This holds the chat name and date */}
                  <CardHeader className="font-bold text-lg">{chat.chatName}</CardHeader> {/* Adjust font size as needed */}
                  <span className="text-sm">{formatDate(chat.createdAt)}</span> {/* Adjust font size as needed */}
                </div>
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Link href={`/calls/${chat.id}`}>
                    <a>View Call</a> {/* Ensure the button is clickable and styled correctly */}
                  </Link>
                </Button>
                </Card>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </Card>
        </div>
  );
};

export default GroupManager;








































// 'use client'
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { set } from 'react-hook-form';
// import Link from 'next/link';
// import { useQuery, useQueryClient } from 'react-query';
// import RootLayout from '../app/layout';



// type Group = {
//   id: string;
//   name: string;
//   chats?: Chat[]; // Add this line
//   // Include other properties of a group here
// };

// type Chat = {
//   id: string;
//   chatName: string;
//   createdAt: string;
//   summary: string;
//   fileKey: string;
//   // Include other properties of a chat here

// };


// // new  
// const fetchGroups = async () => {
//   const response = await fetch('/api/groups/get');
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   const data = await response.json();
//   return data.groups;
// };


// const GroupManager = () => {
//   // const [groups, setGroups] = useState<string[]>([]);

//   // old
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [newGroupName, setNewGroupName] = useState('');


//   // // new 
//   // const queryClient = useQueryClient();
//   // const { data: groups, isLoading, isError } = useQuery('groups', fetchGroups);

//   // const handleAddGroup = async () => {
//   //   if (newGroupName) {
//   //     const response = await axios.post('/api/groups/create', { name: newGroupName });
//   //     // Invalidate and refetch groups data
//   //     queryClient.invalidateQueries('groups');
//   //     setNewGroupName('');
//   //   }
//   // };


//   // if (isLoading) return <div>Loading...</div>;
//   // if (isError) return <div>Error loading groups</div>;



// // old
//   useEffect(() => {
//     const loadGroups = async () => {
//       const res = await fetch('/api/groups/get');
//       const data = await res.json();
//       if (data.groups && Array.isArray(data.groups)) {
//         // Fetch all chats for all groups before updating the state
//         const groupsWithChats = await Promise.all(data.groups.map(async (group: Group) => {
//           const response = await fetch(`/api/groups/get-chats/?groupId=${group.id}`);
//           const responseData = await response.json();
//           if (response.ok) {
//             return { ...group, chats: responseData.chats };
//           } else {
//             console.error('Failed to fetch chats for group:', group.id, responseData);
//             return group; // Return the group without chats if the fetch failed
//           }
//         }));
//         console.log("Groups with Chats", groupsWithChats);
//         setGroups(groupsWithChats);
//       } else {
//         console.error('Unexpected data structure for groups:', data);
//       }
//     };
//     loadGroups();
//   }, []);
  
  

//   const handleAddGroup = async () => {
//     if (newGroupName) {
//       console.log("Inside handleAddGroup", newGroupName);
//       // Save the new group to the database
//       const response = await axios.post(`/api/groups/create`, { name: newGroupName },
//       {
//         headers: {
//             'Content-Type': 'application/json'
//           }
//       }
      
//       );
//       console.log(response.data);

//       // Update the local state
//       setGroups([...groups, response.data]);
//       setNewGroupName('');
//     }
//   };
  
//   function formatDate(dateString: string): string {
//     const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
//     return new Date(dateString).toLocaleDateString('de-DE', options);
//   }

//   return (
//     <RootLayout>
//     <div className='w-full max-h-[500px] overflow-auto'>
//       <Card className='p-5'>
//         <CardTitle className='pb-5'>Calls</CardTitle>
//         <div className="flex w-full max-w-sm items-center space-x-2 pb-5">
//           <Input 
//             type="text" 
//             value={newGroupName} 
//             onChange={(e) => setNewGroupName(e.target.value)} 
//             placeholder="Group"
//           />
//           <Button type="submit" onClick={handleAddGroup}>Add new Group</Button>
//         </div>
//         <Accordion type="single" collapsible className="w-full">
//           {groups?.map((group: Group, index: any) => (
//             <AccordionItem key={index} value={`group-${index}`}>
//               <AccordionTrigger>{group.name}</AccordionTrigger>
//               <AccordionContent>
//                 {group.chats?.map((chat, chatIndex) => (
//                   <Card key={chatIndex} className="flex justify-between items-center p-4 border rounded shadow-sm">
//                     <div className="flex items-center space-x-4">
//                       <CardHeader className="font-bold text-lg">{chat.chatName}</CardHeader>
//                       <span className="text-sm">{formatDate(chat.createdAt)}</span>
//                     </div>
//                     <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
//                       <Link href={`/calls/${chat.id}`}>
//                         <a>View Call</a>
//                       </Link>
//                     </Button>
//                   </Card>
//                 ))}
//               </AccordionContent>
//             </AccordionItem>
//           ))}
//         </Accordion>
//       </Card>
//     </div>
//     </RootLayout>
//   );
// };

// export default GroupManager;







// old jsx code 
  // return (
  //   <div className='w-full max-h-[500px] overflow-auto'>
  //   <Card className='p-5'>
  //      <CardTitle className='pb-5'>Calls</CardTitle>
  //      <div className="flex w-full max-w-sm items-center space-x-2 pb-5">
  //         <Input 
  //           type="text" 
  //           value={newGroupName} 
  //           onChange={(e) => setNewGroupName(e.target.value)} 
  //           placeholder="Group"
  //           />
  //         <Button type="submit" onClick={handleAddGroup}>Add new Group</Button>
  //     </div>
  //   <Accordion type="single" collapsible className="w-full">
  //         {groups.map((group, index) => (
  //           console.log("Inside GroupManager", group),
  //           <AccordionItem key={index} value={`group-${index}`}>
  //             <AccordionTrigger>{group.name}</AccordionTrigger>
  //             <AccordionContent>
  //               {group.chats && group.chats.map((chat, chatIndex) => (

  //               <Card key={chatIndex} className="flex justify-between items-center p-4 border rounded shadow-sm"> {/* Adjust padding, border, rounded corners, and shadow as needed */}
  //               <div className="flex items-center space-x-4"> {/* This holds the chat name and date */}
  //                 <CardHeader className="font-bold text-lg">{chat.chatName}</CardHeader> {/* Adjust font size as needed */}
  //                 <span className="text-sm">{formatDate(chat.createdAt)}</span> {/* Adjust font size as needed */}
  //               </div>
  //               <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  //                 <Link href={`/calls/${chat.id}`}>
  //                   <a>View Call</a> {/* Ensure the button is clickable and styled correctly */}
  //                 </Link>
  //               </Button>
  //               </Card>
  //               ))}
  //             </AccordionContent>
  //           </AccordionItem>
  //         ))}
  //       </Accordion>
  //       </Card>
  //       </div>
  // );




// was not used in the previous code
  
  // const getChatsFromGroup = async (group: Group) => {
  //   const response = await fetch(`/api/groups/get-chats/?groupId=${group.id}`);
  //   const responseData = await response.json();
  //   if (response.ok) {
  //     // Use functional form of setState to ensure we're working with the most current state
  //     setGroups(currentGroups => currentGroups.map(g => {
  //       if (g.id === group.id) {
  //         // Be sure to spread any other group properties you may need
  //         return { ...g, chats: responseData.chats };
  //       } else {
  //         return g;
  //       }
  //     }));
  //   } else {
  //     console.error('Failed to fetch chats:', responseData);
  //   }
  // }













// import React, { useState } from 'react';

// const GroupManager = () => {
//   const [groups, setGroups] = useState<string[]>([]);
//   const [newGroupName, setNewGroupName] = useState('');

//   const handleAddGroup = () => {
//     if (newGroupName) {
//       setGroups([...groups, newGroupName]);
//       setNewGroupName('');
//     }
//   };

//   return (
//     <div style={{ width: '100%', height: '25vh', overflowY: 'scroll', border: "1 | 2 | black"}}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//         <h1>Calls</h1>
//         <div>
//           <input
//             type="text"
//             value={newGroupName}
//             onChange={(e) => setNewGroupName(e.target.value)}
//             placeholder="Group name"
//           />
//           <button onClick={handleAddGroup}>Add Group</button>
//         </div>
//       </div>
//       {groups.map((group, index) => (
//         <div key={index} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
//           <h2>{group}</h2>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default GroupManager;