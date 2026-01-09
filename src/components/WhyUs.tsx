"use client"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CheckCircle, Cpu, Database, DollarSign, Eye, Lock, Network, Zap } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const WhyUs = () => {


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
    <section id="why-us" className="relative py-20 px-6 lg:px-8 bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#0E5D16 1px, transparent 1px), linear-gradient(90deg, #0E5D16 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        ></div>

        <div className="absolute top-20 left-10 w-2 h-2 bg-[#0c5d14] rounded-full animate-float"></div>
        <div
          className="absolute top-40 right-20 w-1 h-1 bg-[#0c5d14] rounded-full animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-[#0c5d14] rounded-full animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 mb-6">
            <Cpu className="h-4 w-4 text-[#0c5d14]" />
            <span className="text-sm font-semibold text-[#0c5d14]">THE ADVANTAGE</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Why{" "}
            <span className="text-transparent bg-clip-text bg-[#0c5d14]">
              PKIChain
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Revolutionizing PKI with blockchain technology to deliver{" "}
            <span >unbreakable security</span> and{" "}
            <span >decentralized trust</span>.
          </p>
        </div>

        {/* Reasons Grid */}
        <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-xl border border-white/10 bg-linear-to-br from-white/10 to-black transition-all duration-500 cursor-pointer shadow-[0_0_30px_-5px_#126e84] shadow-[#126e84]/15
              "
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="shrink-0">
                  <div className="p-3 rounded-lg border border-[#126e84]/30 text-[#126e84] group-hover:border-[#126e84] group-hover:text-[#126e84]
                  group-hover:shadow-[#126e84]/20 transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:translate-x-1 group-hover:rotate-8">
                    {reason.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300">
                    {reason.title}
                  </h3>
                  <div className="inline-block px-3 py-1 rounded-full bg-[#126e84]/10 border border-[#126e84]/20">
                    <span className="text-xs font-semibold text-[#126e84] flex items-center justify-center">{reason.highlight}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 leading-relaxed mb-6 text-sm">{reason.description}</p>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 group-hover:border-[#126e84]/30 transition-colors duration-300">
                <span className="text-xs text-gray-500 group-hover:text-[#126e84] transition-colors duration-300">
                  Benefit #{index + 1}
                </span>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-[#126e84] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>

        
            </div>
          ))}
        </div>

        {/* Bottom Stats */}

        {/* <div
          
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/10 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0c5d14] mb-2">100%</div>
            <div className="text-sm text-gray-400 font-medium">Uptime SLA</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0c5d14] mb-2">256-bit</div>
            <div className="text-sm text-gray-400 font-medium">Encryption</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0c5d14] mb-2">50K+</div>
            <div className="text-sm text-gray-400 font-medium">Domains Secured</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#0c5d14] mb-2">99.9%</div>
            <div className="text-sm text-gray-400 font-medium">Accuracy</div>
          </div>
        </div> */}
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
