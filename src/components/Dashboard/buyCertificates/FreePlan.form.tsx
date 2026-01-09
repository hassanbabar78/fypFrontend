

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CsrGenerationDialog from "@/components/Dashboard/dialogs/CsrGeneration.dialog";
import PurchaseConfirmDialog from "@/components/Dashboard/dialogs/PurchaseConfirm.dialog";
import { FREE_SSL_PERIOD_DAYS, SERVER_SOFTWARE } from "@/constants/constant";
import { authFetch } from "@/lib/auth-fetch";

const VALIDATION_METHODS = [
  "webmaster@",
  "admin@",
  "administrator@",
  "hostmaster@",
  "postmaster@",
];

interface FormData {
  domain: string;
  validationMethod: string;
  serverSoftware: string;
  duration: string;
  organizationName: string;
  country: string;
  state: string;
  city: string;
}

export default function FreePlanForm() {
  const [formData, setFormData] = useState<FormData>({
    domain: "",
    validationMethod: "",
    serverSoftware: "",
    duration: "",
    organizationName: "",
    country: "",
    state: "",
    city: "",
  });
  const [showCsrDialog, setShowCsrDialog] = useState(false);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [csrGenerated, setCsrGenerated] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormValid = Object.values(formData).every((value) => value !== "");

  // 1) Generate CSR and create draft order
  const handleGenerateCsr = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the user's current plan
      const planResponse = await authFetch(
        "http://localhost:3000/api/v1/plans/my-plan"
      );
      const planResult = await planResponse.json();

      if (!planResponse.ok) {
        throw new Error(planResult.error || "Failed to fetch user plan");
      }

      const planId = planResult.data.plan.id;

      // Generate CSR and create draft order
      const response = await authFetch(
        "http://localhost:3000/api/v1/certificates/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: planId,
            domain: formData.domain,
            sanDomains: [], // Free plan doesn't support SAN
            isWildcard: false, // Free plan doesn't support wildcard
            certificateType: "basic",
            organization: formData.organizationName,
            country: formData.country,
            state: formData.state,
            city: formData.city,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setOrderId(result.data.orderId);
        setShowCsrDialog(true);
      } else {
        throw new Error(result.error || "Failed to generate CSR");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to generate CSR";
      setError(errorMsg);
      console.error("CSR generation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCsrConfirm = () => {
    setCsrGenerated(true);
    setShowCsrDialog(false);
  };

  // 2) Submit to SSL.com for validation
  const handlePurchase = () => {
    setShowPurchaseDialog(true);
  };

  const handlePurchaseConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!orderId) {
        throw new Error("No order ID found. Please generate CSR first.");
      }

      // Submit certificate to SSL.com
      const response = await authFetch(
        "http://localhost:3000/api/v1/certificates/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: orderId,
            validationMethod: formData.validationMethod.includes("@")
              ? "email"
              : formData.validationMethod.includes("cname")
              ? "dns"
              : "http",
            validityPeriod: parseInt(formData.duration),
            serverSoftware: parseInt(formData.serverSoftware),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setShowPurchaseDialog(false);
        alert(
          "Free SSL certificate submitted successfully! Check your email for validation."
        );

        // Reset form
        setFormData({
          domain: "",
          validationMethod: "",
          serverSoftware: "",
          duration: "",
          organizationName: "",
          country: "",
          state: "",
          city: "",
        });
        setCsrGenerated(false);
        setOrderId(null);
      } else {
        throw new Error(result.error || "Failed to submit certificate");
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit certificate";
      setError(errorMsg);
      console.error("Certificate submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Free Plan - Certificate Configuration</CardTitle>
          <CardDescription>
            Configure your free SSL certificate for 1 domain (90 days maximum)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div>
            <Label className="mb-2" htmlFor="domain">Domain</Label>
            <Input 
              id="domain"
              placeholder="example.com"
              value={formData.domain}
              onChange={(e) =>
                setFormData({ ...formData, domain: e.target.value })
              }
              className="input-thin-focus"
            />
          </div>

          <div>
            <Label className="mb-2" htmlFor="validationMethod">Validation Method</Label>
            <Select
              value={formData.validationMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, validationMethod: value })
              }
            >
              <SelectTrigger id="validationMethod">
                <SelectValue placeholder="Select validation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Email Validation</SelectLabel>
                  {VALIDATION_METHODS.map((method) => (
                    <SelectItem key={method} value={method + formData.domain}>
                      {method}
                      {formData.domain || "[domain]"}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>DNS Validation</SelectLabel>
                  <SelectItem value="cname_csr_hash">
                    DNS (CNAME) Validation
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>HTTP/HTTPS Validation</SelectLabel>
                  <SelectItem value="http_csr_hash">
                    HTTP File Validation
                  </SelectItem>
                  <SelectItem value="https_csr_hash">
                    HTTPS File Validation
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="serverSoftware">Server Software</Label>
            <Select
              value={formData.serverSoftware}
              onValueChange={(value) =>
                setFormData({ ...formData, serverSoftware: value })
              }
            >
              <SelectTrigger id="serverSoftware">
                <SelectValue placeholder="Select server software" />
              </SelectTrigger>
              <SelectContent>
                {SERVER_SOFTWARE.map((software) => (
                  <SelectItem key={software.code} value={software.code}>
                    {software.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2" htmlFor="duration">Validity Period</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) =>
                setFormData({ ...formData, duration: value })
              }
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                {FREE_SSL_PERIOD_DAYS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Free SSL certificates have a maximum validity of 90 days
            </p>
          </div>

          <div>
            <Label className="mb-2" htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Your Organization"
              value={formData.organizationName}
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-2" htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="US"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="California"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-2" htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateCsr}
            disabled={!isFormValid || csrGenerated || loading}
            className="w-full bg-[#09402D] hover:bg-[#073928]"
          >
            {loading
              ? "Generating CSR..."
              : csrGenerated
              ? "CSR Already Generated"
              : "Generate CSR"}
          </Button>

          {csrGenerated && (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-[#09402D] hover:bg-[#073928]"
            >
              {loading ? "Submitting..." : "Get Free SSL Certificate"}
            </Button>
          )}
        </CardContent>
      </Card>

      <CsrGenerationDialog
        open={showCsrDialog}
        onOpenChange={setShowCsrDialog}
        formData={formData}
        onConfirm={handleCsrConfirm}
      />

      <PurchaseConfirmDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        formData={formData}
        onConfirm={handlePurchaseConfirm}
        loading={loading}
      />
    </div>
  );
}