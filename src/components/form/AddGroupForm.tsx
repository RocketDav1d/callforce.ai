'use client'

import { useFormState } from 'react-dom'
import { useFormStatus } from 'react-dom'
import { createGroup } from '@/components/groupActions'
 
const initialState = {
  message: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Add Group
    </button>
  )
}

export function AddGroupForm() {
  const [state, formAction] = useFormState(createGroup, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="todo">Enter Task</label>
      <input type="text" id="todo" name="todo" required />
      <SubmitButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  )
}