
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface PurchaseConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  formData: any
  onConfirm: () => void
  loading?: boolean
}

export default function PurchaseConfirmDialog({
  open,
  onOpenChange,
  formData,
  onConfirm,
  loading = false
}: PurchaseConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Get Free SSL Certificate</DialogTitle>
          <DialogDescription>
            Confirm your free SSL certificate details. This will submit your certificate to SSL.com for validation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Domain:</span>
              <p>{formData.domain}</p>
            </div>
            <div>
              <span className="font-medium">Validity:</span>
              <p>{formData.duration} days</p>
            </div>
            <div>
              <span className="font-medium">Validation:</span>
              <p>{formData.validationMethod}</p>
            </div>
            <div>
              <span className="font-medium">Organization:</span>
              <p>{formData.organizationName}</p>
            </div>
          </div>

          <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> This is a free SSL certificate with 90-day validity. 
              You will need to complete domain validation before the certificate is issued.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-[#09402D] hover:bg-[#073928]"
            >
              {loading ? "Submitting..." : "Get Free Certificate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}