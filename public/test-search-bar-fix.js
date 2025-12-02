/**
 * Test script for search bar clear button fix
 * Run this in the browser console to verify the fix
 */

// Check for duplicate clear buttons
function checkForDuplicateClearButtons() {
  console.log('🔍 Checking for duplicate clear buttons...')
  
  // Look for search input
  const searchInputs = document.querySelectorAll('input[placeholder*="Search"], input[type="search"], input[type="text"]')
  
  searchInputs.forEach((input, index) => {
    console.log(`\nSearch Input ${index + 1}:`)
    console.log(`- Type: ${input.type}`)
    console.log(`- Placeholder: ${input.placeholder}`)
    
    // Check for native clear button (appears with type="search")
    const hasNativeClear = input.type === 'search'
    console.log(`- Has native clear button: ${hasNativeClear}`)
    
    // Check for custom clear button
    const parent = input.parentElement
    const customClearButton = parent?.querySelector('button[type="button"]')
    const hasCustomClear = !!customClearButton
    console.log(`- Has custom clear button: ${hasCustomClear}`)
    
    // Check for X icon
    const xIcon = parent?.querySelector('svg') || customClearButton?.querySelector('svg')
    const hasXIcon = !!xIcon
    console.log(`- Has X icon: ${hasXIcon}`)
    
    // Determine if there are duplicates
    const totalClearButtons = (hasNativeClear ? 1 : 0) + (hasCustomClear ? 1 : 0)
    console.log(`- Total clear buttons: ${totalClearButtons}`)
    
    if (totalClearButtons > 1) {
      console.log('❌ DUPLICATE CLEAR BUTTONS DETECTED!')
    } else if (totalClearButtons === 1) {
      console.log('✅ Single clear button (correct)')
    } else {
      console.log('⚠️ No clear button found')
    }
  })
}

// Test search functionality
function testSearchFunctionality() {
  console.log('🧪 Testing search functionality...')
  
  const searchInput = document.querySelector('input[placeholder*="Search"]')
  
  if (!searchInput) {
    console.log('❌ Search input not found')
    return
  }
  
  console.log('✅ Search input found')
  
  // Test typing
  const testQuery = 'samsung'
  searchInput.value = testQuery
  searchInput.dispatchEvent(new Event('input', { bubbles: true }))
  
  console.log(`✅ Test query entered: "${testQuery}"`)
  
  // Check if clear button appears
  setTimeout(() => {
    const clearButton = searchInput.parentElement?.querySelector('button[type="button"]')
    if (clearButton) {
      console.log('✅ Clear button appeared after typing')
      
      // Test clear functionality
      clearButton.click()
      
      setTimeout(() => {
        if (searchInput.value === '') {
          console.log('✅ Clear button works correctly')
        } else {
          console.log('❌ Clear button did not clear the input')
        }
      }, 100)
      
    } else {
      console.log('❌ Clear button did not appear after typing')
    }
  }, 100)
}

// Check CSS styling for search input
function checkSearchInputStyling() {
  console.log('🎨 Checking search input styling...')
  
  const searchInput = document.querySelector('input[placeholder*="Search"]')
  
  if (!searchInput) {
    console.log('❌ Search input not found')
    return
  }
  
  const computedStyle = window.getComputedStyle(searchInput)
  
  console.log('Search input styles:')
  console.log(`- Padding left: ${computedStyle.paddingLeft}`)
  console.log(`- Padding right: ${computedStyle.paddingRight}`)
  console.log(`- Position: ${computedStyle.position}`)
  
  // Check for webkit search cancel button (should be hidden)
  const webkitSearchCancel = computedStyle.getPropertyValue('-webkit-appearance')
  console.log(`- Webkit appearance: ${webkitSearchCancel}`)
  
  // Check parent container
  const parent = searchInput.parentElement
  if (parent) {
    const parentStyle = window.getComputedStyle(parent)
    console.log(`- Parent position: ${parentStyle.position}`)
  }
}

// Run comprehensive search bar test
function testSearchBarFix() {
  console.log('🚀 Running comprehensive search bar test...')
  
  console.log('\n1. Checking for duplicate clear buttons:')
  checkForDuplicateClearButtons()
  
  console.log('\n2. Testing search functionality:')
  testSearchFunctionality()
  
  console.log('\n3. Checking styling:')
  checkSearchInputStyling()
  
  console.log('\n✅ Search bar test completed!')
}

// Export functions to window
window.checkForDuplicateClearButtons = checkForDuplicateClearButtons
window.testSearchFunctionality = testSearchFunctionality
window.checkSearchInputStyling = checkSearchInputStyling
window.testSearchBarFix = testSearchBarFix

console.log('🚀 Search bar test functions loaded!')
console.log('Available functions:')
console.log('- checkForDuplicateClearButtons()')
console.log('- testSearchFunctionality()')
console.log('- checkSearchInputStyling()')
console.log('- testSearchBarFix() - runs all tests')
console.log('\nRun testSearchBarFix() to verify the duplicate clear button fix!')