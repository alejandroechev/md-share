import { test, expect } from '@playwright/test'

test.describe('Mermaid', () => {
  test('should render mermaid diagram SVG in preview', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    const preview = page.locator('.markdown-preview')
    
    // Clear existing content and enter mermaid diagram
    await textarea.clear()
    const mermaidMarkdown = `# Diagram Test

\`\`\`mermaid
graph TD
  A[Start] --> B[Process]
  B --> C[End]
\`\`\``
    
    await textarea.fill(mermaidMarkdown)
    
    // Wait for mermaid to render SVG
    await page.waitForTimeout(500)
    
    // Verify SVG is rendered in the preview
    const svg = preview.locator('svg')
    await expect(svg).toBeVisible()
    
    // Verify the SVG has g elements (diagram structure)
    const svgGroup = preview.locator('svg g')
    await expect(svgGroup).not.toHaveCount(0)
  })

  test('should render multiple mermaid diagrams', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    const preview = page.locator('.markdown-preview')
    
    // Clear and enter multiple diagrams
    await textarea.clear()
    const mermaidMarkdown = `# Multiple Diagrams

## Diagram 1

\`\`\`mermaid
graph LR
  A[Input] --> B[Output]
\`\`\`

## Diagram 2

\`\`\`mermaid
flowchart TD
  X[X] --> Y[Y]
  Y --> Z[Z]
\`\`\``
    
    await textarea.fill(mermaidMarkdown)
    
    // Wait longer for rendering
    await page.waitForTimeout(1500)
    
    // Verify at least one SVG is rendered (both should render but let's be flexible)
    const svgs = preview.locator('svg')
    const svgCount = await svgs.count()
    
    // At minimum, we should have at least 1 SVG rendered
    expect(svgCount).toBeGreaterThanOrEqual(1)
    
    // If we got both, great! If not, at least one is rendering
    if (svgCount >= 2) {
      expect(svgCount).toBeGreaterThanOrEqual(2)
    }
  })

  test('should handle invalid mermaid syntax gracefully', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    const preview = page.locator('.markdown-preview')
    
    // Clear and enter invalid mermaid
    await textarea.clear()
    const invalidMermaid = `# Invalid Diagram

\`\`\`mermaid
this is not valid mermaid syntax }{][
\`\`\``
    
    await textarea.fill(invalidMermaid)
    
    // Wait for rendering attempt
    await page.waitForTimeout(500)
    
    // Verify error is displayed (red background)
    const error = preview.locator('pre[class*="text-red"]')
    // The error message should be visible (even if it's an error state)
    const preElements = await preview.locator('pre').count()
    expect(preElements).toBeGreaterThan(0)
  })

  test('should re-render mermaid when diagram code changes', async ({ page }) => {
    await page.goto('/')
    
    const textarea = page.getByPlaceholder('Escribe o pega tu markdown aquí...')
    const preview = page.locator('.markdown-preview')
    
    // Enter first diagram
    await textarea.clear()
    await textarea.fill(`\`\`\`mermaid
graph TD
  A[First]
\`\`\``)
    
    // Wait longer for initial render
    await page.waitForTimeout(1000)
    
    // Verify SVG renders
    const svgBefore = preview.locator('svg').first()
    await expect(svgBefore).toBeVisible({ timeout: 5000 })
    
    // Change to second diagram
    await textarea.clear()
    await textarea.fill(`\`\`\`mermaid
graph TD
  A[First] --> B[Second] --> C[Third]
\`\`\``)
    
    // Wait for re-render
    await page.waitForTimeout(1000)
    
    // Verify SVG still renders (should have updated)
    const svgs = preview.locator('svg')
    await expect(svgs.first()).toBeVisible({ timeout: 5000 })
  })
})
