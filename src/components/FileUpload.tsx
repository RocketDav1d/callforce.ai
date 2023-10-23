'use client'
import { Inbox, Loader2 } from 'lucide-react'
import React from 'react'
import {useDropzone} from 'react-dropzone'
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const FileUpload = () => {

    const router = useRouter()

    const [uploading, setUploading] = React.useState(false)
    const { mutate, isLoading } = useMutation({
        mutationFn: async ({file_key, file_name}: {file_key:string, file_name:string}) => {
            const response = await axios.post('/api/create-chat',{file_key, file_name})
            return response.data
        }
    })

    const {getRootProps, getInputProps} = useDropzone({
        accept:{'application/pdf': ['.pdf']},
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
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success('Chat created')
                        router.push(`/chat/${chat_id}`)
                    },
                    onError: (err) => {
                        toast.error('Error creating chat')
                    }
                })
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
                        <p className='mt-2 text-sm text-salte-400'> Drop Recording here</p>
                    </>
                )}
        </div>
    </div>
  )
}

export default FileUpload
