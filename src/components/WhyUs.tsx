
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CheckCircle, Cpu, Database, DollarSign, Eye, Lock, Network, Zap } from "lucide-react"
import useTheme from "@/store/ThemeSwitch"

gsap.registerPlugin(ScrollTrigger)

const WhyUs = () => {


  const { theme } = useTheme()
  const reasons = [
    {
      icon: <Network className="h-8 w-8" />,
      title: "Decentralized Trust",
      description:
        "Eliminates single points of failure by distributing trust across a blockchain network, ensuring continuous operation even if nodes go offline.",
      highlight: "Zero Downtime",
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Enhanced Security",
      description:
        "Leverages blockchain's inherent cryptographic security with military-grade encryption to protect against modern cyber threats.",
      highlight: "Military-Grade",
    },
    {
      icon: <Eye className="h-8 w-8" />,
      title: "Complete Transparency",
      description:
        "Every transaction is recorded on an immutable public ledger, providing full visibility and audit capabilities for all stakeholders.",
      highlight: "Public Ledger",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Immutable Records",
      description:
        "Once recorded, certificate transactions cannot be altered or deleted, creating a permanent, tamper-proof audit trail.",
      highlight: "Tamper-Proof",
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Cost Efficiency",
      description:
        "Eliminates intermediary costs associated with traditional certificate authorities, reducing operational expenses by up to 60%.",
      highlight: "Save 60%",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Validation",
      description:
        "Automated smart contracts enable near-instant domain verification without manual intervention or waiting periods.",
      highlight: "2s Average",
    },
  ]

  return (
    <section id="why-us" className="relative py-20 px-6 lg:px-8 bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary2)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary2)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        <div className="absolute top-20 left-10 w-2 h-2 bg-primary2 rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-primary2 rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary2 rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary2/30 mb-6">
            <Cpu className="h-4 w-4 text-primary2" />
            <span className="text-sm font-semibold text-primary2">THE ADVANTAGE</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-primary2">
              PKIChain
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionizing PKI with blockchain technology to deliver{" "}
            <span >unbreakable security</span> and{" "}
            <span >decentralized trust</span>.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
               className={`group relative p-8 rounded-xl border transition-all duration-500 cursor-pointer ${
                theme === 'light'
                  ? 'border-border bg-card shadow-[0_0_30px_-5px_hsl(var(--primary-blue))] shadow-primary-blue/10'
                  : 'border-white/10 bg-linear-to-br from-white/10 to-black shadow-[0_0_30px_-5px_#126e84] shadow-[#126e84]/5'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0">
                  <div className="p-3 rounded-lg border border-[#346F84]/30 text-[#346F84] group-hover:border-[#346F84] group-hover:text-[#346F84]
                  group-hover:shadow-[#346F84]/20 transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:translate-x-1 group-hover:rotate-8">
                    {reason.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-foreground mb-2 transition-colors duration-300">
                    {reason.title}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#346F84]/10 border border-primary2/20">
                    <span className="text-xs font-semibold text-[#346F84] flex items-center justify-center">{reason.highlight}</span>
                  </div>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed mb-6 text-sm">{reason.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-border group-hover:border-[#346F84]/30 transition-colors duration-300">
                <span className="text-xs text-muted-foreground group-hover:text-[#346F84] transition-colors duration-300">
                  Benefit #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-[#346F84] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>


            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}

export default WhyUs
