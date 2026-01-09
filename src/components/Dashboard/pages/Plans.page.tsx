
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import PlanUpgradeDialog from "@/components/Dashboard/dialogs/plan-upgrade-dialog";
import PlanPurchaseDialog from "@/components/Dashboard/dialogs/PlanPurchase.dialog";
import { PLANS_CONFIG, canUpgrade } from "@/lib/plans";
import { authFetch } from "@/lib/auth-fetch";

interface PlanData {
  plan: {
    id: string;
    type: string;
    purchaseDate: string;
    expiryDate: string;
    status: string;
    limits: Record<string, number>;
    usage: {
      basic: { used: number; limit: number; remaining: number };
      san: { used: number; limit: number; remaining: number };
      wildcard: { used: number; limit: number; remaining: number };
    };
    features: {
      maxDuration: number;
      minDuration: number;
      validationMethods: string[];
      supportsSAN: boolean;
      supportsWildcard: boolean;
      supportsRenewal: boolean;
    };
  };
}

export default function YourPlanSection() {
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState<{
    type: string;
    name: string;
    price: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPlan, setHasPlan] = useState(false);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        setLoading(true);
        const response = await authFetch(
          "http://localhost:3000/api/v1/plans/my-plan"
        );
        const result = await response.json();

        if (!response.ok) {
          console.log(response);
          if (response.status === 404) {
            setHasPlan(false);
            setError(null);
          } else {
            throw new Error(result.error || "Failed to fetch plan");
          }
          return;
        }

        setPlanData(result.data);
        setHasPlan(true);
        setError(null);
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Failed to load plan";
        setError(errorMsg);
        setHasPlan(false);
        console.log("[v0] Error fetching plan:", errorMsg);
      } finally {
        setLoading(false);
      }
    };
    console.log("has plan", hasPlan);
    fetchPlan();
  }, []);

  // Handle Stripe redirect results
  useEffect(() => {
    const handleStripeRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get("checkout_success");
      const sessionId = urlParams.get("session_id");

      if (success && sessionId) {
        console.log("Payment successful, verifying...");

        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.log("No token found, redirecting to login...");
            window.location.href = "/login";
            return;
          }

          // Verify payment and create plan
          const response = await authFetch(
            "http://localhost:3000/api/v1/plans/verify-payment",
            {
              method: "POST",
              body: JSON.stringify({ sessionId }),
            }
          );

          const result = await response.json();

          if (result.success) {
            console.log("Plan activated successfully");

            // Clean URL and refresh
            window.history.replaceState({}, "", "/dashboard");
            window.location.reload();
          } else {
            console.error("Payment verification failed:", result.error);
            window.history.replaceState({}, "", "/dashboard");
          }
        } catch (error) {
          console.error("Verification error:", error);
          window.history.replaceState({}, "", "/dashboard");
        }
      }

      // Handle cancellation
      const canceled = urlParams.get("checkout_canceled");
      if (canceled) {
        console.log("Payment canceled by user");
        window.history.replaceState({}, "", "/dashboard");
      }
    };

    // Allow only if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      handleStripeRedirect();
    }
  }, []);

  const handlePlanSelect = async (
    planType: string,
    planName: string,
    price: number
  ) => {
    try {
      console.log("Selected plan:", planType, "Price:", price);
      setIsProcessingPayment(true);

      // For free plan, use the dialog
      if (price === 0) {
        setSelectedPlanForPurchase({
          type: planType,
          name: planName,
          price: price,
        });
        setShowPurchaseDialog(true);
        return;
      }

      // for paid plans: Redirect to Stripe Checkout
      console.log("Initiating Stripe checkout for plan:", planType);

      const response = await authFetch(
        "http://localhost:3000/api/v1/plans/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planType }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      const result = await response.json();
      console.log("Full API response:", result);

      if (result.success) {
        console.log(" Checkout session created. Redirecting to:", result.url);

        //  Redirect to Stripe Checkout
        window.location.href = result.url;
      } else {
        throw new Error(result.error || "Failed to create checkout session");
      }
    } catch (error) {
      console.error(" Checkout failed:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to initiate payment";
      setError(errorMsg);

      // Show error to user
      alert("Error: " + errorMsg);
    }
    setIsProcessingPayment(false);
  };

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
          <h2 className="text-3xl font-bold mb-2">Your Plan</h2>
          <p className="text-muted-foreground">
            Manage your subscription and plan details
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Loader />
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = planData?.plan;
  const planType = plan?.type.toUpperCase() as keyof typeof PLANS_CONFIG;
  const planConfig = PLANS_CONFIG[planType];
  const canUpgradePlan = canUpgrade(plan?.type || "");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Your Plan</h2>
        <p className="text-zinc-300">
          Manage your subscription and plan details
        </p>
      </div>

      {error && hasPlan && (
        <Card className="border-destructive bg-destructive/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {hasPlan === false && (
        <div className="space-y-6">
          <Card className="border-primary/20 bg-primary/5">                       
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                No Plan Selected
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Please choose a plan to get started with SSL certificates
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Available Plans Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(PLANS_CONFIG).map(([key, planOption]) => (
              <Card key={key} className="flex flex-col hover:border-primary/30 transition-colors">
                <CardHeader>
                  <CardTitle>{planOption.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold text-foreground">
                    {planOption.displayPrice}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">

                  {/* Features List */}
                  <div className="space-y-2">
                    {planOption.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Details */}
                  <div className="pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-300">Validity:</span>
                      <span className="font-semibold">
                        {planOption.minDuration} days
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-4 bg-[#09402D] hover:bg-[#073928]"
                    onClick={() =>
                      handlePlanSelect(
                        key,
                        planOption.name,
                        planOption.price || 0
                      )
                    }
                  >
                    Get {planOption.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Show current plan details when user has a plan */}
      {hasPlan && plan && (
        <>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Current Plan: {planConfig?.name}
              </CardTitle>
              <CardDescription>
                Active until {new Date(plan.expiryDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Plan Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-lg font-semibold">
                    {planConfig?.displayPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">
                    {plan.features.minDuration} days
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold capitalize text-primary">
                    {plan.status}
                  </p>
                </div>
              </div>

              {/* Certificate Usage */}
              <div className="space-y-3">
                <h3 className="font-semibold">Certificate Usage</h3>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div>
                      <p className="text-sm font-medium">Basic Certificates</p>
                      <p className="text-xs text-muted-foreground">
                        {plan.usage.basic.used} of {plan.usage.basic.limit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {plan.usage.basic.remaining}
                      </p>
                      <p className="text-xs text-muted-foreground">remaining</p>
                    </div>
                  </div>

                  {plan.features.supportsSAN && (
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium">SAN Certificates</p>
                        <p className="text-xs text-muted-foreground">
                          {plan.usage.san.used} of {plan.usage.san.limit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {plan.usage.san.remaining}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          remaining
                        </p>
                      </div>
                    </div>
                  )}

                  {plan.features.supportsWildcard && (
                    <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium">
                          Wildcard Certificates
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {plan.usage.wildcard.used} of{" "}
                          {plan.usage.wildcard.limit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {plan.usage.wildcard.remaining}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          remaining
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="font-semibold">Plan Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {planConfig?.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upgrade Button */}
              {canUpgradePlan ? (
                <Button
                  onClick={() => setShowUpgradeDialog(true)}
                  className="w-full bg-[#09402D] hover:bg-[#073928]"
                >
                  Upgrade to {PLANS_CONFIG[getNextPlanType(planType)]?.name}
                </Button>
              ) : (
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    You have the highest plan available. To access more
                    features, contact our sales team.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <PlanPurchaseDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        selectedPlan={selectedPlanForPurchase}
      />

      <PlanUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        currentPlan={plan?.type}
      />
    </div>
  );
}

function getNextPlanType(currentType: keyof typeof PLANS_CONFIG) {
  const upgradeMap: Record<string, keyof typeof PLANS_CONFIG> = {
    FREE: "STANDARD",
    STANDARD: "PREMIUM",
  };
  return upgradeMap[currentType] || "STANDARD";
}
