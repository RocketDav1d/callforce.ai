'use client'
import { Inbox, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { uploadToS3 } from '@/lib/s3'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import prisma from '@/lib/db';


const FileUpload = () => {
    const router = useRouter()
    const [uploading, setUploading] = React.useState(false)
    const queryClient = useQueryClient();

    // new code 
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({ file_key, file_name }: { file_key: string, file_name: string }): Promise<any> => {

        const { data: tokens } = await axios.get(`/api/tokens`, { withCredentials: true });

        console.log(tokens)

        const response = await axios.post('/api/extract', {
            s3_key: file_key,
            hubspot_access_token: tokens.account.access_token,
            hubspot_refresh_token: tokens.account.refresh_token,
          }, {
            headers: {
                'Content-Type': 'application/json'
              }
          }
          );
    
        console.log("Inside FileUplaod:", response.data)

        if (!response.data) {
            toast.error('Error creating call');
            return;
          }

        const chat = await prisma.chat.create({
            data: {
              id: response.data.chatId,
              fileKey: file_key,
              chatName: file_name, // replace with actual chat name
              summary: response.data.summary,
              transcript: response.data.transcript,
              pdfUrl: 'Your PDF URL', // replace with actual PDF URL
              userId: response.data.collection, // replace with actual user ID
              groupId: 'Your group ID', // replace with actual group ID
              // You might need to adjust the fields based on your actual data
            },
          });
        return chat;
        },
        onSuccess: (data) => {
            if(data.id) {
              toast.success('Call created');
              router.push(`/calls/${data.id}`);
              queryClient.invalidateQueries(['user-calls']);
            } else {
              toast.error('Call ID not received');
            }
          },
          onError: (err) => {
            toast.error('Error creating call');
            console.error(err);
          },
        });
    

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
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles)
            const file = acceptedFiles[0]
            if (file.size > 10*1024*1024) {
                // biger then 10MB
                toast.error('File is too big')
            }
            try {
                setUploading(true)
                const data = await uploadToS3(file)
                if (!data?.file_key || !data?.file_name) {
                    toast.error('Error uploading file')
                    return
                }
                mutate(data) 
                //     {
                //     onSuccess: ({call_id}) => {
                //         toast.success('Chat created')
                //         router.push(`/chat/${call_id}`)
                //     },
                //     onError: (err) => {
                //         toast.error('Error creating chat')
                //     }
                // })
            }
            catch (err) {
            console.log(err)
            }
            finally {
                setUploading(false)
            }
        }
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
