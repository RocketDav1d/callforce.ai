'use client'
import { Inbox, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { uploadToS3 } from '@/lib/s3'
import { useMutation, useQueryClient, UseMutateFunction } from '@tanstack/react-query'
import axios from 'axios'
// import { toast } from 'react-hot-toast'
import { toast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'
// import FileUploadApiService from '../lib/service/FileUploadApiService';


const useFileUpload = (mutate: UseMutateFunction<any, unknown, { file_key: string; file_name: string; }, unknown>, ) => {
  const [uploading, setUploading] = useState(false);

  console.log("Inside useFileUpload:", mutate)

  const handleFileUpload = async (acceptedFiles: File[]) => {
    console.log("Inside useFileUpload/handleFileUpload:", acceptedFiles)
    const file = acceptedFiles[0];
    if (file.size > 30 * 1024 * 1024) {
      console.log("Inside useFileUpload/handleFileUpload: File is too big")
      toast({
        title: "File is too big :(",
        description: "Please submit a smaller file."
      })
      return;
    }
    try {
      console.log("Inside useFileUpload/handleFileUpload: try")
      setUploading(true);
      const data = await uploadToS3(file);
      if (!data?.file_key || !data?.file_name) {
        toast({
          title: "Something went wrong :(",
          description: "Please try again later."
        })
        return;
      }
      mutate(data);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handleFileUpload };
};



interface FileUploadProps {
  dialogData: {
    name: string;
    groupId: string;
  };
  onUploadComplete: (success: boolean) => void;
  // apiService: typeof FileUploadApiService // Injecting the dependency
  apiService: typeof import('../lib/service/FileUploadApiService').default; // Injecting the dependency
}

// const handleDrop = async (acceptedFiles: File[], mutate, setUploading) => {
//   const file = acceptedFiles[0];
//   if (file.size > 10 * 1024 * 1024) {
//     toast.error('File is too big');
//     return;
//   }
//   try {
//     setUploading(true);
//     const data = await uploadToS3(file);
//     if (!data?.file_key || !data?.file_name) {
//       toast.error('Error uploading file');
//       return;
//     }
//     mutate(data);
//   } catch (err) {
//     console.error(err);
//   } finally {
//     setUploading(false);
//   }
// };



const FileUpload = ({ dialogData, onUploadComplete, apiService }: FileUploadProps) => {
    console.log("Inside FileUplaod:", dialogData)
    const router = useRouter()
    // const [uploading, setUploading] = React.useState(false)
    const queryClient = useQueryClient();

    // new code 
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }): Promise<any> => {

          const { data: properties } = await apiService.getProperties();
          console.log("Inside FileUplaod:", properties)

          const response_extract = await apiService.postExtract(file_key);
          console.log("Inside FileUplaod:", response_extract.data)
  
          if (!response_extract.data) {
            throw new Error('Error creating call');
          }
  
          const response_hubspot_query = await apiService.postHubspotQuery(properties, file_key);
  
          if (!response_hubspot_query.data) {
            throw new Error('Error in HubSpot query');
          }



        // const { data: properties } = await axios.get(`/api/hubspot/get`, { withCredentials: true });

        // // console.log(tokens)

        // const response_extract = await axios.post('/api/extract', {
        //     s3_key: file_key,
        //     // hubspot_access_token: tokens.account.access_token,
        //     // hubspot_refresh_token: tokens.account.refresh_token,
        //   }, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //       }
        //   }
        //   );

        // // setInterval(async () => {

        
    
        // console.log("Inside FileUplaod:", response_extract.data)
        // if (!response_extract.data) {
        //     toast.error('Error creating call');
        //     return;
        //   }

        
        // const response_hubspot_query = await axios.post('/api/hubspot/make-query', {
        //     properties: properties,
        //     s3_key: file_key,
        //   }, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //       }
        //   }
        //   );
        // if (!response_hubspot_query.data) {
        //     console.log("Error querying Hubspot Properties")
        //     toast.error('Error querying Hubspot Properties');
        //   }
        
        // console.log("Inside FileUplaod:", response_hubspot_query.data)
        




        const data = {
          id: response_extract.data.chatId,
          fileKey: file_key,
          chatName: dialogData.name, // replace with actual chat name
          summary: response_extract.data.summary,
          transcript: response_extract.data.transcript,
          pdfUrl: 'Your PDF URL', // replace with actual PDF URL
          userId: response_extract.data.collection, // replace with actual user ID
          groupId: dialogData.groupId,
        }

        const response_create_chat = await axios.post('/api/create-chat', data)
        console.log("Inside FileUplaod:", response_create_chat.data)
        return response_create_chat.data
        },
        onSuccess: (data) => {
            if(data.id) {
              toast({
                title: "Call created :)",
              })
              // toast.success('Call created');
              router.push(`/calls/${data.id}`);
              queryClient.invalidateQueries(['user-calls']);
              onUploadComplete(true);
            } else {
              toast({
                title: "Call ID not received :(",
              })
              // toast.error('Call ID not received');
            }
          },
          onError: (err) => {
            toast({
              title: "Error creating call",
            })
            // toast.error('Error creating call');
            console.error(err);
            onUploadComplete(false);
          },
        });
    
    const { uploading, handleFileUpload } = useFileUpload(mutate);


    // this is the old code

    // everything below is untouched
    const {getRootProps, getInputProps} = useDropzone({
        // accept:{'application/pdf': ['.pdf']},
        accept: {
            'application/pdf': ['.pdf'],
            'audio/mpeg': ['.mp3'],
            'audio/mp4': ['.mp4'],
            'video/mp4': ['.mp4'],
            'audio/wav': ['.wav'],
            'audio/x-wav': ['.wav'],
        },
        maxFiles: 1,
        onDrop: handleFileUpload
        //   async (acceptedFiles) => {
        //     console.log(acceptedFiles)
        //     const file = acceptedFiles[0]
        //     if (file.size > 10*1024*1024) {
        //         // biger then 10MB
        //         toast.error('File is too big')
        //     }
        //     try {
        //         setUploading(true)
        //         const data = await uploadToS3(file)
        //         if (!data?.file_key || !data?.file_name) {
        //             toast.error('Error uploading file')
        //             return
        //         }
        //         mutate(data) 
        //     }
        //     catch (err) {
        //     console.log(err)
        //     }
        //     finally {
        //         setUploading(false)
        //     }
        // }
    })
  return (
    <div className='p-2 bg-white rounded-xl'>
        <div {...getRootProps({
            className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justfiy-center items-center flex-col'
        })}>
            <input {...getInputProps()}/ >
                {uploading || isLoading ? (
                    <>
                        {/* {loading state} */}
                        <Loader2 className='w-12 h-12 text-blue-500' />
                        <p className='mt-2 text-sm text-slate-400'>
                            Spilling Tea to GPT...☕️
                        </p>
                    </>
                ):(
                    <>
                        <Inbox className='w-12 h-12 text-gray-400' />
                        <p className='mt-2 text-sm text-salte-400'>Drop Recording here</p>
                    </>
                )}
        </div>
    </div>
  )
}

export default FileUpload