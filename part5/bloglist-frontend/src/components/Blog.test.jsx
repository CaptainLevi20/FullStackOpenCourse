import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  test('renders title and author but not URL or likes by default', () => {
    // Simulate a blog object, exactly as the <Blog /> component would receive it
    // if the app were running normally.
    const blog = {
      title: 'Learning React Testing',
      author: 'Leocaprio Dinardo',
      url: 'http://example.com',
      likes: 25,
      user: { username: 'LeoDIC' },
      id: '1234545',
    }

    /* Mounts the React component in a test environment (thanks to jsdom)
       and returns methods to interact with and query the rendered DOM.
       Mocked props are passed so the test can run properly. */
    render(
      <Blog
        blog={blog} // Current blog to be displayed.
        blogs={[]} // List of all blogs (empty).
        setBlogs={() => {}} // Empty function because we don’t want to modify real state in tests.
        user={{ username: 'LeoDIC' }} // Logged-in user, required for permissions.
      />
    )

    // The title and author should be visible; "getByText" searches for text that must exist.
    expect(screen.getByText(/Learning React Testing/i)).toBeDefined()
    expect(screen.getByText(/Leocaprio Dinardo/i)).toBeDefined()

    // The URL and likes should NOT be visible initially;
    // "queryByText" searches for text that should not exist (returns null if not found).
    const url = screen.queryByText('http://example.com')
    expect(url).toBeNull()

    const likes = screen.queryByText('Likes 25')
    expect(likes).toBeNull()
  })

  test('renders URL and likes when the "Show" button is clicked', async () => {
    const blog = {
      title: 'Learning React Testing',
      author: 'Leocaprio Dinardo',
      url: 'http://example.com',
      likes: 25,
      user: { username: 'LeoDIC' },
      id: '12345',
    }

    render(
      <Blog
        blog={blog}
        blogs={[]}
        setBlogs={() => {}}
        user={{ username: 'LeoDIC' }}
      />
    )

    // Create a userEvent instance (to simulate user interactions).
    const user = userEvent.setup()

    const showButton = screen.getByText('Show')
    // Simulate a real click.
    await user.click(showButton)

    // After clicking, the URL and likes should appear;
    // toBeVisible() checks that the element is visible to the user.
    expect(screen.getByText('http://example.com')).toBeVisible()
    expect(screen.getByText('Likes 25')).toBeVisible()
  })

  test('calls the like handler twice when the Like button is clicked twice', async () => {
    const blog = {
      title: 'Learning React Testing',
      author: 'Leocaprio Dinardo',
      url: 'http://example.com',
      likes: 25,
      user: { username: 'LeoDIC' },
      id: '12345',
    }

    // Create a mock function.
    const mockUpdateLike = vi.fn()

    render(
      <Blog
        blog={blog}
        blogs={[]}
        setBlogs={() => {}}
        user={{ username: 'LeoDIC' }}
        // Inject the mock function.
        handleLikeProp={mockUpdateLike}
      />
    )

    const user = userEvent.setup()

    // First, show the details.
    const showButton = screen.getByText('Show')
    await user.click(showButton)

    // Then click the "Like" button twice.
    const likeButton = screen.getByText('Like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Verify it was called exactly twice.
    expect(mockUpdateLike.mock.calls).toHaveLength(2)
  })
})
