
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react"
import { Globe, Shield, Zap } from "lucide-react"

const AboutUs = () => {
  const [counts, setCounts] = useState<number[]>([])
  let hasAnimated = false;
  const [isVisible, setIsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const stats = [
    { number: "50K+", label: "Domains Secured" },
    { number: "99.9%", label: "Uptime Record" },
    { number: "128ms", label: "Avg Response Time" },
    { number: "150+", label: "Countries Served" },
  ]

  // Parse string numbers to numeric values
  const parseNumber = (value: string) => {
    let cleanValue = value.replace(/[+,]/g, '')
    if (cleanValue.includes('K')) {
      return parseFloat(cleanValue.replace('K', '')) * 1000
    } else if (cleanValue.includes('M')) {
      return parseFloat(cleanValue.replace('M', '')) * 1000000
    }
    return parseInt(cleanValue, 10) || 0
  }

  // Get suffix from original value
  const getSuffix = (originalValue: string) => {
    if (originalValue.includes('%')) return '%'
    if (originalValue.includes('ms')) return 'ms'
    if (originalValue.includes('+')) return '+'
    if (originalValue.includes('K')) return 'K'
    if (originalValue.includes('M')) return 'M'
    return ''
  }

  // Format number back to display format
  const formatNumber = (value: number, originalValue: string) => {
    const suffix = getSuffix(originalValue)
    
    if (originalValue.includes('K')) {
      return (value / 1000).toFixed(1).replace('.0', '') + suffix
    } else if (originalValue.includes('M')) {
      return (value / 1000000).toFixed(1).replace('.0', '') + suffix
    } else if (originalValue.includes('+')) {
      return Math.floor(value).toLocaleString() + suffix
    }
    
    // For % and ms - show integer during animation
    if (originalValue.includes('%') || originalValue.includes('ms')) {
      return Math.floor(value) + suffix
    }
    return Math.floor(value).toString() + suffix
  }

  // Initialize with target values (not 0)
  useEffect(() => {
    const initialValues = stats.map(stat => parseNumber(stat.number))
    setCounts(initialValues)
  }, [])

  // Start counting animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true)
            
            // Small delay before starting animation for fade effect
            setTimeout(() => {
              hasAnimated = true;
              
              // Reset to 0 for animation
              setCounts([0, 0, 0, 0])
              
              // Animate each stat with staggered delay
              stats.forEach((stat, index) => {
                const targetValue = parseNumber(stat.number)
                const duration = 2000
                let current = 0

                setTimeout(() => {
                  const startTime = Date.now()
                  
                  const animate = () => {
                    const elapsed = Date.now() - startTime
                    const progress = Math.min(elapsed / duration, 1)
                    
                    // Easing function for smooth animation
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
                    current = targetValue * easeOutQuart
                    
                    setCounts(prev => {
                      const newCounts = [...prev]
                      newCounts[index] = Math.floor(current)
                      return newCounts
                    })
                    
                    if (progress < 1) {
                      requestAnimationFrame(animate)
                    } else {
                      // Ensure final value is exact
                      setCounts(prev => {
                        const newCounts = [...prev]
                        newCounts[index] = targetValue
                        return newCounts
                      })
                    }
                  }
                  
                  animate()
                }, index * 300) // Stagger by 300ms
              })
            }, 300) // Small delay for fade effect
          }
        })
      },
      { threshold: 0.3, rootMargin: "50px" }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current)
      }
    }
  }, [hasAnimated])

  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Blockchain Domain Validation",
      description:
        "PKIChain employs a consensus mechanism of blockchain technology to verify domain ownership, ensuring only legitimate domains are issued certificates with immutable trust.",
      stats: "99.9% Accuracy",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Lightning Fast Verification",
      description:
        "Our optimized blockchain architecture enables near-instant verification processes without compromising security or decentralization principles.",
      stats: "< 2s Average",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Global Scalability",
      description:
        "Built on a distributed network that scales effortlessly across borders, supporting millions of verifications simultaneously with consistent performance.",
      stats: "10M+ Daily",
    },
  ]

  return (
    <section id="about-us" className="relative py-20 px-6 lg:px-8 bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-green-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-100 mb-6">
            About{" "}
            <span className="text-transparent bg-clip-text bg-[#0c5d14]">Us</span>
          </h2>
          <p className="text-xl text-gray-300 lg:text-2xl max-w-4xl mx-auto leading-relaxed">
            We are pioneers in blockchain-based digital verification solutions. Our mission is to revolutionize identity
            management through secure, efficient, and scalable technologies.
          </p>
        </div>

        {/* Stats Grid - ref added here to trigger animation when scrolled into view */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300"
            >
              <div 
                className={`text-2xl lg:text-3xl font-bold text-[#0c5d14] mb-2 transition-all duration-500 ${
                  !isVisible ? 'opacity-0' : hasAnimated && counts[index] === 0 ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {formatNumber(counts[index] || parseNumber(stat.number), stat.number)}
              </div>
              <div className="text-sm lg:text-base text-zinc-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border bg-black border-white/10 transition-all duration-500 cursor-pointer shadow-[0_0_30px_-5px_#126e84] shadow-[#126e84]/20"
            >
              <div className="absolute inset-0 bg-[#126e84]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="absolute inset-0 rounded-lg group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0.5 rounded-lg bg-black"></div>
              </div>

              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-[#126e84] text-white shadow-lg group-hover:shadow-[#126e84]/20 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:translate-x-1 group-hover:rotate-9">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-zinc-100">
                    {feature.title}
                  </CardTitle>
                </div>
                <CardDescription className="text-zinc-400 text-lg font-medium">{feature.stats}</CardDescription>
              </CardHeader>

              <CardContent className="relative z-10 pb-6">
                <p className="text-zinc-300 leading-relaxed text-base">{feature.description}</p>
              </CardContent>

              <CardFooter className="relative z-10 pt-4 border-t border-white/10 group-hover:border-[#126e84]/20 transition-colors duration-300">
                <div className="flex items-center justify-between w-full">
                  
                  <span className="text-[15px] text-zinc-400 transition-colors duration-400 inline-flex items-center">
                    Learn more
                    <span className="ml-2 text-[15px] text-zinc-400 transition-all duration-400 group-hover:translate-x-2">
                      →
                    </span>
                  </span>
                  <div className="w-2 h-2 bg-[#236c2b] rounded-full transition-transform duration-300"></div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-5 rounded-2xl bg-linear-to-r from-emerald-500/10 to-green-600/10 backdrop-blur-sm border border-emerald-500/20">
            <div className="text-left">
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Ready to Secure Your Digital Identity?</h3>
              <p className="text-zinc-400 text-[15px]">
                Join thousands of organizations trusting PKIChain for their domain validation needs.
              </p>
            </div>
            <button className="px-7 py-3 bg-[#0c5d14] text-white rounded-xl font-semibold shadow-lg hover:shadow-emerald-500/15 hover:scale-105 transition-all duration-200 whitespace-nowrap">
              Start Free Plan Today
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUs