'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { deleteGroup } from '@/components/groupActions'

const initialState = {
  message: null,
}

function DeleteButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Delete
    </button>
  )
}

export function DeleteGroupForm({ id, todo }: { id: number; todo: string }) {
  const [state, formAction] = useFormState(deleteGroup, initialState)

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="todo" value={todo} />
      <DeleteButton />
      <p aria-live="polite" className="sr-only" role="status">
        {state?.message}
      </p>
    </form>
  )
}