/**
 * Test script for brand color implementation
 * Run this in the browser console to verify the new color scheme
 */

// Test brand colors
function testBrandColors() {
  console.log('🎨 Testing Brand Color Implementation...')
  
  // Expected brand colors
  const expectedColors = {
    primary: '#006f6f', // Teal from logo
    secondary: '#323232', // Dark gray from logo
  }
  
  console.log('Expected brand colors:')
  console.log(`- Primary (Teal): ${expectedColors.primary}`)
  console.log(`- Secondary (Dark Gray): ${expectedColors.secondary}`)
  
  // Check CSS variables
  const rootStyles = getComputedStyle(document.documentElement)
  
  console.log('\nCSS Variables:')
  console.log(`- --primary: ${rootStyles.getPropertyValue('--primary').trim()}`)
  console.log(`- --brand-primary: ${rootStyles.getPropertyValue('--brand-primary').trim()}`)
  console.log(`- --brand-secondary: ${rootStyles.getPropertyValue('--brand-secondary').trim()}`)
}

// Check header styling
function checkHeaderStyling() {
  console.log('🔍 Checking Header Styling...')
  
  const header = document.querySelector('header')
  if (header) {
    const headerStyles = getComputedStyle(header)
    console.log('Header styles:')
    console.log(`- Background: ${headerStyles.backgroundColor}`)
    console.log(`- Color: ${headerStyles.color}`)
    console.log(`- Classes: ${header.className}`)
    
    // Check if header has primary background
    const hasPrimaryBg = header.classList.contains('bg-primary')
    console.log(`- Has primary background: ${hasPrimaryBg ? '✅' : '❌'}`)
    
    // Check navigation links
    const navLinks = header.querySelectorAll('nav a')
    console.log(`- Navigation links found: ${navLinks.length}`)
    
    navLinks.forEach((link, index) => {
      const linkStyles = getComputedStyle(link)
      console.log(`  Link ${index + 1}: ${linkStyles.color}`)
    })
  } else {
    console.log('❌ Header not found')
  }
}

// Check footer styling
function checkFooterStyling() {
  console.log('🔍 Checking Footer Styling...')
  
  const footer = document.querySelector('footer')
  if (footer) {
    const footerStyles = getComputedStyle(footer)
    console.log('Footer styles:')
    console.log(`- Background: ${footerStyles.backgroundColor}`)
    console.log(`- Color: ${footerStyles.color}`)
    console.log(`- Classes: ${footer.className}`)
    
    // Check if footer has primary background
    const hasPrimaryBg = footer.classList.contains('bg-primary')
    console.log(`- Has primary background: ${hasPrimaryBg ? '✅' : '❌'}`)
    
    // Check footer links
    const footerLinks = footer.querySelectorAll('a')
    console.log(`- Footer links found: ${footerLinks.length}`)
  } else {
    console.log('❌ Footer not found')
  }
}

// Check for theme toggle (should be removed)
function checkThemeToggleRemoval() {
  console.log('🔍 Checking Theme Toggle Removal...')
  
  // Look for theme toggle button
  const themeToggle = document.querySelector('[data-theme-toggle]') || 
                     document.querySelector('button[aria-label*="theme"]') ||
                     document.querySelector('button[aria-label*="Theme"]')
  
  if (themeToggle) {
    console.log('❌ Theme toggle still found:', themeToggle)
  } else {
    console.log('✅ Theme toggle successfully removed')
  }
  
  // Check for dark mode classes
  const hasDarkMode = document.documentElement.classList.contains('dark') ||
                     document.body.classList.contains('dark')
  
  console.log(`- Dark mode active: ${hasDarkMode ? '❌' : '✅'}`)
}

// Check primary buttons and elements
function checkPrimaryElements() {
  console.log('🔍 Checking Primary Elements...')
  
  // Find elements with primary classes
  const primaryElements = document.querySelectorAll('.bg-primary, .text-primary, .border-primary')
  console.log(`Found ${primaryElements.length} elements with primary classes`)
  
  primaryElements.forEach((element, index) => {
    const styles = getComputedStyle(element)
    const classes = element.className
    console.log(`Element ${index + 1}:`)
    console.log(`  - Classes: ${classes}`)
    console.log(`  - Background: ${styles.backgroundColor}`)
    console.log(`  - Color: ${styles.color}`)
  })
}

// Convert HSL to Hex for comparison
function hslToHex(h, s, l) {
  l /= 100
  const a = s * Math.min(l, 1 - l) / 100
  const f = n => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

// Run comprehensive brand color test
function testBrandColorImplementation() {
  console.log('🚀 Running Comprehensive Brand Color Test...')
  
  console.log('\n1. Brand Colors:')
  testBrandColors()
  
  console.log('\n2. Header Styling:')
  checkHeaderStyling()
  
  console.log('\n3. Footer Styling:')
  checkFooterStyling()
  
  console.log('\n4. Theme Toggle Removal:')
  checkThemeToggleRemoval()
  
  console.log('\n5. Primary Elements:')
  checkPrimaryElements()
  
  console.log('\n✅ Brand color implementation test completed!')
}

// Export functions to window
window.testBrandColors = testBrandColors
window.checkHeaderStyling = checkHeaderStyling
window.checkFooterStyling = checkFooterStyling
window.checkThemeToggleRemoval = checkThemeToggleRemoval
window.checkPrimaryElements = checkPrimaryElements
window.testBrandColorImplementation = testBrandColorImplementation

console.log('🚀 Brand color test functions loaded!')
console.log('Available functions:')
console.log('- testBrandColors()')
console.log('- checkHeaderStyling()')
console.log('- checkFooterStyling()')
console.log('- checkThemeToggleRemoval()')
console.log('- checkPrimaryElements()')
console.log('- testBrandColorImplementation() - runs all tests')
console.log('\nRun testBrandColorImplementation() to verify the new brand colors!')