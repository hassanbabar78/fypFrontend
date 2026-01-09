import { Mail, MapPin, Phone, Mailbox } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
const navigation = [
  { name: "Home", href: "#hero-section" },
  { name: "About Us", href: "#about-us" },
  { name: "Why Us", href: "#why-us" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact-us" },
];
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="relative bg-black overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: 'url("/img/map.svg")',
          backgroundSize: 'cover',
        }}
      ></div>
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 "></div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* Logo and Description */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <img 
                  src="/img/logo.png" 
                  alt="PKIChain" 
                  className="h-12 w-auto mb-4"
                />
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  Revolutionizing digital identity management with blockchain-powered 
                  domain validation and secure certificate issuance.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#0c5d14]" />
                  <span className="text-gray-400">Secure Cloud Infrastructure, Global</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-[#0c5d14]" />
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mailbox className="h-5 w-5 text-[#0c5d14]" />
                  <span className="text-gray-400">contact@pkichain.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a 
                      href={item.href} 
                      className="text-gray-400 hover:text-[#0c5d14] transition-colors duration-300"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-6">Stay Updated</h3>
              <p className="text-gray-400 mb-4">
                Subscribe to our newsletter for the latest updates and security insights.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0c5d14] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#0c5d14]/25 hover:scale-105 transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>

              <p className="text-gray-500 text-xs mt-3">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} PKIChain. All rights reserved.
              </div>
              
              <div className="flex items-center gap-6 text-sm">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-[#0c5d14] transition-colors duration-300"
                >
                  Privacy Policy
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-[#0c5d14] transition-colors duration-300"
                >
                  Terms of Service
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-[#0c5d14] transition-colors duration-300"
                >
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 w-4 h-4 bg-[#0c5d14]/20 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 right-1/4 w-2 h-2 bg-[#0c5d14]/20 rounded-full animate-pulse delay-500"></div>
    </footer>
  );
};

export default Footer;