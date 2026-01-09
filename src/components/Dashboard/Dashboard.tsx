

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import DashboardLayout from "@/components/Dashboard/Layout/DashboardLayout"
import { RiDashboard2Line } from "react-icons/ri"
import { GrCertificate } from "react-icons/gr"
import { MdOutlineShoppingCart } from "react-icons/md"
import { IoSettingsOutline } from "react-icons/io5"

export default function DashboardPage() {
  const [currentSection, setCurrentSection] = useState<"plan" | "certificates" | "buy" | "settings">("plan")

  const navItems = [
    { id: "plan", label: "Your plan", icon: <RiDashboard2Line style={{ height: "1.5rem", width: "1.75rem" }} /> },
    { id: "certificates", label: "Certificates", icon: <GrCertificate style={{ height: "1.5rem", width: "1.75rem" }} /> },
    { id: "buy", label: "Buy certificate", icon: <MdOutlineShoppingCart style={{ height: "1.5rem", width: "1.75rem" }} /> },
    { id: "settings", label: "Settings", icon: <IoSettingsOutline style={{ height: "1.5rem", width: "1.5rem" }} /> },
  ]

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-7 py-4">

          {/* Logo and Dashboard Text */}
          <div className="flex items-center gap-3">
            <div className="relative w-15 h-15 rounded-full overflow-hidden bg-black flex items-center justify-center">
               <img src="/img/logo.png" alt="Logo" className="w-32 h-8 object-contain" />
            </div>
            <h1 className="text-2xl font-semibold ml-3">Dashboard</h1>
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center mr-3">
            <Button
              className="text-white bg-red-500 hover:shadow-[0_0_10px_rgba(239,68,68,0.7)] hover:bg-red-600 hover:scale-105 transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card border-border">
                <div className="flex items-center gap-3 mb-6 pt-4">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center">
                    <img src="/img/logo.png" alt="Logo" className="w-32 h-8 object-contain" />
                  </div>
                  <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={currentSection === item.id ? "default" : "ghost"}
                      className={`justify-start ${currentSection === item.id ? 'bg-primary hover:bg-primary/90' : ''}`}
                      onClick={() => setCurrentSection(item.id as any)}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Button>
                  ))}
                  <Button
                    variant="ghost"
                    className="justify-start text-destructive hover:text-destructive mt-auto"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex">

        {/* Sidebar Navigation */}
        <aside className="hidden md:flex md:w-64 border-r border-border flex-col bg-card min-h-[calc(100vh-73px)]">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-medium text-zinc-300">Navigation</h2>
          </div>
          <nav className="flex flex-col gap-1 p-3">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentSection === item.id ? "default" : "ghost"}
                className={`justify-start h-13 px-3 text-[1rem] ${currentSection === item.id ? 'bg-[#09402D] hover:bg-[#073928]' : 'hover:bg-accent'}`}
                onClick={() => setCurrentSection(item.id as any)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <DashboardLayout section={currentSection} />
        </main>
      </div>
    </div>
  )
}