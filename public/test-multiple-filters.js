/**
 * Manual test script for multiple filter functionality
 * Run this in the browser console to test the multiple selection system
 */

// Test URL parameter parsing for multiple values
function testMultipleFilterParsing() {
  console.log('🧪 Testing Multiple Filter Parsing...')
  
  // Test comma-separated values
  const testParams = new URLSearchParams('models=S23,A56,Note20&colors=Black,White&categories=LCD,AMOLED')
  
  const parseMultipleValues = (paramName) => {
    const param = testParams.get(paramName)
    if (!param) return []
    return param.split(',').filter(Boolean)
  }
  
  const models = parseMultipleValues('models')
  const colors = parseMultipleValues('colors')
  const categories = parseMultipleValues('categories')
  
  console.log('✅ Parsed models:', models)
  console.log('✅ Parsed colors:', colors)
  console.log('✅ Parsed categories:', categories)
  
  // Test array operations
  const testModel = 'S23'
  const isSelected = models.includes(testModel)
  const newModels = isSelected 
    ? models.filter(m => m !== testModel)
    : [...models, testModel]
  
  console.log('✅ Toggle operation test:', { isSelected, newModels })
}

// Test filter logic
function testFilterLogic() {
  console.log('🧪 Testing Filter Logic...')
  
  const mockProducts = [
    { id: '1', name: 'Product 1', model: 'S23', color: 'Black', category: 'LCD', price: 299 },
    { id: '2', name: 'Product 2', model: 'A56', color: 'White', category: 'AMOLED', price: 499 },
    { id: '3', name: 'Product 3', model: 'Note20', color: 'Black', category: 'LCD', price: 399 },
  ]
  
  // Test multiple model filter
  const selectedModels = ['S23', 'A56']
  const filteredByModels = mockProducts.filter(product => 
    selectedModels.length === 0 || selectedModels.includes(product.model)
  )
  
  console.log('✅ Filtered by models:', filteredByModels)
  
  // Test multiple color filter
  const selectedColors = ['Black']
  const filteredByColors = mockProducts.filter(product => 
    selectedColors.length === 0 || selectedColors.includes(product.color)
  )
  
  console.log('✅ Filtered by colors:', filteredByColors)
  
  // Test combined filters
  const combinedFiltered = mockProducts.filter(product => {
    const modelMatch = selectedModels.length === 0 || selectedModels.includes(product.model)
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color)
    return modelMatch && colorMatch
  })
  
  console.log('✅ Combined filter result:', combinedFiltered)
}

// Test URL generation
function testURLGeneration() {
  console.log('🧪 Testing URL Generation...')
  
  const createQueryString = (params) => {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        searchParams.delete(key)
      } else {
        searchParams.set(key, value)
      }
    })
    
    return searchParams.toString()
  }
  
  // Test adding multiple values
  const models = ['S23', 'A56', 'Note20']
  const colors = ['Black', 'White']
  
  const queryString = createQueryString({
    models: models.join(','),
    colors: colors.join(','),
    page: '1'
  })
  
  console.log('✅ Generated query string:', queryString)
  
  // Test removing values
  const newModels = models.filter(m => m !== 'A56')
  const newQueryString = createQueryString({
    models: newModels.length > 0 ? newModels.join(',') : null,
    colors: colors.join(','),
    page: '1'
  })
  
  console.log('✅ Updated query string:', newQueryString)
}

// Run all tests
function runAllFilterTests() {
  console.log('🚀 Running Multiple Filter Tests...')
  testMultipleFilterParsing()
  testFilterLogic()
  testURLGeneration()
  console.log('✅ All tests completed!')
}

// Export functions to window for easy access
window.testMultipleFilterParsing = testMultipleFilterParsing
window.testFilterLogic = testFilterLogic
window.testURLGeneration = testURLGeneration
window.runAllFilterTests = runAllFilterTests

console.log('🚀 Multiple filter test functions loaded!')
console.log('Available functions:')
console.log('- testMultipleFilterParsing()')
console.log('- testFilterLogic()')
console.log('- testURLGeneration()')
console.log('- runAllFilterTests()')