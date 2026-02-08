import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, blogs, setBlogs, user, handleLikeProp }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const handleLike = async () => {
    if (handleLikeProp) {
      handleLikeProp(blog)
      return
    }

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      // Send the user ID.
      user: blog.user.id || blog.user,
    }

    const response = await blogService.update(blog.id, updatedBlog)

    const blogWithUser = {
      ...response,
      user: blog.user,
    }

    setBlogs(blogs.map((b) => (b.id === blog.id ? blogWithUser : b)))
  }

  const handleDelete = async () => {
    const confirmation = window.confirm(
      `Delete the blog "${blog.title}" by ${blog.author}?`
    )

    if (confirmation) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter((b) => b.id !== blog.id))
      } catch (error) {
        console.error('Error deleting the blog: ', error)
      }
    }
  }

  const showDeleteButton = blog.user?.username === user?.username

  return (
    <div
      style={blogStyle}
      className="blog"
      data-testid="blog-item"
    >
      <div className="blogSummary">
        {blog.title} {blog.author}{' '}
        <button onClick={toggleDetails}>
          {showDetails ? 'Hide' : 'Show'}
        </button>
      </div>

      {showDetails && (
        <div className="blogDetails">
          <div>{blog.url}</div>
          <div>
            Likes{' '}
            <span data-testid="likes-counter">{blog.likes}</span>{' '}
            <button onClick={handleLike}>Like</button>
          </div>

          <div>{blog.user?.name}</div>

          {showDeleteButton && (
            <button onClick={handleDelete}>Delete</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
