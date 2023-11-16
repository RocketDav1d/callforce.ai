'use client'
import React, { FormEvent, useEffect, useState } from 'react';
import { UploadDialog } from './Dialog'; // Adjust the import path as necessary
import FileUpload2 from './FileUpload2'; // Adjust the import path as necessary
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import FileUpload from './FileUpload';
import axios from 'axios';


interface Group {
  id: string;
  name: string;
  createdAt: string;
  userId: string;
}

// This would be the parent component that contains the button to open the dialog
const UploadParentComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [dialogData, setDialogData] = useState({ name: '', groupId: '' });

  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('');

  const canUpload = dialogData.name.trim() !== '' && dialogData.groupId.trim() !== '';



  const handleSaveChanges = (name: string, groupId: string) => {
    setDialogData({ name, groupId }); // Store the input data
    setIsDialogOpen(false); // Close the dialog
    setShowFileUpload(true); // Show the FileUpload component
    setShowFileUpload(canUpload);
  };

  // This will be called when the file upload is successful or if there's an error
  const handleFileUploadComplete = (success: boolean) => {
    setShowFileUpload(false); // This will hide FileUpload and show the "Add New Call" button
    // You can also reset dialogData or perform other state cleanup here if needed
  };

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
    // Set the dialogData with the form values
    setDialogData({ name, groupId: selectedGroup });

    // Check if both fields are filled before showing FileUpload component
    if (name.trim() !== '' && selectedGroup.trim() !== '') {
      setShowFileUpload(true);
    }
    console.log("Name:", name, "Group:", selectedGroup);
  };

  const handleCancel = () => {
    setShowFileUpload(false); // Hide the FileUpload2 component
    // Optionally reset other states if necessary
  };

  return (
    <>
      <Card className="w-[400px] h-[350px]">
      <form onSubmit={handleSubmit}>
      <CardHeader>
        <CardTitle>Upload Recording</CardTitle>
        <CardDescription>Analyse your recording in one click</CardDescription>
      </CardHeader>
      <CardContent>
      {showFileUpload ? (
      <FileUpload2
      dialogData={dialogData}
      onUploadComplete={handleFileUploadComplete}
    />
    ) : (
          <div className="flex flex-col space-y-4">
          {/* <div className="grid grid-cols-2 gap-4"> */}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Recording Name</Label>
              <Input id="name" placeholder="e.g. Sales Call" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Group</Label>
              <Select onValueChange={(value) => setSelectedGroup(value)}>
                {/* <SelectTrigger className="w-[180px]"> */}
                <SelectTrigger className="w-full">
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
          )}
          </CardContent>
            <CardFooter className="mt-auto">
            {/* <CardFooter className="flex justify-between"> */}
              {/* <Button variant="outline">Cancel</Button>
              <Button type="submit">Save</Button> */}
              {showFileUpload ? (
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            ) : (
              <>
                {/* Only show the "Save" button when FileUpload2 is not shown */}
                <span></span> {/* Empty span to maintain spacing */}
                <Button type="submit">Save</Button>
              </>
            )}
          </CardFooter>
      </form>
    </Card>
    </>
  );
};
export default UploadParentComponent;