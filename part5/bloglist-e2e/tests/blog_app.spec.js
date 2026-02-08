const { test, expect, beforeEach, describe } = require('@playwright/test')
const {
  login,
  createBlog,
  likeBlog,
  deleteBlog,
} = require('./test_utils')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset the database.
    await request.post('/api/testing/reset')

    // Create the main user.
    await request.post('/api/users', {
      data: {
        username: 'Diri',
        name: 'Leocaprio',
        password: 'easyPassword',
      },
    })

    // Create another user.
    await request.post('/api/users', {
      data: {
        username: 'AnotherUser',
        name: 'Second User',
        password: 'awsd',
      },
    })

    // Navigate to the app.
    await page.goto('/')
  })

  test('login form is shown by default', async ({ page }) => {
    await expect(
      page.getByText('Log in to the application')
    ).toBeVisible()

    await expect(page.getByLabel('Username')).toBeVisible()
    await expect(page.getByLabel('Password')).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'Log in' })
    ).toBeVisible()
  })

  test('successful login', async ({ page }) => {
    await login(page, 'Diri', 'easyPassword')
    await expect(page.getByText('Leocaprio logged in')).toBeVisible()
  })

  test('failed login', async ({ page }) => {
    await login(page, 'Diri', 'wrongpassword')

    // Select the error notification.
    const errorMessage = page.locator('.error')

    await expect(errorMessage).toHaveText(
      'Wrong username or password'
    )
    await expect(errorMessage).toHaveCSS('border-style', 'solid')
    await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)')

    // Confirm that the success login message is not shown.
    await expect(
      page.getByText('Leocaprio logged in')
    ).not.toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page, 'Diri', 'easyPassword')

      await createBlog(
        page,
        'Playwright E2E Test Blog',
        'Leocaprio',
        'https://fullstackopen.com/en/part5'
      )
    })

    test('a new blog can be created', async ({ page }) => {
      const successMessage = page.locator('.success')

      await expect(successMessage).toHaveText(
        'New blog added: Playwright E2E Test Blog, by Leocaprio'
      )
      await expect(successMessage).toHaveCSS('border-style', 'solid')
      await expect(successMessage).toHaveCSS(
        'color',
        'rgb(53, 156, 40)'
      )

      await expect(
        page.getByText(
          'New blog added: Playwright E2E Test Blog, by Leocaprio'
        )
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      const blogTitle = 'Playwright E2E Test Blog'

      await likeBlog(page, blogTitle)

      // Locate the blog container.
      const blogContainer = page.locator('.blog', {
        hasText: blogTitle,
      })

      // Verify that the likes counter increased to 1.
      await expect(
        blogContainer.getByTestId('likes-counter')
      ).toHaveText('1')
    })

    test('the user who created a blog can delete it', async ({ page }) => {
      // Force page reload to get full user data and render the "Delete" button.
      await page.reload()

      const blogTitle = 'Playwright E2E Test Blog'

      await deleteBlog(page, blogTitle)

      await expect(page.getByText(blogTitle)).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page }) => {
      const blogTitle = 'Playwright E2E Test Blog'

      await page.reload()

      // Creator user (already logged in from beforeEach).
      const blogContainer = page
        .getByTestId('blog-item')
        .filter({ hasText: blogTitle })

      await blogContainer
        .getByRole('button', { name: 'Show' })
        .click()

      await expect(
        blogContainer.getByRole('button', { name: 'Delete' })
      ).toBeVisible()

      await page.getByRole('button', { name: 'Logout' }).click()

      // Log in with a different user.
      await login(page, 'AnotherUser', 'awsd')

      const otherBlogContainer = page
        .getByTestId('blog-item')
        .filter({ hasText: blogTitle })

      await otherBlogContainer
        .getByRole('button', { name: 'Show' })
        .click()

      // Non-creator user should NOT see the delete button.
      await expect(
        otherBlogContainer.getByRole('button', { name: 'Delete' })
      ).not.toBeVisible()
    })

    test('blogs are ordered by number of likes (descending)', async ({
      page,
    }) => {
      const blogA = 'Blog A'
      const blogB = 'Blog B'
      const blogC = 'Blog C'

      await createBlog(page, blogA, 'Leocaprio', 'http://a.com')
      await createBlog(page, blogB, 'Leocaprio', 'http://b.com')
      await createBlog(page, blogC, 'Leocaprio', 'http://c.com')

      await likeBlog(page, blogB)
      await likeBlog(page, blogB)
      await likeBlog(page, blogB)
      await likeBlog(page, blogB)
      await likeBlog(page, blogB)

      await likeBlog(page, blogC)
      await likeBlog(page, blogC)
      await likeBlog(page, blogC)
      await likeBlog(page, blogC)

      await likeBlog(page, blogA)
      await likeBlog(page, blogA)
      await likeBlog(page, blogA)

      // Get all rendered blog containers.
      const orderedBlogs = await page
        .locator('[data-testid="blog-item"]')
        .evaluateAll((elements) =>
          // "innerText" returns all visible text inside each blog,
          // exactly as the user would see it.
          elements.map((element) => element.innerText)
        )

      // Verification: order should be B -> C -> A.
      expect(orderedBlogs[0]).toMatch(blogB)
      expect(orderedBlogs[1]).toMatch(blogC)
      expect(orderedBlogs[2]).toMatch(blogA)
    })
  })
})
