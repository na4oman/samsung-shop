"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Address } from "@/lib/types"

interface CheckoutFormProps {
  onSubmit: (shippingAddress: Address, billingAddress: Address) => void
  isLoading: boolean
}

export function CheckoutForm({ onSubmit, isLoading }: CheckoutFormProps) {
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  })

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
    phone: "",
  })

  const [sameAsShipping, setSameAsShipping] = useState(true)

  const handleShippingChange = (field: keyof Address, value: string) => {
    const newShippingAddress = { ...shippingAddress, [field]: value }
    setShippingAddress(newShippingAddress)
    
    // If billing is same as shipping, update billing too
    if (sameAsShipping) {
      setBillingAddress(newShippingAddress)
    }
  }

  const handleBillingChange = (field: keyof Address, value: string) => {
    setBillingAddress({ ...billingAddress, [field]: value })
  }

  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked)
    if (checked) {
      setBillingAddress(shippingAddress)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(shippingAddress, sameAsShipping ? shippingAddress : billingAddress)
  }

  const isFormValid = () => {
    const requiredFields: (keyof Address)[] = ['fullName', 'addressLine1', 'city', 'state', 'postalCode', 'phone']
    
    const shippingValid = requiredFields.every(field => {
      const value = shippingAddress[field]
      return value && value.trim() !== ''
    })
    
    const billingValid = sameAsShipping || requiredFields.every(field => {
      const value = billingAddress[field]
      return value && value.trim() !== ''
    })
    
    return shippingValid && billingValid
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping-fullName">Full Name *</Label>
              <Input
                id="shipping-fullName"
                value={shippingAddress.fullName}
                onChange={(e) => handleShippingChange('fullName', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping-phone">Phone *</Label>
              <Input
                id="shipping-phone"
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => handleShippingChange('phone', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="shipping-addressLine1">Address Line 1 *</Label>
            <Input
              id="shipping-addressLine1"
              value={shippingAddress.addressLine1}
              onChange={(e) => handleShippingChange('addressLine1', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="shipping-addressLine2">Address Line 2</Label>
            <Input
              id="shipping-addressLine2"
              value={shippingAddress.addressLine2}
              onChange={(e) => handleShippingChange('addressLine2', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shipping-city">City *</Label>
              <Input
                id="shipping-city"
                value={shippingAddress.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping-state">State *</Label>
              <Input
                id="shipping-state"
                value={shippingAddress.state}
                onChange={(e) => handleShippingChange('state', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="shipping-postalCode">Postal Code *</Label>
              <Input
                id="shipping-postalCode"
                value={shippingAddress.postalCode}
                onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="shipping-country">Country</Label>
            <Input
              id="shipping-country"
              value={shippingAddress.country}
              onChange={(e) => handleShippingChange('country', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-as-shipping"
              checked={sameAsShipping}
              onCheckedChange={handleSameAsShippingChange}
            />
            <Label htmlFor="same-as-shipping">Same as shipping address</Label>
          </div>
          
          {!sameAsShipping && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billing-fullName">Full Name *</Label>
                  <Input
                    id="billing-fullName"
                    value={billingAddress.fullName}
                    onChange={(e) => handleBillingChange('fullName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-phone">Phone *</Label>
                  <Input
                    id="billing-phone"
                    type="tel"
                    value={billingAddress.phone}
                    onChange={(e) => handleBillingChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="billing-addressLine1">Address Line 1 *</Label>
                <Input
                  id="billing-addressLine1"
                  value={billingAddress.addressLine1}
                  onChange={(e) => handleBillingChange('addressLine1', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="billing-addressLine2">Address Line 2</Label>
                <Input
                  id="billing-addressLine2"
                  value={billingAddress.addressLine2}
                  onChange={(e) => handleBillingChange('addressLine2', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billing-city">City *</Label>
                  <Input
                    id="billing-city"
                    value={billingAddress.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-state">State *</Label>
                  <Input
                    id="billing-state"
                    value={billingAddress.state}
                    onChange={(e) => handleBillingChange('state', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="billing-postalCode">Postal Code *</Label>
                  <Input
                    id="billing-postalCode"
                    value={billingAddress.postalCode}
                    onChange={(e) => handleBillingChange('postalCode', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="billing-country">Country</Label>
                <Input
                  id="billing-country"
                  value={billingAddress.country}
                  onChange={(e) => handleBillingChange('country', e.target.value)}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg" 
        disabled={isLoading || !isFormValid()}
      >
        {isLoading ? "Processing..." : "Complete Order"}
      </Button>
    </form>
  )
}