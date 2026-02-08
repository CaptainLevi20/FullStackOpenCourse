const login = async (page, username, password) => {
  await page.getByLabel("Username").fill(username);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Log in" }).click();
};

const createBlog = async (page, title, author, url) => {
  const cancelButton = page.getByRole("button", { name: "Cancel" });
  if (await cancelButton.isVisible().catch(() => false)) {
    await cancelButton.click();
    await page.waitForTimeout(100);
  }

  await page.getByRole("button", { name: "Create new blog" }).click();
  await page.getByLabel("Title").fill(title);
  await page.getByLabel("Author").fill(author);
  await page.getByLabel("Url").fill(url);
  await page.getByRole("button", { name: "Create" }).click();

  await page
    .locator('[data-testid="blog-item"]', { hasText: title })
    .waitFor({ state: "visible", timeout: 5000 });
};

const likeBlog = async (page, blogTitle) => {
  const blogContainer = page
    .locator('[data-testid="blog-item"]')
    .filter({ hasText: blogTitle });

  const showButton = blogContainer.getByRole("button", { name: "Show" });
  if (await showButton.isVisible().catch(() => false)) {
    await showButton.click();
    await page.waitForTimeout(100);
  }

  const likeButton = blogContainer.getByRole("button", { name: "Like" });
  await likeButton.waitFor({ state: "visible", timeout: 5000 });
  await likeButton.click();
};

const deleteBlog = async (page, blogTitle) => {
  const blogContainer = page.locator(".blog", { hasText: blogTitle });

  await blogContainer.getByRole("button", { name: "Show" }).click();

  page.on("dialog", async (dialog) => {
    await dialog.accept();
  });

  await blogContainer.getByRole("button", { name: "Delete" }).click();
};

export { login, createBlog, likeBlog, deleteBlog };
