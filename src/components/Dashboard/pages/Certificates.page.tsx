
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import CertificateDetailsDialog from "@/components/Dashboard/dialogs/CertificateDetails.dialog"
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
}

export default function CertificatesSection() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch certificates from API
  const fetchCertificates = async () => {
    try {
      setError(null)
      const response = await authFetch("http://localhost:3000/api/v1/certificates")
      const result = await response.json()

      if (result.success) {
        setCertificates(result.data.certificates)
      } else {
        setError(result.error || "Failed to fetch certificates")
      }
    } catch (err) {
      setError("Failed to load certificates")
      console.error("Fetch certificates error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Refresh certificate status
  const refreshCertificateStatus = async (certificateId: string) => {
    try {
      const response = await authFetch(`http://localhost:3000/api/v1/certificates/status/${certificateId}`)
      const result = await response.json()

      if (result.success && result.data.statusChanged) {
        // Update the certificate in the local state
        setCertificates(prev => prev.map(cert => 
          cert._id === certificateId 
            ? { ...cert, status: result.data.status, expiresAt: result.data.expiresAt, issuedDate: result.data.issuedDate }
            : cert
        ))
      }
      return result
    } catch (err) {
      console.error("Refresh status error:", err)
      return { success: false, error: "Failed to refresh status" }
    }
  }

  // Cancel certificate
  const cancelCertificate = async (certificateId: string) => {
    try {
      const response = await authFetch(`http://localhost:3000/api/v1/certificates/cancel/${certificateId}`, {
        method: "POST"
      })
      const result = await response.json()

      if (result.success) {
        // Remove cancelled certificate from the list or update its status
        setCertificates(prev => prev.map(cert => 
          cert._id === certificateId 
            ? { ...cert, status: "cancelled" }
            : cert
        ))
        return result
      } else {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error("Cancel certificate error:", err)
      return { success: false, error: err instanceof Error ? err.message : "Failed to cancel certificate" }
    }
  }

  useEffect(() => {
    fetchCertificates()
  }, [])

  const handleRowClick = (cert: Certificate) => {
    setSelectedCert(cert)
    setShowDetailsDialog(true)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchCertificates()
  }

  const handleRefreshStatus = async (certificateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await refreshCertificateStatus(certificateId)
  }

  const handleCancelCertificate = async (certificateId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to cancel this certificate? This action cannot be undone.")) {
      await cancelCertificate(certificateId)
    }
  }

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
      case "basic": return "Basic"
      case "san": return "SAN/UCC"
      case "wildcard": return "Wildcard"
      default: return type
    }
  }

  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-border"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading certificates...</p>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">Certificates</h2>
          <p className="text-muted-foreground">View and manage your purchased certificates</p>
        </div>
        <Card>
          <CardContent className="p-6">
            <Loader />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold mb-2">Certificates</h2>
          <p className="text-muted-foreground">View and manage your purchased certificates</p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Card className="shadow-green border-primary/20">
        <CardHeader>
          <CardTitle>Your Certificates</CardTitle>
          <CardDescription>
            {certificates.length} certificate(s) found. Click on any certificate to view details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-foreground">Domain</TableHead>
                  <TableHead className="text-foreground">Type</TableHead>
                  <TableHead className="text-foreground">Reference</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Expiry Date</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow 
                    key={cert._id} 
                    className="cursor-pointer hover:none border-border table-cell-hover" 
                    onClick={() => handleRowClick(cert)}
                  >
                    <TableCell className="font-medium">
                      <div>
                        {cert.domain}
                        {cert.certificateType === "wildcard" && (
                          <span className="text-xs text-primary ml-2">(Wildcard)</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell >
                      <Badge variant="outline" className="border-primary/50">
                        {getCertificateTypeLabel(cert.certificateType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground ">
                      {cert.sslOrderRef || "No Ref"}
                    </TableCell>
                    <TableCell >{getStatusBadge(cert.status)}</TableCell>
                    <TableCell >{formatDate(cert.expiryDate)}</TableCell>
                    <TableCell >
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleRefreshStatus(cert._id, e)}
                          disabled={refreshing || ["cancelled", "failed", "issued"].includes(cert.status)}
                        >
                          Refresh
                        </Button>
                        {!["issued", "cancelled"].includes(cert.status) && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => handleCancelCertificate(cert._id, e)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No certificates found</p>
              <Button className="bg-[#09402D] hover:bg-[#073928]" onClick={() => window.location.href = "/dashboard"}>
                Get Your First Certificate
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedCert && (
        <CertificateDetailsDialog
          certificate={selectedCert}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
          onRefresh={fetchCertificates}
        />
      )}
    </div>
  )
}