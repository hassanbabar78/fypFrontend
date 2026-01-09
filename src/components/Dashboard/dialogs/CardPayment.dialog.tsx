

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { z } from "zod"
import { PLANS_CONFIG } from "@/lib/plans"

const cardSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryMonth: z.string().regex(/^\d{2}$/, "Month must be 2 digits"),
  expiryYear: z.string().regex(/^\d{2}$/, "Year must be 2 digits"),
  cvc: z.string().regex(/^\d{3,4}$/, "CVC must be 3-4 digits"),
  cardholderName: z.string().min(2, "Cardholder name is required"),
})

type CardFormData = z.infer<typeof cardSchema>

interface CardPaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  planType?: keyof typeof PLANS_CONFIG
  onSuccess?: () => void
}

export default function CardPaymentDialog({
  open,
  onOpenChange,
  planType = "STANDARD",
  onSuccess,
}: CardPaymentDialogProps) {
  const [formData, setFormData] = useState<Partial<CardFormData>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const planConfig = PLANS_CONFIG[planType]

  const handleInputChange = (field: keyof CardFormData, value: string) => {
    let formattedValue = value

    if (field === "cardNumber") {
      formattedValue = value.replace(/\D/g, "").slice(0, 16)
    } else if (field === "expiryMonth") {
      formattedValue = value.replace(/\D/g, "").slice(0, 2)
    } else if (field === "expiryYear") {
      formattedValue = value.replace(/\D/g, "").slice(0, 2)
    } else if (field === "cvc") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setFormData((prev) => ({ ...prev, [field]: formattedValue }))

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    setSubmitError(null)
  }

  const handleSubmit = async () => {
    try {
      setIsProcessing(true)
      cardSchema.parse(formData)

      // Call purchase plan API
      const response = await fetch("/api/v1/plans/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: planType.toLowerCase(),
          paymentDetails: {
            cardNumber: formData.cardNumber,
            expiryMonth: formData.expiryMonth,
            expiryYear: formData.expiryYear,
            cvc: formData.cvc,
            cardholderName: formData.cardholderName,
          },
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Payment processing failed")
      }

      // Success
      onOpenChange(false)
      setFormData({})
      setErrors({})
      setSubmitError(null)
      onSuccess?.()
      alert("Plan purchased successfully!")
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.issues.forEach((err) => {
          newErrors[err.path[0] as string] = err.message
        })
        setErrors(newErrors)
      } else {
        const errorMsg = error instanceof Error ? error.message : "Payment processing failed"
        setSubmitError(errorMsg)
        console.log("[v0] Payment error:", errorMsg)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle>Payment Information</DialogTitle>
          <DialogDescription>
            Complete your payment for {planConfig?.name} ({planConfig?.displayPrice})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {submitError && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex gap-2">
              <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{submitError}</p>
            </div>
          )}

          <div>
            <Label htmlFor="cardholder">Cardholder Name</Label>
            <Input
              id="cardholder"
              placeholder="John Doe"
              value={formData.cardholderName || ""}
              onChange={(e) => handleInputChange("cardholderName", e.target.value)}
              className={errors.cardholderName ? "border-destructive" : ""}
              disabled={isProcessing}
            />
            {errors.cardholderName && <p className="text-sm text-destructive mt-1">{errors.cardholderName}</p>}
          </div>

          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber || ""}
              onChange={(e) => handleInputChange("cardNumber", e.target.value)}
              maxLength={16}
              className={errors.cardNumber ? "border-destructive" : ""}
              disabled={isProcessing}
            />
            {errors.cardNumber && <p className="text-sm text-destructive mt-1">{errors.cardNumber}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="expiryMonth">Month (MM)</Label>
              <Input
                id="expiryMonth"
                placeholder="MM"
                value={formData.expiryMonth || ""}
                onChange={(e) => handleInputChange("expiryMonth", e.target.value)}
                maxLength={2}
                className={errors.expiryMonth ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {errors.expiryMonth && <p className="text-xs text-destructive mt-1">{errors.expiryMonth}</p>}
            </div>
            <div>
              <Label htmlFor="expiryYear">Year (YY)</Label>
              <Input
                id="expiryYear"
                placeholder="YY"
                value={formData.expiryYear || ""}
                onChange={(e) => handleInputChange("expiryYear", e.target.value)}
                maxLength={2}
                className={errors.expiryYear ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {errors.expiryYear && <p className="text-xs text-destructive mt-1">{errors.expiryYear}</p>}
            </div>
            <div>
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                type="password"
                value={formData.cvc || ""}
                onChange={(e) => handleInputChange("cvc", e.target.value)}
                maxLength={4}
                className={errors.cvc ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {errors.cvc && <p className="text-xs text-destructive mt-1">{errors.cvc}</p>}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 bg-[#09402D] hover:bg-[#073928]" disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1 bg-[#09402D] hover:bg-[#073928]" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}