import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { getAnecdotes, updateAnecdote } from './requests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './NotificationContext'

const App = () => {
  const queryClient = useQueryClient()

  const [_, notificationDispatch] = useContext(NotificationContext)

  const { isPending, isError, data } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  const voteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
  })

  if (isPending) {
    return <div>Loading data...</div>
  }

  if (isError) {
    return (
      <div>
        The anecdotes service is not available due to server issues.
      </div>
    )
  }

  const anecdotes = data

  const handleVote = (anecdote) => {
    console.log('vote')
    voteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })

    notificationDispatch({
      type: 'SET',
      payload: `You voted for '${anecdote.content}'`,
    })
    
    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR' })
    }, 5000)
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
