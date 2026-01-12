

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { authFetch } from "@/lib/auth-fetch"

interface Certificate {
  _id: string
  domain: string
  sslOrderRef: string
  status: "draft" | "pending_validation" | "validating" | "issued" | "failed" | "cancelled"
  expiryDate: string
  issuedDate?: string
  certificateType: "basic" | "san" | "wildcard"
  validityPeriod: number
  validationMethod: string
  organizationName: string
  createdAt: string
  plan: {
    planType: string
  }
  sslResponse?: any
  validationInfo?: any
  sanDomains?: string[]
}

interface CertificateDetailsDialogProps {
  certificate: Certificate
  open: boolean
  onOpenChange: (open: boolean) => void
  onRefresh?: () => void
}

export default function CertificateDetailsDialog({ 
  certificate, 
  open, 
  onOpenChange,
  onRefresh 
}: CertificateDetailsDialogProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "issued":
        return <Badge className="bg-primary hover:bg-primary/90">Issued</Badge>
      case "pending_validation":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Pending Validation</Badge>
      case "validating":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Validating</Badge>
      case "draft":
        return <Badge className="bg-gray-600 hover:bg-gray-700">Draft</Badge>
      case "failed":
        return <Badge className="bg-destructive hover:bg-destructive/90">Failed</Badge>
      case "cancelled":
        return <Badge className="bg-gray-400 hover:bg-gray-500">Cancelled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getCertificateTypeLabel = (type: string) => {
    switch (type) {
      case "basic": return "Basic SSL"
      case "san": return "SAN/UCC SSL"
      case "wildcard": return "Wildcard SSL"
      default: return type
    }
  }

  const getValidationMethodLabel = (method: string) => {
    if (method.includes('@')) return "Email Validation"
    if (method === 'cname_csr_hash') return "DNS (CNAME) Validation"
    if (method === 'http_csr_hash') return "HTTP File Validation"
    if (method === 'https_csr_hash') return "HTTPS File Validation"
    return method
  }

  const handleRefreshStatus = async () => {
    try {
      const response = await authFetch(`http://localhost:3000/api/v1/certificates/status/${certificate._id}`)
      const result = await response.json()
      
      if (result.success) {
        alert("Status refreshed successfully!")
        onRefresh?.()
      } else {
        alert(`Failed to refresh status: ${result.error}`)
      }
    } catch (err) {
      alert("Failed to refresh status")
    }
  }

  const handleCancelCertificate = async () => {
    if (!confirm("Are you sure you want to cancel this certificate? This action cannot be undone.")) {
      return
    }

    try {
      const response = await authFetch(`http://localhost:3000/api/v1/certificates/cancel/${certificate._id}`, {
        method: "POST"
      })
      const result = await response.json()

      if (result.success) {
        alert("Certificate cancelled successfully!")
        onRefresh?.()
        onOpenChange(false)
      } else {
        alert(`Failed to cancel certificate: ${result.error}`)
      }
    } catch (err) {
      alert("Failed to cancel certificate")
    }
  }

  const handleDownloadCertificate = () => {
    // TODO: Implement certificate download functionality
    alert("Download functionality will be implemented soon!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle>Certificate Details</DialogTitle>
          <DialogDescription>
            Complete information about your SSL certificate
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          
          {/* Domain & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Domain</p>
              <p className="font-semibold">{certificate.domain}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Certificate Type</p>
              <p className="font-semibold">{getCertificateTypeLabel(certificate.certificateType)}</p>
            </div>
          </div>

          {/* Reference & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">SSL.com Reference</p>
              <p className="font-mono text-sm">{certificate.sslOrderRef || "Not submitted"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <div>{getStatusBadge(certificate.status)}</div>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Created</p>
              <p className="font-semibold">{formatDate(certificate.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {certificate.status === "issued" ? "Expires" : "Validity Period"}
              </p>
              <p className="font-semibold">
                {certificate.status === "issued" 
                  ? formatDate(certificate.expiryDate)
                  : `${certificate.validityPeriod} days`
                }
              </p>
            </div>
          </div>

          {/* Organization & Validation */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Organization</p>
              <p className="font-semibold">{certificate.organizationName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Validation Method</p>
              <p className="font-semibold">{getValidationMethodLabel(certificate.validationMethod)}</p>
            </div>
          </div>

          {/* SAN Domains (if applicable) */}
          {certificate.certificateType === "san" && certificate.sanDomains && certificate.sanDomains.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">SAN Domains</p>
              <div className="space-y-1">
                {certificate.sanDomains.map((domain, index) => (
                  <div key={index} className="text-sm bg-secondary px-2 py-1 rounded">
                    {domain}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plan Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">Plan</p>
            <Badge variant="outline" className="capitalize border-primary/50">
              {certificate.plan.planType}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 ">
              Close
            </Button>
            
            {certificate.status === "issued" && (
              <Button onClick={handleDownloadCertificate} className="flex-1 bg-button hover:bg-button-hover">
                Download Certificate
              </Button>
            )}
            
            {!["issued", "cancelled"].includes(certificate.status) && (
              <>
                <Button className=""
                  variant="outline" 
                  onClick={handleRefreshStatus}
                  disabled={certificate.status === "draft"}
                >
                  Refresh
                </Button>
                <Button  className=""
                  variant="destructive" 
                  onClick={handleCancelCertificate}
                >
                  Cancel
                </Button>
              </>
            )}
          </div>

          {/* Status-specific messages */}
          {certificate.status === "pending_validation" && (
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong>Action Required:</strong> Please complete the domain validation process to get your certificate issued.
              </p>
            </div>
          )}

          {certificate.status === "validating" && (
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <strong>Validation in Progress:</strong> Your domain is being validated by SSL.com. This may take a few minutes to several hours.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}