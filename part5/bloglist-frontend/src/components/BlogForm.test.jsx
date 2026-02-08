import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with the correct data when the form is submitted', async () => {
    const user = userEvent.setup()
    const createBlog = vi.fn()

    render(<BlogForm createBlog={createBlog} />)

    const titleInput = screen.getByLabelText(/Title/i)
    const authorInput = screen.getByLabelText(/Author/i)
    const urlInput = screen.getByLabelText(/URL/i)

    await user.type(titleInput, 'Testing the form')
    await user.type(authorInput, 'Leocaprio Dinardo')
    await user.type(urlInput, 'http://example.com')

    const createButton = screen.getByText('Create')
    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)

    const callData = createBlog.mock.calls[0][0]

    expect(callData).toEqual({
      title: 'Testing the form',
      author: 'Leocaprio Dinardo',
      url: 'http://example.com',
    })
  })
})
