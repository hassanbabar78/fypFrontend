
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CsrGenerationDialog from "@/components/Dashboard/dialogs/CsrGeneration.dialog";
import PurchaseConfirmDialog from "@/components/Dashboard/dialogs/PurchaseConfirm.dialog";
import { OTHER_SSL_PERIOD_DAYS, SERVER_SOFTWARE } from "@/constants/constant";
import { authFetch } from "@/lib/auth-fetch";

const VALIDATION_METHODS = [
  "webmaster@",
  "admin@",
  "administrator@",
  "hostmaster@",
  "postmaster@",
];

// DNS-only validation methods (for Wildcard and UCC/SAN)
const DNS_VALIDATION_METHODS = [
  "webmaster@",
  "admin@",
  "administrator@",
  "hostmaster@",
  "postmaster@",
  "cname_csr_hash", // DNS validation
];

interface DomainConfig {
  domain: string;
  validationMethod: string;
}

interface FormData {
  certificateType: "basic" | "ucc-san" | "wildcard";
  domains: DomainConfig[];
  serverSoftware: string;
  duration: string;
  organizationName: string;
  country: string;
  state: string;
  city: string;
}

export default function EnterprisePlanForm() {
  const [formData, setFormData] = useState<FormData>({
    certificateType: "basic",
    domains: [{ domain: "", validationMethod: "" }],
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

  const isBasic = formData.certificateType === "basic";
  const isUccSan = formData.certificateType === "ucc-san";
  const isWildcard = formData.certificateType === "wildcard";

  // Domain Validation
  const isValidDomain = (domain: string) => {
    if (!domain) return false;
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const wildcardRegex = /^\*\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain) || wildcardRegex.test(domain);
  };

  // Form validation
  const isFormValid = () => {
    const commonValid = 
      formData.serverSoftware &&
      formData.duration &&
      formData.organizationName &&
      formData.country &&
      formData.state &&
      formData.city;

    if (isBasic) {
      return commonValid && 
             formData.domains[0].domain && 
             formData.domains[0].validationMethod &&
             isValidDomain(formData.domains[0].domain);
    } else if (isUccSan) {
      return commonValid && 
             formData.domains.every(d => d.domain && d.validationMethod && isValidDomain(d.domain));
    } else if (isWildcard) {
      return commonValid && 
             formData.domains[0].domain && 
             formData.domains[0].validationMethod &&
             formData.domains[0].domain.startsWith("*.") &&
             isValidDomain(formData.domains[0].domain);
    }
    return false;
  };

  // Domain limit
  const maxDomains = isBasic ? 1 : isUccSan ? 5 : 1;
  const canAddDomain = formData.domains.length < maxDomains;

  const addDomain = () => {
    if (canAddDomain) {
      setFormData(prev => ({
        ...prev,
        domains: [...prev.domains, { domain: "", validationMethod: "" }]
      }));
    }
  };

  const removeDomain = (index: number) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index)
    }));
  };

  const updateDomain = (index: number, field: keyof DomainConfig, value: string) => {
    setFormData(prev => ({
      ...prev,
      domains: prev.domains.map((d, i) => 
        i === index ? { ...d, [field]: value } : d
      )
    }));
  };

  // Handle certificate type change
  const handleCertificateTypeChange = (type: "basic" | "ucc-san" | "wildcard") => {
    setFormData({
      certificateType: type,
      domains: type === "ucc-san" ? 
        [{ domain: "", validationMethod: "" }, { domain: "", validationMethod: "" }] : 
        [{ domain: "", validationMethod: "" }],
      serverSoftware: "",
      duration: "",
      organizationName: "",
      country: "",
      state: "",
      city: "",
    });
    setCsrGenerated(false);
    setOrderId(null);
  };

  // Generate CSR and create draft order
  const handleGenerateCsr = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate domains
      const invalidDomains = formData.domains.filter(d => !isValidDomain(d.domain));
      if (invalidDomains.length > 0) {
        throw new Error("Please enter valid domain names");
      }

      // For wildcard, ensure it starts with *.
      if (isWildcard && !formData.domains[0].domain.startsWith("*.")) {
        throw new Error("Wildcard domain must start with *.");
      }

      // Get user's current plan
      const planResponse = await authFetch("http://localhost:3000/api/v1/plans/my-plan");
      const planResult = await planResponse.json();

      if (!planResponse.ok) {
        throw new Error(planResult.error || "Failed to fetch user plan");
      }

      const planId = planResult.data.plan.id;

      // Extract domains based on certificate type
      const mainDomain = formData.domains[0].domain;
      const sanDomains = isUccSan ? formData.domains.slice(1).map(d => d.domain) : [];

      // Determine certificate type for API
      let apiCertificateType: "basic" | "san" | "wildcard" = "basic";
      if (isWildcard) apiCertificateType = "wildcard";
      else if (isUccSan) apiCertificateType = "san";

      // Generate CSR and create draft order
      const response = await authFetch("http://localhost:3000/api/v1/certificates/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: planId,
          domain: mainDomain,
          sanDomains: sanDomains,
          isWildcard: isWildcard,
          certificateType: apiCertificateType,
          organization: formData.organizationName,
          country: formData.country,
          state: formData.state,
          city: formData.city,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.data.orderId);
        setShowCsrDialog(true);
      } else {
        throw new Error(result.error || "Failed to generate CSR");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to generate CSR";
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

  // Submit certificate to SSL.com
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
      const response = await authFetch("http://localhost:3000/api/v1/certificates/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: orderId,
          validationMethod: formData.domains[0].validationMethod.includes("@") 
            ? "email" 
            : formData.domains[0].validationMethod.includes("cname") 
            ? "dns" 
            : "http",
          validityPeriod: parseInt(formData.duration),
          serverSoftware: parseInt(formData.serverSoftware),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowPurchaseDialog(false);
        alert("Certificate submitted successfully! Check your email for validation.");

        // Reset form
        setFormData({
          certificateType: "basic",
          domains: [{ domain: "", validationMethod: "" }],
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
      const errorMsg = err instanceof Error ? err.message : "Failed to submit certificate";
      setError(errorMsg);
      console.error("Certificate submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Get available validation methods based on certificate type
  const getValidationMethods = () => {
    if (isBasic) {
      return VALIDATION_METHODS; // All methods for Basic
    } else {
      return DNS_VALIDATION_METHODS; // Only email and DNS for UCC/SAN and Wildcard
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Enterprise Plan - Certificate Configuration</CardTitle>
          <CardDescription>
            Choose your certificate type and configure the details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Certificate Type Selection */}
          <div>
            <Label className="text-base font-semibold mb-4 block">
              Certificate Type
            </Label>
            <RadioGroup
              value={formData.certificateType}
              onValueChange={(value: "basic" | "ucc-san" | "wildcard") => 
                handleCertificateTypeChange(value)
              }
              className="flex gap-6 radio-white-always"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="basic" id="basic" />
                <Label htmlFor="basic" className="font-normal">
                  Basic SSL Certificate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ucc-san" id="ucc-san" />
                <Label htmlFor="ucc-san" className="font-normal">
                  UCC/SAN Certificate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wildcard" id="wildcard" />
                <Label htmlFor="wildcard" className="font-normal">
                  Wildcard Certificate
                </Label>
              </div>
            </RadioGroup>

            {/* Certificate Type Description */}
            <div className="mt-3 text-sm text-muted-foreground">
              {isBasic && <p>Single domain certificate - Perfect for individual websites</p>}
              {isUccSan && <p>UCC/SAN certificate - Secure multiple domains with one certificate (up to 5 domains)</p>}
              {isWildcard && <p>Wildcard certificate - Secure all subdomains of a single domain</p>}
            </div>
          </div>

          {/* Domains Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>
                {isBasic ? "Domain" : isWildcard ? "Wildcard Domain" : "Domains"} 
                ({formData.domains.length}/{maxDomains})
              </Label>
              {canAddDomain && isUccSan && (
                <Button variant="outline" size="sm" onClick={addDomain}>
                  Add Domain
                </Button>
              )}
            </div>

            {formData.domains.map((domainConfig, index) => (
              <div key={index} className="mb-4 p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label className="mb-2 ml-1" htmlFor={`domain-${index}`}>
                      {isBasic ? "Domain" : isWildcard ? "Wildcard Domain" : `Domain ${index + 1}`}
                    </Label>
                    <Input 
                      id={`domain-${index}`}
                      placeholder={
                        isBasic ? "example.com" : 
                        isWildcard ? "*.example.com" : 
                        "example.com"
                      }
                      value={domainConfig.domain}
                      onChange={(e) => updateDomain(index, "domain", e.target.value)}
                    />
                    {!isValidDomain(domainConfig.domain) && domainConfig.domain && (
                      <p className="text-xs text-destructive mt-1">
                        Please enter a valid domain
                      </p>
                    )}
                    {isWildcard && !domainConfig.domain.startsWith("*.") && domainConfig.domain && (
                      <p className="text-xs text-destructive mt-1">
                        Wildcard domain must start with *.
                      </p>
                    )}
                    {domainConfig.domain.startsWith("*.") && (
                      <p className="text-xs text-primary mt-1">
                        Wildcard domain - will secure all subdomains
                      </p>
                    )}
                  </div>
                  {formData.domains.length > 1 && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDomain(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <div>
                  <Label className="mb-2 ml-1" htmlFor={`validation-${index}`}>
                    Validation Method
                  </Label>
                  <Select
                    value={domainConfig.validationMethod}
                    onValueChange={(value) => updateDomain(index, "validationMethod", value)}
                  >
                    <SelectTrigger id={`validation-${index}`}>
                      <SelectValue placeholder="Select validation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Email Validation</SelectLabel>
                        {getValidationMethods()
                          .filter(method => method.includes("@"))
                          .map((method) => (
                            <SelectItem key={method} value={method + domainConfig.domain}>
                              {method}
                              {domainConfig.domain || "[domain]"}
                            </SelectItem>
                          ))}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>DNS Validation</SelectLabel>
                        <SelectItem value="cname_csr_hash">
                          DNS (CNAME) Validation
                        </SelectItem>
                      </SelectGroup>
                      {isBasic && (
                        <SelectGroup>
                          <SelectLabel>HTTP/HTTPS Validation</SelectLabel>
                          <SelectItem value="http_csr_hash">
                            HTTP File Validation
                          </SelectItem>
                          <SelectItem value="https_csr_hash">
                            HTTPS File Validation
                          </SelectItem>
                        </SelectGroup>
                      )}
                    </SelectContent>
                  </Select>

                  {domainConfig.validationMethod.includes("@") && domainConfig.domain && (
                    <div className="mt-2">
                      <Label className="text-xs text-muted-foreground">
                        Email addresses for validation:
                      </Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {getValidationMethods()
                          .filter(method => method.includes("@"))
                          .map((method) => (
                            <span key={method} className="text-xs bg-secondary px-2 py-1 rounded">
                              {method}
                              {domainConfig.domain.replace("*.", "")}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Common Configuration */}
          <div>
            <Label className="mb-2 ml-1" htmlFor="serverSoftware">Server Software</Label>
            <Select
              value={formData.serverSoftware}
              onValueChange={(value) => setFormData({ ...formData, serverSoftware: value })}
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
            <Label className="mb-2 ml-1" htmlFor="duration">Validity Period</Label>
            <Select
              value={formData.duration}
              onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select validity period" />
              </SelectTrigger>
              <SelectContent>
                {OTHER_SSL_PERIOD_DAYS.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 ml-1" htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Your Organization"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 ml-1" htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="US"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 ml-1" htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="California"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-2 ml-1" htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="San Francisco"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
          </div>

          <Button
            onClick={handleGenerateCsr}
            disabled={!isFormValid() || csrGenerated || loading}
            className="w-full bg-button hover:bg-button-hover"
          >
            {loading ? "Generating CSR..." : csrGenerated ? "CSR Already Generated" : "Generate CSR"}
          </Button>

          {csrGenerated && (
            <Button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full bg-button hover:bg-button-hover"
            >
              {loading ? "Submitting..." : "Purchase Certificate"}
            </Button>
          )}
        </CardContent>
      </Card>

      <CsrGenerationDialog
        open={showCsrDialog}
        onOpenChange={setShowCsrDialog}
        formData={formData}
        onConfirm={handleCsrConfirm}
        isEnterprisePlan={true}
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