

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
import { authFetch } from "@/lib/auth-fetch";
import { OTHER_SSL_PERIOD_DAYS } from "@/constants/constant";

const SERVER_SOFTWARE = [
  { code: "1", name: "OTHER" },
  { code: "2", name: "AOL" },
  { code: "3", name: "Apache-ModSSL" },
  { code: "4", name: "Apache-SSL (Ben-SSL, not Stronghold)" },
  { code: "5", name: "C2Net Stronghold" },
  { code: "6", name: "Cisco 3000 Series VPN Concentrator" },
  { code: "7", name: "Citrix" },
  { code: "8", name: "Cobalt Raq" },
  { code: "9", name: "Covalent Server Software" },
  { code: "10", name: "Ensim" },
  { code: "11", name: "HSphere" },
  { code: "12", name: "IBM HTTP Server" },
  { code: "13", name: "IBM Internet Connection Server" },
  { code: "14", name: "iPlanet" },
  { code: "15", name: "Java Web Server" },
  { code: "16", name: "Lotus Domino" },
  { code: "17", name: "Lotus Domino Go!" },
  { code: "18", name: "Microsoft IIS 1.x to 4.x" },
  { code: "19", name: "Microsoft IIS 5.x to 6.x" },
  { code: "20", name: "Microsoft IIS 7.x+" },
  { code: "21", name: "Netscape Enterprise Server" },
  { code: "22", name: "Netscape FastTrack" },
  { code: "23", name: "Novell Web Server" },
  { code: "24", name: "Oracle" },
  { code: "25", name: "Plesk" },
  { code: "26", name: "Quid Pro Quo" },
  { code: "27", name: "R3 SSL Server" },
  { code: "28", name: "Raven SSL" },
  { code: "29", name: "RedHat Linux" },
  { code: "30", name: "SAP Web Application Server" },
  { code: "31", name: "Tomcat" },
  { code: "32", name: "Website Professional" },
  { code: "33", name: "WebStar 4.x+" },
  { code: "34", name: "WebTen (Tenon)" },
  { code: "35", name: "WHM/CPanel" },
  { code: "36", name: "Zeus Web Server" },
  { code: "37", name: "Nginx" },
  { code: "38", name: "Heroku" },
  { code: "39", name: "Amazon Load Balancer" },
];

const VALIDATION_METHODS = [
  "webmaster@",
  "admin@",
  "administrator@",
  "hostmaster@",
  "postmaster@",
];

interface DomainConfig {
  domain: string;
  validationMethod: string;
}

interface FormData {
  certificateType: "basic" | "san";
  domains: DomainConfig[];
  serverSoftware: string;
  duration: string;
  organizationName: string;
  country: string;
  state: string;
  city: string;
}

export default function BasicPlanForm() {
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

  // Form validation
  const isFormValid =
    formData.certificateType &&
    formData.domains.every((d) => d.domain && d.validationMethod) &&
    formData.serverSoftware &&
    formData.duration &&
    formData.organizationName &&
    formData.country &&
    formData.state &&
    formData.city;

  // Domain limit based on certificate type
  const maxDomains = formData.certificateType === "basic" ? 1 : 100;
  const canAddDomain = formData.domains.length < maxDomains;

  // Domain validation
  const isValidDomain = (domain: string) => {
    if (!domain) return false;

    // Basic domain validation
    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    const wildcardRegex =
      /^\*\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.+[a-zA-Z]{2,}$/;

    return domainRegex.test(domain) || wildcardRegex.test(domain);
  };

  const addDomain = () => {
    if (canAddDomain) {
      setFormData((prev) => ({
        ...prev,
        domains: [...prev.domains, { domain: "", validationMethod: "" }],
      }));
    }
  };

  const removeDomain = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      domains: prev.domains.filter((_, i) => i !== index),
    }));
  };

  const updateDomain = (
    index: number,
    field: keyof DomainConfig,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      domains: prev.domains.map((d, i) =>
        i === index ? { ...d, [field]: value } : d
      ),
    }));
  };

  // Handle certificate type change
  const handleCertificateTypeChange = (type: "basic" | "san") => {
    setFormData({
      certificateType: type,
      domains:
        type === "basic"
          ? [{ domain: "", validationMethod: "" }]
          : [{ domain: "", validationMethod: "" }],
      serverSoftware: "",
      duration: "",
      organizationName: "",
      country: "",
      state: "",
      city: "",
    });
  };

  // 1) Generate CSR and create draft order
  const handleGenerateCsr = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate all domains
      const invalidDomains = formData.domains.filter(
        (d) => !isValidDomain(d.domain)
      );
      if (invalidDomains.length > 0) {
        throw new Error("Please enter valid domain names");
      }

      // Get user's current plan
      const planResponse = await authFetch(
        "http://localhost:3000/api/v1/plans/my-plan"
      );
      const planResult = await planResponse.json();

      if (!planResponse.ok) {
        throw new Error(planResult.error || "Failed to fetch user plan");
      }

      const planId = planResult.data.plan.id;

      // Extract main domain and SAN domains
      const mainDomain = formData.domains[0].domain;
      const sanDomains =
        formData.certificateType === "san"
          ? formData.domains.slice(1).map((d) => d.domain)
          : [];

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
            domain: mainDomain,
            sanDomains: sanDomains,
            isWildcard: mainDomain.startsWith("*."), // Check if main domain is wildcard
            certificateType: formData.certificateType,
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
            validationMethod: formData.domains[0].validationMethod,
            validityPeriod: parseInt(formData.duration),
            serverSoftware: parseInt(formData.serverSoftware),
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setShowPurchaseDialog(false);
        alert(
          "Certificate submitted successfully! Check your email for validation."
        );

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
          <CardTitle>Standard Plan - Certificate Configuration</CardTitle>
          <CardDescription>
            Configure your SSL certificate - Choose between Basic or SAN/UCC
            certificate
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
              onValueChange={(value: "basic" | "san") =>
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
                <RadioGroupItem value="san" id="san" />
                <Label htmlFor="san" className="font-normal">
                  SAN/UCC Certificate (Multiple Domains)
                </Label>
              </div>
            </RadioGroup>

            {/* Certificate Type Description */}
            <div className="mt-3 text-sm text-muted-foreground">
              {formData.certificateType === "basic" ? (
                <p>
                  Single domain certificate - Perfect for individual websites
                </p>
              ) : (
                <p>
                  SAN/UCC certificate - Secure multiple domains with one
                  certificate (up to 100 domains)
                </p>
              )}
            </div>
          </div>

          {/* Domains Configuration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>
                {formData.certificateType === "basic" ? "Domain" : "Domains"}(
                {formData.domains.length}/{maxDomains})
              </Label>
              {canAddDomain && formData.certificateType === "san" && (
                <Button variant="outline" size="sm" onClick={addDomain}>
                  Add Domain
                </Button>
              )}
            </div>

            {formData.domains.map((domainConfig, index) => (
              <div
                key={index}
                className="mb-4 p-4 border border-border rounded-lg space-y-3"
              >
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label className="mb-2 ml-1" htmlFor={`domain-${index}`}>
                      {formData.certificateType === "basic"
                        ? "Domain"
                        : `Domain ${index + 1}`}
                    </Label>
                    <Input
                      id={`domain-${index}`}
                      placeholder={
                        formData.certificateType === "basic"
                          ? "example.com"
                          : "example.com or *.example.com"
                      }
                      value={domainConfig.domain}
                      onChange={(e) =>
                        updateDomain(index, "domain", e.target.value)
                      }
                    />
                    {!isValidDomain(domainConfig.domain) &&
                      domainConfig.domain && (
                        <p className="text-xs text-destructive mt-1">
                          Please enter a valid domain
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
                    onValueChange={(value) =>
                      updateDomain(index, "validationMethod", value)
                    }
                  >
                    <SelectTrigger id={`validation-${index}`}>
                      <SelectValue placeholder="Select validation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Email Validation</SelectLabel>
                        {VALIDATION_METHODS.map((method) => (
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

                  {domainConfig.validationMethod === "email" &&
                    domainConfig.domain && (
                      <div className="mt-2">
                        <Label className="text-xs text-muted-foreground">
                          Email addresses for validation:
                        </Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {VALIDATION_METHODS.map((method) => (
                            <span
                              key={method}
                              className="text-xs bg-secondary px-2 py-1 rounded"
                            >
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
            <Label className="mb-2 ml-1" htmlFor="duration">Validity Period</Label>
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
              onChange={(e) =>
                setFormData({ ...formData, organizationName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="mb-2 ml-1" htmlFor="country">Country</Label>
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
              <Label className="mb-2 ml-1" htmlFor="state">State</Label>
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
              <Label className="mb-2 ml-1" htmlFor="city">City</Label>
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
        isBasicPlan={true}
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
