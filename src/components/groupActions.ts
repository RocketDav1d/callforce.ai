'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { z } from 'zod'

// CREATE TABLE todos (
//   id SERIAL PRIMARY KEY,
//   text TEXT NOT NULL
// );

export async function createGroup(prevState: any, formData: FormData) {
  const schema = z.object({
    group: z.string().min(1),
  })
  const data = schema.parse({
    group: formData.get('group'),
  })

  try {
    const newGroup = await fetch('/api/groups/create', {
        method: 'POST',
        body: JSON.stringify({
            name: data.group,
            }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    revalidatePath('/')
    return { message: `Added todo ${newGroup}` }
  } catch (e) {
    return { message: 'Failed to create group' }
  }
}

export async function deleteGroup(prevState: any, formData: FormData) {
  const schema = z.object({
    id: z.string().min(1),
    group: z.string().min(1),
  })
  const data = schema.parse({
    id: formData.get('id'),
    group: formData.get('group'),
  })

  try {
    const deleteGroup = await fetch('/api/groups/delete', {
        method: 'POST',
        body: JSON.stringify({
            name: data.group,
            }),
        headers: {
            'Content-Type': 'application/json',
        },
    })

    revalidatePath('/')
    return { message: `Deleted todo ${deleteGroup}` }
  } catch (e) {
    return { message: 'Failed to delete todo' }
  }
}