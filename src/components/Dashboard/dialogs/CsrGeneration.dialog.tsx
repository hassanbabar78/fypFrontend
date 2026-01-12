

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface CsrGenerationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: any
  onConfirm: () => void
  isBasicPlan?: boolean
  isEnterprisePlan?: boolean
}

export default function CsrGenerationDialog({
  open,
  onOpenChange,
  formData,
  onConfirm,
  isBasicPlan = false,
  isEnterprisePlan = false,
}: CsrGenerationDialogProps) {
  const [step, setStep] = useState<"confirm" | "generating" | "complete">("confirm")

  const handleConfirm = () => {
    setStep("generating")
    
    // Simulate API call
    setTimeout(() => {
      setStep("complete")
    }, 1500)
  }

  const handleDone = () => {
    setStep("confirm")
    onOpenChange(false)
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border min-w-[30vw] min-h-[40vh]">
        <DialogHeader>
          <DialogTitle>Generate CSR</DialogTitle>
          <DialogDescription>Certificate Signing Request generation</DialogDescription>
        </DialogHeader>

        {step === "confirm" && (
          <div className="space-y-4">
            <Alert className="bg-primary/10 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">
                Please confirm all entered information is correct. This action cannot be undone.
              </AlertDescription>
            </Alert>

            <div className="bg-secondary p-4 rounded-lg text-sm space-y-2 ">
              {isBasicPlan ? (
                <>
                  <p>
                    <span className="font-semibold">Domains:</span>{" "}
                    {formData.domains.map((d: any) => d.domain).join(", ")}
                  </p>
                </>
              ) : isEnterprisePlan ? (
                <>
                  <p>
                    <span className="font-semibold">Certificate Type:</span>{" "}
                    {formData.certificateType === "ucc-san" ? "UCC/SAN" : "Wildcard"}
                  </p>
                  {formData.certificateType === "ucc-san" ? (
                    <p>
                      <span className="font-semibold">Domains:</span>{" "}
                      {formData.domains.map((d: any) => d.domain).join(", ")}
                    </p>
                  ) : (
                    <>
                      {formData.validateBaseUrl && (
                        <p>
                          <span className="font-semibold">Base URL:</span> {formData.baseUrl}
                        </p>
                      )}
                      <p>
                        <span className="font-semibold">Wildcard:</span> {formData.wildcardUrl}
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p>
                    <span className="font-semibold">Domain:</span> {formData.domain}
                  </p>
                </>
              )}
              <p>
                <span className="font-semibold">Organization:</span> {formData.organizationName}
              </p>
              <p>
                <span className="font-semibold">Location:</span> {formData.city}, {formData.state}, {formData.country}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConfirm} className="flex-1 bg-button hover:bg-button-hover">
                Generate
              </Button>
            </div>
          </div>
        )}

        {step === "generating" && (
          <div className="flex flex-col items-center justify-center py-8 ">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-border"></div>
              <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Generating CSR...</p>
          </div>
        )}

        {step === "complete" && (
          <div className="space-y-4">
            <Alert className="bg-primary/10 border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-foreground">CSR generated successfully!</AlertDescription>
            </Alert>

            <div className="bg-secondary p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2">CSR Output:</p>
              <code className="text-xs break-all">-----BEGIN CERTIFICATE REQUEST-----</code>
              <code className="text-xs block text-muted-foreground mt-2">
                MIICljCCAX4CAQAwDQYJKoZIhvcNAQEBBQAwgaAxCzAJBgNVBAYTAkFVMRMwEQYD...
              </code>
              <code className="text-xs break-all">-----END CERTIFICATE REQUEST-----</code>
            </div>

            <Button onClick={handleDone} className="w-full bg-button hover:bg-button-hover">
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
