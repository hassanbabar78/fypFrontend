
import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"

interface PaymentFormProps {
  planType: string
  planPrice: number
  onSubmit: (paymentDetails: PaymentDetails) => Promise<void>
  isLoading?: boolean
}

export interface PaymentDetails {
  cardNumber: string
  expiryMonth: string
  expiryYear: string
  cvc: string
  cardholderName: string
}

export default function PaymentForm({ planPrice, onSubmit, isLoading = false }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentDetails>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    cardholderName: "",
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (
      !formData.cardNumber ||
      !formData.expiryMonth ||
      !formData.expiryYear ||
      !formData.cvc ||
      !formData.cardholderName
    ) {
      setError("Please fill in all payment details")
      return
    }

    // Basic validation
    if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      setError("Invalid card number")
      return
    }

    if (formData.cvc.length < 3) {
      setError("Invalid CVC")
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Payment processing failed"
      setError(errorMsg)
      console.error("[v0] Payment error:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="cardholderName">Cardholder Name</Label>
        <Input
          id="cardholderName"
          name="cardholderName"
          placeholder="John Doe"
          value={formData.cardholderName}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={handleChange}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryMonth">Month</Label>
          <Input
            id="expiryMonth"
            name="expiryMonth"
            placeholder="MM"
            maxLength={2}
            value={formData.expiryMonth}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiryYear">Year</Label>
          <Input
            id="expiryYear"
            name="expiryYear"
            placeholder="YY"
            maxLength={2}
            value={formData.expiryYear}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvc">CVC</Label>
          <Input
            id="cvc"
            name="cvc"
            placeholder="123"
            maxLength={3}
            value={formData.cvc}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">Amount to pay:</span>
          <span className="text-lg font-semibold">${(planPrice / 100).toFixed(2)}</span>
        </div>
        <Button type="submit" className="w-full bg-button hover:bg-button-hover" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Complete Purchase`
          )}
        </Button>
      </div>
    </form>
  )
}
