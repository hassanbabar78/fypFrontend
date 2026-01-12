
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Check, Crown, Database, Globe, Server, Shield, Star, Zap } from "lucide-react"
import { useState } from "react"
import useTheme from "@/store/ThemeSwitch"

gsap.registerPlugin(ScrollTrigger)

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly")

  const { theme } = useTheme();
  const plans = {
    monthly: [
      {
        name: "Free",
        description: "Want to try Blockchain based domain validated certificate",
        oneLiner: "1 free certificate per user",
        price: "$0",
        period: "/month",
        originalPrice: null,
        popular: false,
        features: [
          { icon: <Shield className="h-4 w-4" />, text: "90-Day Certificate" },
          { icon: <Database className="h-4 w-4" />, text: "1 Blockchain-based DV Cert" },
          { icon: <Globe className="h-4 w-4" />, text: "ACME Certificates" },
          { icon: <Server className="h-4 w-4" />, text: "Customer Support" },
        ],
        buttonText: "Get Started Free",
        buttonVariant: "outline",
      },
      {
        name: "Basic",
        description: "Best for business and organizational websites",
        oneLiner: "3 certificates per user",
        price: "$10",
        period: "/month",
        originalPrice: null,
        popular: true,
        features: [
          { icon: <Shield className="h-4 w-4" />, text: "90-Day Certificate" },
          { icon: <Database className="h-4 w-4" />, text: "3 Blockchain DV Certificate" },
          { icon: <Globe className="h-4 w-4" />, text: "ACME Certificates" },
          { icon: <Zap className="h-4 w-4" />, text: "Technical Support" },
          { icon: <Server className="h-4 w-4" />, text: "Priority Customer Support 24/7" },
        ],
        buttonText: "Start Basic Plan",
        buttonVariant: "primary2",
      },
      {
        name: "Enterprise",
        description: "A fully comprehensive plan for any business size or needs.",
        oneLiner: "Tailored to your needs",
        price: "Custom",
        period: "",
        originalPrice: null,
        popular: false,
        features: [
          { icon: <Shield className="h-4 w-4" />, text: "1-Year Certificates" },
          { icon: <Database className="h-4 w-4" />, text: "Blockchain-based DV" },
          { icon: <Globe className="h-4 w-4" />, text: "Multi-Domain Certs" },
          { icon: <Crown className="h-4 w-4" />, text: "1-Year Wildcards" },
          { icon: <Globe className="h-4 w-4" />, text: "ACME Certificates" },
          { icon: <Database className="h-4 w-4" />, text: "REST API Access" },
          { icon: <Zap className="h-4 w-4" />, text: "Technical Support" },
          { icon: <Server className="h-4 w-4" />, text: "CA Reporting" },
          { icon: <Zap className="h-4 w-4" />, text: "Technical Support" },
          { icon: <Server className="h-4 w-4" />, text: "Priority Customer Support 24/7" },
        ],
        buttonText: "Contact Sales",
        buttonVariant: "enterprise",
      },
    ],
    yearly: [
      {
        name: "Free",
        description: "Want to try Blockchain based domain validated certificate",
        oneLiner: "1 free certificate per user",
        price: "$0",
        period: "/year",
        originalPrice: "$0",
        popular: false,
        features: [
          { icon: <Shield className="h-4 w-4" />, text: "90-Day Certificate" },
          { icon: <Database className="h-4 w-4" />, text: "1 Blockchain-based DV Cert" },
          { icon: <Globe className="h-4 w-4" />, text: "ACME Certificates" },
          { icon: <Server className="h-4 w-4" />, text: "Customer Support" },
        ],
        buttonText: "Get Started Free",
        buttonVariant: "outline",
      },
      {
        name: "Basic",
        description: "Best for business and organizational websites",
        oneLiner: "3 certificates per user",
        price: "$96",
        period: "/year",
        originalPrice: "$120",
        popular: true,
        features: [
          { icon: <Shield className="h-4 w-4" />, text: "90-Day Certificate" },
          { icon: <Database className="h-4 w-4" />, text: "3 Blockchain DV Certificate" },
          { icon: <Globe className="h-4 w-4" />, text: "ACME Certificates" },
          { icon: <Zap className="h-4 w-4" />, text: "Technical Support" },
          { icon: <Server className="h-4 w-4" />, text: "Priority Customer Support 24/7" },
        ],
        buttonText: "Start Basic Plan",
        buttonVariant: "primary2",
      },
      {
        name: "Enterprise",
        description: "A fully comprehensive plan for any business size or needs.",
        oneLiner: "Tailored to your needs",
        price: "Custom",
        period: "",
        originalPrice: null,
        popular: false,
        features: [
          { icon: <Shield className="h-4 w-4" />, text: "1-Year Certificates" },
          { icon: <Database className="h-4 w-4" />, text: "Blockchain-based DV" },
          { icon: <Globe className="h-4 w-4" />, text: "Multi-Domain Certs" },
          { icon: <Crown className="h-4 w-4" />, text: "1-Year Wildcards" },
          { icon: <Globe className="h-4 w-4" />, text: "ACME Certificates" },
          { icon: <Database className="h-4 w-4" />, text: "REST API Access" },
          { icon: <Zap className="h-4 w-4" />, text: "Technical Support" },
          { icon: <Server className="h-4 w-4" />, text: "CA Reporting" },
          { icon: <Zap className="h-4 w-4" />, text: "Technical Support" },
          { icon: <Server className="h-4 w-4" />, text: "Priority Customer Support 24/7" },
        ],
        buttonText: "Contact Sales",
        buttonVariant: "enterprise",
      },
    ],
  }

  const currentPlans = plans[billingCycle]



  return (
    <section id="pricing" className="relative py-20 px-6 lg:px-8 bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-primary2/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary2/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary2/30 mb-6">
            <Crown className="h-4 w-4 text-primary2" />
            <span className="text-sm font-semibold text-primary2">PRICING</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Simple,{" "}
            <span className="text-transparent bg-clip-text bg-primary2">
              Transparent
            </span>{" "}
            Pricing
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your security needs. All plans include blockchain-powered domain validation.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-secondary rounded-xl p-1 border border-border">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${billingCycle === "monthly" ? "bg-primary2 text-primary2-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 relative ${billingCycle === "yearly" ? "bg-primary2 text-primary2-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 px-2 py-1 bg-primary2 text-primary2-foreground text-xs rounded-full">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 sm:-top-5 md:-top-6">
                  <div className="
                bg-primary2 text-primary2-foreground 
                px-4 py-1.5 
                sm:px-5 sm:py-2 
                md:px-6 md:py-2.5 
                rounded-full 
                text-xs sm:text-sm md:text-base 
                font-semibold 
                shadow-lg 
                flex items-center gap-1.5 sm:gap-2
              ">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />
                    <span>Most Popular</span>
                  </div>
                </div>

              )}

              <div
                className={`relative h-full rounded-2xl border-2 ${
                  theme === 'light' 
                    ? 'border-border/60 bg-card' 
                    : 'border-white/30 bg-linear-to-br from-white/10 to-black'
                }`}
              >
                <div className="p-8 h-full flex flex-col">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="text-primary2 font-semibold text-lg">{plan.oneLiner}</div>
                  </div>

                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl lg:text-5xl font-bold text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground text-lg">{plan.period}</span>}
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <span className="text-muted-foreground line-through text-lg">{plan.originalPrice}</span>
                        <span className="text-primary2 text-sm font-semibold bg-primary2/10 px-2 py-1 rounded">
                          20% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 mb-8">
                    <div className="space-y-4">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <div className="shrink-0 w-5 h-5 mt-0.5">
                            <Check className="h-5 w-5 text-primary2" />
                          </div>
                          <span className="text-muted-foreground text-sm">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 cursor-pointer ${plan.buttonVariant === "primary2"
                        ? "bg-primary2 text-primary2-foreground hover:bg-primary2/90"
                        : plan.buttonVariant === "enterprise"
                          ? "bg-secondary text-foreground border border-border hover:border-foreground/20 hover:bg-secondary/80"
                          : "bg-secondary text-foreground border border-border hover:border-foreground/20 hover:bg-secondary/80"
                      }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            All plans include 256-bit encryption • 99.9% uptime SLA • No hidden fees
          </p>
        </div>
      </div>
    </section>
  )
}

export default Pricing
