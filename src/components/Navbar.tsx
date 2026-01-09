import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "Home", href: "#hero-section" },
  { name: "About Us", href: "#about-us" },
  { name: "Why Us", href: "#why-us" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact-us" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  // Smooth scroll function for in-page navigation
  const smoothScroll = (href: string) => {
    if (href.startsWith("#")) {
      // If we're not on the landing page, navigate to home first
      if (location.pathname !== "/") {
        navigate("/");
        // Wait for navigation to complete then scroll
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            const offsetTop =
              element.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({ top: offsetTop, behavior: "smooth" });
          }
        }, 100);
      } else {
        // We're already on landing page, just scroll
        const element = document.querySelector(href);
        if (element) {
          const offsetTop =
            element.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top: offsetTop, behavior: "smooth" });
        }
      }
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleDashboard = () => {
    navigate("/dashboard");
  };
  // Handle navigation click
  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();

    if (href.startsWith("#")) {
      smoothScroll(href);
      setIsOpen(false);
    }
  };

  // Handle route navigation (for authenticate page)
  const handleRouteNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Handle logo click - go to home page
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
    } else {
      // Already on home, scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 return (
    <header className="fixed inset-x-0 top-2.5 z-50 px-4 sm:px-6">
      <nav
        className={`flex items-center justify-between p-4 mx-auto max-w-7xl rounded-2xl backdrop-blur-md border transition-all duration-300 ${
          isScrolled
            ? "bg-black shadow-2xl shadow-[#0c5d14]/10"
            : "bg-black/10 border-white/20 shadow-lg"
        }`}
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex z-10">
          <a href="/" className="p-1.5 transition-transform hover:scale-105 duration-200" onClick={handleLogoClick}>
            <img src="/img/logo.png" alt="Logo" className="w-32 h-8 object-contain" />
          </a>
        </div>

        {/* Mobile menu */}
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors duration-200">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm bg-slate-900/95 backdrop-blur-xl border-l border-white/20">
              <div className="flex flex-col h-full pt-6">
                <div className="flex items-center justify-between px-4">
                  <a href="/" className="p-1.5" onClick={handleLogoClick}>
                    <img src="/img/logo.png" alt="Logo" className="h-8" />
                  </a>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>

                <div className="flex flex-col space-y-2 mt-8 px-5">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-2xl font-medium text-white hover:text-[#0c5d14] py-3 px-4 rounded-xl hover:bg-white/10 transition-all duration-200"
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>

                <div className="mt-auto p-4 border-t border-white/10 space-y-3">
                  {user ? (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all duration-200"
                      onClick={handleDashboard}
                    >
                      Dashboard
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-[#0c5d14] hover:from-[#0c5d14] hover:to-[#0c5d14] text-white shadow-lg transition-all duration-200"
                      onClick={() => handleRouteNavigation("/authenticate")}
                    >
                      Sign Up / Sign In
                    </Button>
                  )}

                  {location.pathname === "/authenticate" && (
                    <Button
                      variant="outline"
                      className="w-full text-white border-white/20 hover:bg-white/10"
                      onClick={() => handleRouteNavigation("/")}
                    >
                      Back to Home
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Desktop navigation links */}
        {/* <div className="hidden lg:flex lg:gap-x-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-5 py-2 text-[15px] font-semibold text-white hover:text-[#18a526] rounded-xl hover:bg-white/10 transition-all duration-200"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.name}
            </a>
          ))}
        </div> */}
        <div className="hidden lg:flex lg:gap-x-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="px-5 py-2 text-[15px] font-semibold text-white relative group transition-all duration-200"
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.name}
              {/* Underline effect*/}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#18a526] group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
        </div>
        {/* Desktop Auth Button */}
        <div className="hidden lg:flex lg:gap-x-4">
          {user ? (
            <Button
              className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              onClick={handleDashboard}
            >
              Dashboard
            </Button>
          ) : (
            <Button
              className="bg-[#0c5d14] hover:from-[#0c5d14] hover:to-[#0c5d14] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              onClick={() => navigate("/authenticate")}
            >
              Sign Up / Sign In
            </Button>
          )}

          {location.pathname === "/authenticate" && (
            <Button
              variant="outline"
              className="text-white border-white/20 hover:bg-white/10"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}