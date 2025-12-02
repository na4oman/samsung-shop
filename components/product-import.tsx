"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, FileSpreadsheet, Upload, X } from "lucide-react"
import type { Product } from "@/lib/types"
import * as XLSX from "xlsx"
import { validateExcelProducts, getSampleExcelData } from "@/lib/excel-utils"

interface ProductImportProps {
  onImport: (products: Product[]) => Promise<void>
  onCancel: () => void
}

export default function ProductImport({ onImport, onCancel }: ProductImportProps) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Check if file is Excel
    if (
      !selectedFile.name.endsWith(".xlsx") &&
      !selectedFile.name.endsWith(".xls") &&
      !selectedFile.name.endsWith(".csv")
    ) {
      setError("Please upload an Excel or CSV file")
      setFile(null)
      return
    }

    setFile(selectedFile)
    setError(null)
    parseExcel(selectedFile)
  }

  const parseExcel = async (file: File) => {
    setIsLoading(true)
    try {
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Validate and transform the data
      const products = validateExcelProducts(jsonData as any[])

      setPreview(products)
      setIsLoading(false)
    } catch (error) {
      console.error("Error parsing Excel file:", error)
      setError("Failed to parse the Excel file. Please check the format.")
      setIsLoading(false)
    }
  }

  const handleImport = async () => {
    if (preview.length === 0) {
      setError("No valid products found in the file")
      return
    }

    setIsImporting(true)
    setImportProgress('Validating products...')
    setError(null)

    try {
      setImportProgress('Saving products to database...')
      await onImport(preview)
      setImportProgress('Import completed successfully!')
      
      // Reset form after successful import
      setTimeout(() => {
        setFile(null)
        setPreview([])
        setImportProgress('')
        setIsImporting(false)
      }, 1000)
    } catch (error) {
      console.error('Import failed:', error)
      setError('Failed to import products. Please try again.')
      setImportProgress('')
      setIsImporting(false)
    }
  }

  // Fixed downloadTemplate function to work in browser environment
  const downloadTemplate = () => {
    try {
      const sampleData = getSampleExcelData()
      const worksheet = XLSX.utils.json_to_sheet(sampleData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products")

      // Use browser-compatible method to download
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Create download link and trigger click
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "product_import_template.xlsx"
      document.body.appendChild(link)
      link.click()

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }, 100)
    } catch (error) {
      console.error("Error generating template:", error)
      setError("Failed to generate template. Please try again.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Import Products</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="file">Upload Excel File</Label>
              <Button variant="outline" size="sm" onClick={downloadTemplate} className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                Download Template
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                id="file" 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleFileChange} 
                className="flex-1"
                disabled={isImporting}
              />
              {file && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setFile(null)
                    setPreview([])
                  }}
                  disabled={isImporting}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Upload an Excel file (.xlsx, .xls) or CSV file with product data
            </p>
          </div>

          {file && !isLoading && preview.length > 0 && (
            <>
              <div className="space-y-2">
                <h3 className="font-medium">Preview ({preview.length} products)</h3>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                          <th className="px-4 py-2 text-left">Model</th>
                          <th className="px-4 py-2 text-left">Category</th>
                          <th className="px-4 py-2 text-left">Color</th>
                          <th className="px-4 py-2 text-right">Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.slice(0, 5).map((product, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{product.name}</td>
                            <td className="px-4 py-2">{product.model}</td>
                            <td className="px-4 py-2">{product.category}</td>
                            <td className="px-4 py-2">{product.color}</td>
                            <td className="px-4 py-2 text-right">${product.price.toFixed(2)}</td>
                          </tr>
                        ))}
                        {preview.length > 5 && (
                          <tr className="border-t">
                            <td colSpan={5} className="px-4 py-2 text-center text-muted-foreground">
                              ... and {preview.length - 5} more products
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {isImporting && importProgress && (
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    <span className="text-sm font-medium">{importProgress}</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={onCancel} disabled={isImporting}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleImport} 
                  className="flex items-center gap-2"
                  disabled={isImporting}
                >
                  <Upload size={16} />
                  {isImporting ? 'Importing...' : `Import ${preview.length} Products`}
                </Button>
              </div>
            </>
          )}

          {isLoading && (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
              <p>Processing file...</p>
            </div>
          )}

          {!file && (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-medium mb-2">Upload an Excel file</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The file should contain columns for product data (name, model, category, etc.)
              </p>
              <Button
                variant="outline"
                onClick={() => document.getElementById("file")?.click()}
                className="flex items-center gap-2 mx-auto"
                disabled={isImporting}
              >
                <Upload size={16} />
                Select File
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

