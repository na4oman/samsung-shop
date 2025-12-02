/**
 * Manual test script for dual-range slider functionality
 * Run this in the browser console to test the slider
 */

// Test dual-range slider detection
function testDualRangeDetection() {
  console.log('🧪 Testing Dual-Range Slider Detection...')
  
  // Test cases for dual-range detection
  const testCases = [
    { defaultValue: [10, 50], expected: true, description: 'Array with 2 values' },
    { defaultValue: [10], expected: false, description: 'Array with 1 value' },
    { defaultValue: undefined, expected: false, description: 'Undefined defaultValue' },
    { value: [20, 80], expected: true, description: 'Value prop with 2 values' },
    { value: [20], expected: false, description: 'Value prop with 1 value' },
  ]
  
  testCases.forEach(({ defaultValue, value, expected, description }) => {
    const isDualRange = (defaultValue && defaultValue.length > 1) || 
                       (value && Array.isArray(value) && value.length > 1)
    
    const result = isDualRange === expected ? '✅' : '❌'
    console.log(`${result} ${description}: ${isDualRange} (expected: ${expected})`)
  })
}

// Test price range initialization
function testPriceRangeInit() {
  console.log('🧪 Testing Price Range Initialization...')
  
  // Simulate the initialization logic
  const getInitialPriceRange = (minParam, maxParam, fallbackMin = 0, fallbackMax = 1000) => {
    const minPrice = minParam ? Number(minParam) : fallbackMin
    const maxPrice = maxParam ? Number(maxParam) : fallbackMax
    
    const safeMin = isNaN(minPrice) ? 0 : minPrice
    const safeMax = isNaN(maxPrice) ? 1000 : maxPrice
    
    return [safeMin, safeMax]
  }
  
  // Test cases
  const testCases = [
    { minParam: '100', maxParam: '500', expected: [100, 500], description: 'Valid URL params' },
    { minParam: null, maxParam: null, expected: [0, 1000], description: 'No URL params' },
    { minParam: 'invalid', maxParam: '500', expected: [0, 500], description: 'Invalid min param' },
    { minParam: '100', maxParam: 'invalid', expected: [100, 1000], description: 'Invalid max param' },
  ]
  
  testCases.forEach(({ minParam, maxParam, expected, description }) => {
    const result = getInitialPriceRange(minParam, maxParam)
    const isCorrect = JSON.stringify(result) === JSON.stringify(expected)
    const status = isCorrect ? '✅' : '❌'
    console.log(`${status} ${description}: [${result.join(', ')}] (expected: [${expected.join(', ')}])`)
  })
}

// Test slider value formatting
function testSliderValueFormatting() {
  console.log('🧪 Testing Slider Value Formatting...')
  
  const testValues = [
    [69.84, 580.11],
    [0, 1000],
    [299.99, 499.99],
    [100, 200]
  ]
  
  testValues.forEach(([min, max]) => {
    const formatted = `$${min.toFixed(2)} - $${max.toFixed(2)}`
    console.log(`✅ Range [${min}, ${max}] formatted as: ${formatted}`)
  })
}

// Check if slider thumbs are properly rendered
function checkSliderThumbs() {
  console.log('🧪 Checking Slider Thumbs in DOM...')
  
  // Look for slider elements in the DOM
  const sliders = document.querySelectorAll('[role="slider"]')
  console.log(`Found ${sliders.length} slider elements`)
  
  sliders.forEach((slider, index) => {
    const thumbs = slider.querySelectorAll('[data-radix-collection-item]')
    console.log(`Slider ${index + 1}: ${thumbs.length} thumbs found`)
    
    if (thumbs.length === 2) {
      console.log('✅ Dual-range slider detected with 2 thumbs')
    } else if (thumbs.length === 1) {
      console.log('⚠️ Single-range slider detected with 1 thumb')
    } else {
      console.log('❌ Unexpected number of thumbs')
    }
  })
}

// Run all tests
function runAllSliderTests() {
  console.log('🚀 Running Dual-Range Slider Tests...')
  testDualRangeDetection()
  testPriceRangeInit()
  testSliderValueFormatting()
  checkSliderThumbs()
  console.log('✅ All slider tests completed!')
}

// Export functions to window for easy access
window.testDualRangeDetection = testDualRangeDetection
window.testPriceRangeInit = testPriceRangeInit
window.testSliderValueFormatting = testSliderValueFormatting
window.checkSliderThumbs = checkSliderThumbs
window.runAllSliderTests = runAllSliderTests

console.log('🚀 Dual-range slider test functions loaded!')
console.log('Available functions:')
console.log('- testDualRangeDetection()')
console.log('- testPriceRangeInit()')
console.log('- testSliderValueFormatting()')
console.log('- checkSliderThumbs()')
console.log('- runAllSliderTests()')