/**
 * Debug script for favorite functionality
 * Run this in the browser console to debug favorite issues
 */

// Check localStorage favorites
function checkLocalStorageFavorites() {
  console.log('🔍 Checking localStorage favorites...')
  
  const favorites = localStorage.getItem('favorites')
  if (favorites) {
    try {
      const parsed = JSON.parse(favorites)
      console.log('✅ Favorites in localStorage:', parsed)
      return parsed
    } catch (error) {
      console.log('❌ Error parsing favorites:', error)
      return []
    }
  } else {
    console.log('⚠️ No favorites found in localStorage')
    return []
  }
}

// Add a test favorite
function addTestFavorite() {
  console.log('🧪 Adding test favorite...')
  
  const testProductId = 'test-product-123'
  const currentFavorites = checkLocalStorageFavorites()
  
  if (!currentFavorites.includes(testProductId)) {
    const newFavorites = [...currentFavorites, testProductId]
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    console.log('✅ Test favorite added:', testProductId)
  } else {
    console.log('⚠️ Test favorite already exists')
  }
  
  return checkLocalStorageFavorites()
}

// Remove test favorite
function removeTestFavorite() {
  console.log('🧪 Removing test favorite...')
  
  const testProductId = 'test-product-123'
  const currentFavorites = checkLocalStorageFavorites()
  
  if (currentFavorites.includes(testProductId)) {
    const newFavorites = currentFavorites.filter(id => id !== testProductId)
    localStorage.setItem('favorites', JSON.stringify(newFavorites))
    console.log('✅ Test favorite removed:', testProductId)
  } else {
    console.log('⚠️ Test favorite not found')
  }
  
  return checkLocalStorageFavorites()
}

// Check favorite buttons in DOM
function checkFavoriteButtons() {
  console.log('🔍 Checking favorite buttons in DOM...')
  
  const favoriteButtons = document.querySelectorAll('button[aria-label*="favorite"], button[aria-label*="Favorite"]')
  console.log(`Found ${favoriteButtons.length} favorite buttons`)
  
  favoriteButtons.forEach((button, index) => {
    const ariaLabel = button.getAttribute('aria-label')
    const heartIcon = button.querySelector('svg')
    const isRed = button.classList.contains('text-red-500') || 
                  button.style.color === 'red' ||
                  button.querySelector('.text-red-500')
    const isFilled = heartIcon?.classList.contains('fill-current')
    
    console.log(`Button ${index + 1}:`)
    console.log(`  - Label: ${ariaLabel}`)
    console.log(`  - Red color: ${isRed}`)
    console.log(`  - Heart filled: ${isFilled}`)
    
    // Add click listener for testing
    button.addEventListener('click', () => {
      console.log(`Favorite button ${index + 1} clicked!`)
    }, { once: true })
  })
  
  return favoriteButtons.length
}

// Check toast container
function checkToastContainer() {
  console.log('🔍 Checking toast container...')
  
  const toastContainer = document.querySelector('[data-sonner-toaster]') || 
                        document.querySelector('.toast-container') ||
                        document.querySelector('[role="region"][aria-label*="toast"]')
  
  if (toastContainer) {
    console.log('✅ Toast container found:', toastContainer)
    
    const toasts = toastContainer.querySelectorAll('[data-sonner-toast], .toast')
    console.log(`Current toasts: ${toasts.length}`)
    
    return true
  } else {
    console.log('❌ Toast container not found')
    return false
  }
}

// Simulate favorite button click
function simulateFavoriteClick() {
  console.log('🧪 Simulating favorite button click...')
  
  const favoriteButtons = document.querySelectorAll('button[aria-label*="favorite"], button[aria-label*="Favorite"]')
  
  if (favoriteButtons.length > 0) {
    const button = favoriteButtons[0]
    console.log('Clicking first favorite button...')
    
    // Check state before click
    const beforeFavorites = checkLocalStorageFavorites()
    console.log('Favorites before click:', beforeFavorites)
    
    // Click the button
    button.click()
    
    // Check state after click (with delay)
    setTimeout(() => {
      const afterFavorites = checkLocalStorageFavorites()
      console.log('Favorites after click:', afterFavorites)
      
      if (JSON.stringify(beforeFavorites) !== JSON.stringify(afterFavorites)) {
        console.log('✅ Favorite state changed successfully!')
      } else {
        console.log('❌ Favorite state did not change')
      }
    }, 100)
    
  } else {
    console.log('❌ No favorite buttons found to click')
  }
}

// Run comprehensive debug
function debugFavorites() {
  console.log('🚀 Running comprehensive favorite debug...')
  
  console.log('\n1. LocalStorage Check:')
  checkLocalStorageFavorites()
  
  console.log('\n2. DOM Buttons Check:')
  checkFavoriteButtons()
  
  console.log('\n3. Toast Container Check:')
  checkToastContainer()
  
  console.log('\n4. Test Operations:')
  addTestFavorite()
  removeTestFavorite()
  
  console.log('\n✅ Debug completed! Try clicking a favorite button and check the console.')
}

// Export functions to window
window.checkLocalStorageFavorites = checkLocalStorageFavorites
window.addTestFavorite = addTestFavorite
window.removeTestFavorite = removeTestFavorite
window.checkFavoriteButtons = checkFavoriteButtons
window.checkToastContainer = checkToastContainer
window.simulateFavoriteClick = simulateFavoriteClick
window.debugFavorites = debugFavorites

console.log('🚀 Favorite debug functions loaded!')
console.log('Available functions:')
console.log('- checkLocalStorageFavorites()')
console.log('- addTestFavorite()')
console.log('- removeTestFavorite()')
console.log('- checkFavoriteButtons()')
console.log('- checkToastContainer()')
console.log('- simulateFavoriteClick()')
console.log('- debugFavorites() - runs all checks')
console.log('\nRun debugFavorites() to start comprehensive debugging!')