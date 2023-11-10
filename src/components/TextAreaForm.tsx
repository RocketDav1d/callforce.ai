"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { PenSquare } from 'lucide-react';
 
const FormSchema = z.object({
  prompt: z
    .string()
    .min(10, {
      message: "Prompt must be at least 10 characters.",
    })
    .max(200, {
      message: "Prompt must not be longer than 200 characters.",
    }),
})

interface Props {
  file_key: string;
  onFormSubmit: (response: { answer: string; context_text: string, createdAt: string, prompt: string }) => void;
}

 
export default function TextareaForm({file_key, onFormSubmit}: Props) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  console.log("TextAreaForm: ", file_key);

  async function onSubmit(data: z.infer<typeof FormSchema>, e: any) {
    e.preventDefault();
    const request_body = JSON.stringify({ data, file_key })
    console.log("Request Body: ", request_body);
    const response = await fetch('/api/send-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request_body
    });

    const responseData = await response.json();
    const apiResponse = JSON.parse(responseData.data.response);
    console.log("Parsed API Response: ", apiResponse);
    const answer = apiResponse.answer
    const context_text = apiResponse.context_text
    const prompt = data.prompt;


    onFormSubmit({
      answer: answer,
      context_text: context_text,
      createdAt: new Date().toISOString(),
      prompt: prompt
    });

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }
 
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ask your audio anything!"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
        <PenSquare size={19} className="mr-2"/>
        Send Prompt</Button>
      </form>
    </Form>
  )
}