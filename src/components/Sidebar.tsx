'use client'
import { FC, ReactNode, useState, useContext, createContext } from "react";
import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import Image from 'next/image';
import { Button } from "./ui/button";
import { useSession } from 'next-auth/react'
import User from '@/components/User'
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from 'next/link';

interface SidebarProps {
  children: ReactNode;
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  active?: boolean;
  alert?: boolean;
}

interface SidebarContextProps {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const { data: session } = useSession()

  console.log(session)

  const email = session?.user.email

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
            <Image
            src="https://img.logoipsum.com/269.svg"
            width={50}  
            height={50} 
            className={`m-0 overflow-hidden transition-all ${expanded ? "w-20" : "w-0"}`}
            alt=""
            />

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >

            {/* <div className="leading-4">
              <h4 className="font-semibold">{email}</h4>
            </div> */}
            <Button onClick={() => 
                signOut({
                  redirect: true,
                  callbackUrl: `${window.location.origin}/sign-in`,
                })
              } 
              variant='destructive'>
                Sign Out
            </Button>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

const SidebarItem: FC<SidebarItemProps> = ({ icon, text, href, active, alert }) => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar");
  }

  const { expanded } = context;

  return (

    <Link legacyBehavior href={href!}>
    <a className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800" : "hover:bg-indigo-50 text-gray-600"} w-full`}>
      {icon && <span className='mr-3'>{icon}</span>}
      <span className="flex-1">{text}</span>
      {alert && <span className="absolute right-2 w-2 h-2 rounded-full bg-red-500"/>}
    </a>
  </Link>


    // <li
    //   className={`
    //     relative flex items-center py-2 px-3 my-1
    //     font-medium rounded-md cursor-pointer
    //     transition-colors group
    //     ${
    //       active
    //         ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
    //         : "hover:bg-indigo-50 text-gray-600"
    //     }
    // `}
    // >
    //   {href ? (
    //     <Link href={href}>
    //       {icon}
    //       {text}
    //       {/* <a className="flex items-center py-2 px-3 my-1 ...">
    //         {icon}
    //         <span className={`...`}>
    //           {text}
    //         </span>
    //       </a> */}
    //     </Link>
    //   ) : (
    //     <div className="flex items-center py-2 px-3 my-1 ...">
    //       {icon}
    //       <span className={`...`}>
    //         {text}
    //       </span>
    //     </div>
    //   )}
    //   {icon}
    //   <span
    //     className={`overflow-hidden transition-all ${
    //       expanded ? "w-52 ml-3" : "w-0"
    //     }`}
    //   >
    //     {text}
    //   </span>
    //   {alert && (
    //     <div
    //       className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
    //         expanded ? "" : "top-2"
    //       }`}
    //     />
    //   )}

    //   {!expanded && (
    //     <div
    //       className={`
    //       absolute left-full rounded-md px-2 py-1 ml-6
    //       bg-indigo-100 text-indigo-800 text-sm
    //       invisible opacity-20 -translate-x-3 transition-all
    //       group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
    //   `}
    //     >
    //       {text}
    //     </div>
    //   )}
    // </li>
  )
};

export default Sidebar;
export { SidebarItem };
