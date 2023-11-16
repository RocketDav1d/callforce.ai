'use client'
import React, { useState } from 'react';
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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// This would be the parent component that contains the button to open the dialog
const UploadParentComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [dialogData, setDialogData] = useState({ name: '', groupId: '' });


  const handleSaveChanges = (name: string, groupId: string) => {
    setDialogData({ name, groupId }); // Store the input data
    setIsDialogOpen(false); // Close the dialog
    setShowFileUpload(true); // Show the FileUpload component
  };

  // This will be called when the file upload is successful or if there's an error
  const handleFileUploadComplete = (success: boolean) => {
    setShowFileUpload(false); // This will hide FileUpload and show the "Add New Call" button
    // You can also reset dialogData or perform other state cleanup here if needed
  };

  return (
    <>
        {!showFileUpload && (
      <Button onClick={() => setIsDialogOpen(true)}>Add New Call</Button>
    )}

      <UploadDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen} 
        onSave={handleSaveChanges}
        />

        {showFileUpload && (
        <FileUpload2
          dialogData={dialogData}
          onUploadComplete={handleFileUploadComplete}
        />
      )}

    </>
  );

};


export default UploadParentComponent;