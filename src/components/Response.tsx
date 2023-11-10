'use client'
import React, { useEffect, useState } from 'react'; 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash, FileEdit } from 'lucide-react';
import { Separator } from "@/components/ui/separator"








interface Props {
    id: string;
    answer: string;
    query: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function CardWithForm({id, answer, query, onEdit, onDelete}: Props) {

    return (
        <Card className="w-full p-4 mt-5">
      <CardHeader>
        <div className='flex justify-between border'>
          <div className='flex flex-col border'>
            <div className='mb-2 border'>
              <Badge variant="secondary">User</Badge>
              <p>{query}</p>
            </div>
            <div>
              <Badge>AI</Badge>
              <p>{answer}</p>
            </div>
          </div>
          <div className='flex flex-col items-end border'>
            <Button className='bg-gray-400 mb-2' aria-label="Edit" onClick={() => onEdit(id)}>
              <FileEdit className="h-4 w-4" />
            </Button>
            <Button className='bg-gray-400' aria-label="Delete" onClick={() => onDelete(id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Content here if needed */}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className='text-sm text-gray-500'>Created 2 days ago</p>
      </CardFooter>
    </Card>
    )
    return (
      <Card className="w-full p-4 mt-5">
        <CardHeader>
            <div className='flex justify-end border'>
                <div className='order-2 ml-4'>
                    <Button className='bg-gray-400' aria-label="Toggle italic" onClick={() => onEdit(id)}>
                        <FileEdit className="h-4 w-4" />
                    </Button>
                </div>
                <div className='order-3 ml-2 bg-gray-50'>
                    <Button className='bg-gray-400' aria-label="Toggle italic" onClick={() => onDelete(id)}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
                </div>
        </CardHeader>
        <CardContent>
                <div className='order-1 grow'>
                    <Badge variant="secondary">User</Badge>
                </div>
                <p>{query}</p>
                <Separator />
                <div className='order-1 grow p-4'>
                    <Badge>AI</Badge>
                </div>
                <p>{answer}</p>
                
        </CardContent>
        <CardFooter className="flex justify-between">
            
            <p className='text-sm text-gray-500'>Created 2 days ago</p>
        </CardFooter>
      </Card>
    )
  }