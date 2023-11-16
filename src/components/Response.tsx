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
import { timestamp } from 'aws-sdk/clients/cloudfront';








interface Props {
    id: string;
    answer: string;
    query: string;
    createdAt: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export default function CardWithForm({id, answer, query, createdAt, onEdit, onDelete}: Props) {

  function formatDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  }

    return (
        <Card className="w-full p-4 mt-5">
        <CardContent>
        <div className='flex justify-between'>
            <div className='flex flex-col'>
              <div className='mb-2'>
                <Badge className="mb-3" variant="secondary">User</Badge>
                <p>{query}</p>
              </div>
              <div className='mt-5'>
                <Badge className="mb-3">AI</Badge>
                <h2 className='text-xl'>{answer}</h2>
              </div>
            </div>
            <div className='flex flex-col items-end'>
              {/* <Button className='bg-gray-400 mb-2' aria-label="Edit" onClick={() => onEdit(id)}>
                <FileEdit className="h-4 w-4" />
              </Button> */}
              <Button className='bg-gray-400' aria-label="Delete" onClick={() => onDelete(id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className='text-sm text-gray-500'>{formatDate(createdAt)}</p>
        </CardFooter>
    </Card>
    )
  }