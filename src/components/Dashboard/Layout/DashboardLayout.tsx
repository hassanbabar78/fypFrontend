
import YourPlanSection from "../pages/Plans.page"
import CertificatesSection from "../pages/Certificates.page"
import BuyCertificateSection from "../pages/BuyCertificate.page"
import SettingsSection from "../pages/Settings.page"

interface DashboardLayoutProps {
  section: "plan" | "certificates" | "buy" | "settings"
}

export default function DashboardLayout({ section }: DashboardLayoutProps) {
  return (
    <div className="text-foreground">
      {section === "plan" && <YourPlanSection />}
      {section === "certificates" && <CertificatesSection />}
      {section === "buy" && <BuyCertificateSection />}
      {section === "settings" && <SettingsSection />}
    </div>
  )
}