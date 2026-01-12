

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Lock } from "lucide-react"
import FreePlanForm from "@/components/Dashboard/buyCertificates/FreePlan.form"
import BasicPlanForm from "@/components/Dashboard/buyCertificates/BasicPlan.form"
import EnterprisePlanForm from "@/components/Dashboard/buyCertificates/PremiumPlan.form"
import { PLANS_CONFIG } from "@/lib/plans"
import { authFetch } from "@/lib/auth-fetch"

interface PlanData {
  plan: {
    id: string
    type: string
    purchaseDate: string
    expiryDate: string
    status: string
    limits: Record<string, number>
    usage: {
      basic: { used: number; limit: number; remaining: number }
      san: { used: number; limit: number; remaining: number }
      wildcard: { used: number; limit: number; remaining: number }
    }
    features: {
      maxDuration: number
      minDuration: number
      validationMethods: string[]
      supportsSAN: boolean
      supportsWildcard: boolean
      supportsRenewal: boolean
    }
  }
}

export default function BuyCertificateSection() {
  const [userPlan, setUserPlan] = useState<"FREE" | "STANDARD" | "PREMIUM" | null>(null)
  const [planData, setPlanData] = useState<PlanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasPlan, setHasPlan] = useState(false)

  const fetchPlan = async () => {
    try {
      setLoading(true)
      const response = await authFetch(
        "http://localhost:3000/api/v1/plans/my-plan"
      )
      const result = await response.json()

      if (!response.ok) {
        console.log(response)
        if (response.status === 404) {
          setHasPlan(false)
          setError(null)
          setUserPlan("FREE") // Default to FREE if no plan
        } else {
          throw new Error(result.error || "Failed to fetch plan")
        }
        return
      }

      setPlanData(result.data)
      setHasPlan(true)
      
      // Set the current user's plan type
      const planType = result.data.plan.type.toUpperCase() as "FREE" | "STANDARD" | "PREMIUM"
      setUserPlan(planType)
      setError(null)
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to load plan"
      setError(errorMsg)
      setHasPlan(false)
      setUserPlan("FREE") // Default to FREE on error
      console.log("[v0] Error fetching plan:", errorMsg)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlan()
  }, [])

  const currentPlanType = userPlan || "FREE"
  const currentPlanConfig = PLANS_CONFIG[currentPlanType]

  // Check if a plan is available for the user 
  const isPlanAvailable = (planType: "FREE" | "STANDARD" | "PREMIUM") => {
    if (!hasPlan) return true // If no plan, all plans are available for selection
    
    const planHierarchy = { FREE: 0, STANDARD: 1, PREMIUM: 2 }
    const currentPlanLevel = planHierarchy[currentPlanType]
    const targetPlanLevel = planHierarchy[planType]
    
    return targetPlanLevel === currentPlanLevel
  }

  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-border"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading plan information...</p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Buy Certificate</h2>
          <p className="text-muted-foreground">Configure and purchase your SSL certificate</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Loader />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Buy Certificate</h2>
        <p className="text-muted-foreground">Configure and purchase your SSL certificate</p>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Current Plan Status */}
      {hasPlan && planData && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
              Current Plan: {currentPlanConfig?.name}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Active until {new Date(planData.plan.expiryDate).toLocaleDateString()}
              {currentPlanType !== "PREMIUM" && " - You can upgrade to access more features"}
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Plan selector with info cards */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Select Certificate Type</CardTitle>
          <CardDescription>
            {hasPlan 
              ? `Your current plan: ${currentPlanConfig?.name} - Choose certificate types available in your plan`
              : "Choose a plan to purchase SSL certificates"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["FREE", "STANDARD", "PREMIUM"] as const).map((plan) => {
              const planConfig = PLANS_CONFIG[plan]
              const isAvailable = isPlanAvailable(plan)
              const isCurrentPlan = userPlan === plan
              
              return (
                <button
                  key={plan}
                  onClick={() => isAvailable && setUserPlan(plan)}
                  disabled={!isAvailable}
                  className={`p-4 rounded-lg border-2 transition-all text-left relative ${
                    isCurrentPlan
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : isAvailable
                      ? "border-border hover:border-primary/50 hover:bg-accent cursor-pointer"
                      : "border-border bg-card opacity-60 cursor-not-allowed"
                  }`}
                >
                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute -top-2 -right-2 bg-button text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Current
                    </div>
                  )}
                  
                  {/* Lock Icon for unavailable plans */}
                  {!isAvailable && (
                    <div className="absolute top-2 right-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}

                  <h3 className={`font-semibold ${!isAvailable ? "text-muted-foreground" : ""}`}>
                    {planConfig?.name}
                  </h3>
                  <p className={`text-sm mt-1 ${!isAvailable ? "text-muted-foreground" : "text-muted-foreground"}`}>
                    {planConfig?.displayPrice}
                  </p>
                  
                  <div className="flex gap-2 mt-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded ${
                      !isAvailable 
                        ? " text-muted-foreground" 
                        : "bg-secondary"
                    }`}>
                      {planConfig?.certificateLimits.basic} Basic
                    </span>
                    {planConfig?.certificateLimits.san > 0 && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        !isAvailable 
                          ? "text-muted-foreground" 
                          : "bg-secondary"
                      }`}>
                        {planConfig.certificateLimits.san} SAN
                      </span>
                    )}
                    {planConfig?.certificateLimits.wildcard > 0 && (
                      <span className={`text-xs px-2 py-1 rounded ${
                        !isAvailable 
                          ? "text-muted-foreground" 
                          : "bg-secondary"
                      }`}>
                        {planConfig.certificateLimits.wildcard} Wildcard
                      </span>
                    )}
                  </div>

                  {/* Availability Message */}
                  {!isAvailable && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Upgrade required
                    </p>
                  )}
                </button>
              )
            })}
          </div>

          {/* Plan Usage Information */}
          {hasPlan && planData && (
            <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Your Plan Usage</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Basic Certificates: </span>
                  <span className="font-semibold">
                    {planData.plan.usage.basic.used}/{planData.plan.usage.basic.limit}
                  </span>
                </div>
                {planData.plan.features.supportsSAN && (
                  <div>
                    <span className="text-muted-foreground">SAN Certificates: </span>
                    <span className="font-semibold">
                      {planData.plan.usage.san.used}/{planData.plan.usage.san.limit}
                    </span>
                  </div>
                )}
                {planData.plan.features.supportsWildcard && (
                  <div>
                    <span className="text-muted-foreground">Wildcard Certificates: </span>
                    <span className="font-semibold">
                      {planData.plan.usage.wildcard.used}/{planData.plan.usage.wildcard.limit}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dynamic form based on selected plan */}
      <div className="mt-6">
        {userPlan === "FREE" && <FreePlanForm />}
        {userPlan === "STANDARD" && <BasicPlanForm />}
        {userPlan === "PREMIUM" && <EnterprisePlanForm />}
      </div>
    </div>
  )
}