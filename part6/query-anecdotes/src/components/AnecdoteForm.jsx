import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { crearAnecdota } from '../requests'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()

  const [_, notificationDispatch] = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: crearAnecdota,

    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      notificationDispatch({
        type: 'SET',
        payload: `Anecdote created: '${newAnecdote.content}'`,
      })

      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    },

    
    onError: (error) => {
      
      const message = error.response?.data?.error || 'Unexpected error'

      notificationDispatch({
        type: 'SET',
        payload: message,
      })

      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR' })
      }, 5000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')

    newAnecdoteMutation.mutate({
      content,
      votes: 0,
    })
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
