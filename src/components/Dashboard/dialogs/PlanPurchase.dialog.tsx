
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import PaymentForm, { type PaymentDetails } from "@/components/Dashboard/forms/PaymentForm"
import { authFetch } from "@/lib/auth-fetch"

interface PlanPurchaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPlan: {
    type: string
    name: string
    price: number
  } | null
}

export default function PlanPurchaseDialog({ open, onOpenChange, selectedPlan }: PlanPurchaseDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePaymentSubmit = async (paymentDetails: PaymentDetails) => {
    if (!selectedPlan) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await authFetch("http://localhost:3000/api/v1/plans/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: selectedPlan.type,
          paymentDetails: selectedPlan.price > 0 ? paymentDetails : null,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to purchase plan")
      }

      console.log("[v0] Plan purchased successfully:", result.data)
      setSuccess(true)

      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setIsLoading(false)
      }, 2000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to purchase plan"
      setError(errorMsg)
      console.error("[v0] Purchase error:", err)
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading && !success) {
      onOpenChange(false)
      setError(null)
      setSuccess(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border">
        {success ? (
          <div className="space-y-4 text-center py-8">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <div>
              <DialogTitle className="text-xl">Plan Purchased Successfully!</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground">
                Your {selectedPlan?.name} plan is now active. You'll be redirected shortly.
              </DialogDescription>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Purchase {selectedPlan?.name} Plan</DialogTitle>
              <DialogDescription>Complete your purchase by entering your payment details below</DialogDescription>
            </DialogHeader>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {selectedPlan ? (
              <PaymentForm
                planType={selectedPlan.type}
                planPrice={selectedPlan.price}
                onSubmit={handlePaymentSubmit}
                isLoading={isLoading}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No plan selected</p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}