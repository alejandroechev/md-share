import { test, expect } from '@playwright/test'

test.describe('Editor', () => {
  test('should load with sample content visible in both editor and preview', async ({
    page,
  }) => {
    await page.goto('/')
    
    // Check that the editor textarea contains the sample markdown
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    await expect(textarea).toContainText('# Bienvenido a md-share')
    
    // Check that the preview pane shows the rendered content
    const preview = page.locator('.markdown-preview')
    await expect(preview).toContainText('Bienvenido a md-share')
    await expect(preview.locator('h1')).toContainText('Bienvenido a md-share')
  })

  test('should update preview in real-time when typing in editor', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    const preview = page.locator('.markdown-preview')
    
    // Clear existing content
    await textarea.clear()
    
    // Type new markdown
    const testMarkdown = '# Test Heading\n\nThis is a test.'
    await textarea.fill(testMarkdown)
    
    // Verify preview updates
    await expect(preview.locator('h1')).toContainText('Test Heading')
    await expect(preview).toContainText('This is a test.')
  })

  test('should clear editor when clicking Nuevo button', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    const nuevoButton = page.getByRole('button', { name: /Nuevo/i })
    
    // Verify content exists initially
    await expect(textarea).toContainText('# Bienvenido a md-share')
    
    // Click Nuevo button
    await nuevoButton.click()
    
    // Verify editor is cleared
    await expect(textarea).toHaveValue('')
    
    // Verify preview is also empty
    const preview = page.locator('.markdown-preview')
    await expect(preview).not.toContainText('Bienvenido a md-share')
  })
})
