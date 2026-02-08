import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import ToggleContent from './components/ToggleContent'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(
      'loggedBloglistUser'
    )

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (newBlog) => {
    blogService.create(newBlog).then((createdBlog) => {
      setBlogs(blogs.concat(createdBlog))

      setNotification({
        text: `New blog added: ${createdBlog.title}, by ${createdBlog.author}`,
        type: 'success',
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username: username,
        password: password,
      })

      window.localStorage.setItem(
        'loggedBloglistUser',
        JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

      setUsername('')
      setPassword('')
    } catch (error) {
      console.log('Login error: ', error)

      setNotification({
        text: 'Wrong username or password',
        type: 'error',
      })

      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          Username{' '}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>

      <div>
        <label>
          Password{' '}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>

      <button type="submit">Log in</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        <h2>Log in to the application</h2>
        <Notification message={notification} />
        {loginForm()}
      </div>
    )
  }

  const sortedBlogs = [...blogs].sort((blog1, blog2) => {
    return blog2.likes - blog1.likes
  })

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />

      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>Logout</button>
      </p>

      <ToggleContent buttonText="Create new blog">
        <BlogForm createBlog={addBlog} />
      </ToggleContent>

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          blogs={blogs}
          setBlogs={setBlogs}
          user={user}
        />
      ))}
    </div>
  )
}

export default App
