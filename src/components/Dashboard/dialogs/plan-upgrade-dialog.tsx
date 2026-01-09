

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import PaymentForm, { type PaymentDetails } from "@/components/Dashboard/forms/PaymentForm"
import { PLANS_CONFIG } from "@/lib/plans"
import { authFetch } from "@/lib/auth-fetch"

interface PlanUpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlan: string | undefined
}

function getNextPlanType(currentType: string): string {
  const upgradeMap: Record<string, string> = {
    free: "STANDARD",
    standard: "PREMIUM",
    FREE: "STANDARD",
    STANDARD: "PREMIUM",
  }
  return upgradeMap[currentType] || "STANDARD"
}

export default function PlanUpgradeDialog({ open, onOpenChange, currentPlan }: PlanUpgradeDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const nextPlanType = getNextPlanType(currentPlan || "free")
  const nextPlanConfig = PLANS_CONFIG[nextPlanType as keyof typeof PLANS_CONFIG]

  const handlePaymentSubmit = async (paymentDetails: PaymentDetails) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authFetch("http://localhost:3000/api/v1/plans/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planType: nextPlanType.toLowerCase(),
          paymentDetails,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to upgrade plan")
      }

      console.log("[v0] Plan upgraded successfully:", result.data)
      setSuccess(true)

      // Close dialog after 2 seconds
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setIsLoading(false)
      }, 2000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to upgrade plan"
      setError(errorMsg)
      console.error("[v0] Upgrade error:", err)
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
              <DialogTitle className="text-xl">Plan Upgraded Successfully!</DialogTitle>
              <DialogDescription className="mt-2 text-muted-foreground">
                Your {nextPlanConfig?.name} plan is now active. You'll be redirected shortly.
              </DialogDescription>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Upgrade to {nextPlanConfig?.name}</DialogTitle>
              <DialogDescription>Complete your upgrade by entering your payment details below</DialogDescription>
            </DialogHeader>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {nextPlanConfig ? (
              <PaymentForm
                planType={nextPlanType}
                planPrice={nextPlanConfig.price || 0}
                onSubmit={handlePaymentSubmit}
                isLoading={isLoading}
              />
            ) : (
              <p className="text-sm text-muted-foreground">No upgrade available</p>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}