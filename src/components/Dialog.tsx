import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import React, { FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { group } from "console";



interface UploadDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (name: string, group: string) => void;
}

interface Group {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
}

export function UploadDialog({ isOpen, onOpenChange, onSave }: UploadDialogProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');



  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('/api/groups/get');
        setGroups(response.data.groups);
      } catch (error) {
        console.error('Error fetching groups:', error);
        // Handle error
      }
    };

    fetchGroups();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
    console.log("Name:", name)
    console.log("Group:", selectedGroup)
    onSave(name, selectedGroup); // Call the onSave callback when the form is submitted
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Create new Call</DialogTitle>
          <DialogDescription>
            Select the name and the associated group for the call.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Sales Call"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="group" className="text-right">
              Group
            </Label>
            <Select onValueChange={(value) => setSelectedGroup(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}






// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import React from "react";

// // Define the props that the Dialog component will accept
// interface DialogProps {
//   onSubmit: (values: { chatName: string; groupId: string }) => void;
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   children: React.ReactNode;
// }

// export function UploadDialog({ onSubmit, isOpen, onOpenChange, children }: DialogProps) {
//   // This would be inside your Dialog component
//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault(); // prevent default form submission behavior

//     // Gather the input data from the dialog form
//     const chatName = e.currentTarget.elements.namedItem('chatName') as HTMLInputElement;
//     const groupId = e.currentTarget.elements.namedItem('groupId') as HTMLInputElement;

//     // Prepare the values to pass to the submit handler
//     const dialogValues = {
//       chatName: chatName.value, // Value from the chat name input field
//       groupId: groupId.value, // Value from the group ID input field
//     };

//     // Call the function passed via props that will handle the mutation
//     onSubmit(dialogValues);

//     // Close the dialog after submission
//     onOpenChange(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogTrigger asChild>
//         <Button variant="outline">Upload Recording</Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Upload Recording</DialogTitle>
//             <DialogDescription>
//               Select the name and the associated group for the chat.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="chatName" className="text-right">
//                 Name
//               </Label>
//               <Input
//                 id="chatName"
//                 name="chatName"
//                 defaultValue=""
//                 required
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="groupId" className="text-right">
//                 Group ID
//               </Label>
//               <Input
//                 id="groupId"
//                 name="groupId"
//                 defaultValue=""
//                 required
//                 className="col-span-3"
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </form>
//         {children}
//       </DialogContent>
//     </Dialog>
//   );
// }

