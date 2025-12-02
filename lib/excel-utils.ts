import type { Product } from "./types"

/**
 * Validates and transforms raw Excel data into Product objects
 * @param data Raw data from Excel file
 * @returns Array of validated Product objects
 */
export function validateExcelProducts(data: any[]): Product[] {
  return data.map((row: any, index) => {
    // Create a product object from the row with validation
    const product: Product = {
      id: row.id || `import-${Date.now()}-${index}`,
      name: row.name || `Product ${index + 1}`,
      model: row.model || "",
      category: row.category || "",
      color: row.color || "",
      description: row.description || "",
      price: Number.parseFloat(row.price) || 0,
      image: row.image || "/placeholder.svg?height=400&width=400",
      partNumber: row.partNumber || "",
    }

    // Generate part number if not provided
    if (!product.partNumber && product.model && product.category && product.color) {
      const modelCode = product.model.replace(/Galaxy /i, "").toUpperCase()
      const categoryCode = product.category.toUpperCase()
      const colorCode = product.color.substring(0, 3).toUpperCase()
      product.partNumber = `SM-${modelCode}-${categoryCode}-${colorCode}`
    }

    return product
  })
}

/**
 * Creates a sample Excel template for product import
 * @returns Array representing sample data
 */
export function getSampleExcelData(): any[] {
  return [
    {
      name: "Samsung Galaxy S23 AMOLED Display",
      model: "Galaxy S23",
      category: "AMOLED",
      color: "Black",
      partNumber: "SM-S911B-AMOLED-BLK",
      description: "Original replacement AMOLED display for Samsung Galaxy S23.",
      price: 199.99,
      image: "/placeholder.svg?height=400&width=400",
    },
    {
      name: "Samsung Galaxy S22 LCD Screen",
      model: "Galaxy S22",
      category: "LCD",
      color: "White",
      partNumber: "SM-S901B-LCD-WHT",
      description: "Replacement LCD screen for Samsung Galaxy S22.",
      price: 149.99,
      image: "",
    },
  ]
}

