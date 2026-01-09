"use client"

import type React from "react"

import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight, Handshake, Mail, MessageCircle, Quote } from "lucide-react"
import { useState } from "react"

gsap.registerPlugin(ScrollTrigger)

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    orgSize: "",
    industry: "",
  })



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  const contactOptions = [
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Request a Demo",
      description: "See the power of PKIchain's blockchain-based PKI solution for yourself! Request a demo.",
    },
    {
      icon: <Quote className="h-6 w-6" />,
      title: "Request a Quote",
      description:
        "Get a quote for PKIchain's secure and reliable services today! Contact us to learn about our custom PKI solutions.",
    },
    {
      icon: <Handshake className="h-6 w-6" />,
      title: "Partner with Us",
      description:
        "Our experts will work with you to design a customized system that meets your organization's unique needs.",
    },
  ]

  const industries = [
    "Banking",
    "Capital Market",
    "Enterprise Technology",
    "Manufacturer",
    "Health Care",
    "Higher Education",
  ]

 
  return (
    <section id="contact-us" className="relative py-20 px-6 lg:px-8 bg-black overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#0E5D16 1px, transparent 1px), linear-gradient(90deg, #0E5D16 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>

        <div className="absolute top-20 left-10 w-60 h-60 bg-[#0c5d14]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-green-500/5 rounded-full blur-3xl"></div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1/2 h-full hidden lg:block">
          <div
            className="w-full h-full opacity-10"
            style={{
              backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="%230E5D16" strokeWidth="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>')`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div  className="text-center mb-16 ">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#0c5d14]/30 mb-6">
            <Mail className="h-4 w-4 text-[#0c5d14]" />
            <span className="text-sm font-semibold text-[#0c5d14]">CONTACT US</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-[#0c5d14]">Touch</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">REQUEST A QUOTE FOR A CUSTOM SOLUTION</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column */}
          <div  className="space-y-8">
            <div className="text-center lg:text-left">
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Please contact our team or complete the form below. A representative will contact you shortly.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-6">
              {contactOptions.map((option, index) => (
                <div
                  key={index}
                  className="group p-6 rounded-xl border border-white/10 bg-white/5"
                >
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 p-3 rounded-lg border bg-[#0c5d14] border-[#0c5d14]/30 text-white
                    group-hover:shadow-[#0c5d14]/20 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:translate-x-1 group-hover:rotate-9">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {option.title}
                      </h3>
                      <p className="text-gray-400 leading-relaxed">{option.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-600 shrink-0 mt-2  transition-all duration-400 group-hover:translate-x-2" />
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column - Contact Form */}
          <div className="relative ">
            <div className="relative p-9 rounded-2xl border border-white/10 bg-black">
              <div className="absolute inset-0 rounded-2xl opacity-5">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="%230E5D16"/><path d="M 10 0 L 10 20 M 0 10 L 20 10" stroke="%230E5D16" strokeWidth="0.3" fill="none"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>')`,
                    backgroundSize: "40px 40px",
                  }}
                ></div>
              </div>

              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-gray-300 mb-2">
                      Organization Name *
                    </label>
                    <input
                      type="text"
                      id="organization"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                      placeholder="Your Company Inc."
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="orgSize" className="block text-sm font-medium text-gray-300 mb-2">
                    Number of People in Organization *
                  </label>
                  <select
                    id="orgSize"
                    name="orgSize"
                    required
                    value={formData.orgSize}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                  >
                    <option value="">Select size</option>
                    <option value="1-5">1-5 people</option>
                    <option value="5-15">5-15 people</option>
                    <option value="15-25">15-25 people</option>
                    <option value="20+">20+ people</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    name="industry"
                    required
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#0c5d14] focus:ring-1 focus:ring-[#0c5d14] transition-all duration-300"
                  >
                    <option value="">Select industry</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#0c5d14] text-white rounded-xl font-semibold shadow-lg hover:cursor-pointer hover:shadow-[#0c5d14]/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Mail className="h-5 w-5" />
                  Submit Request
                </button>

                <p className="text-center text-gray-400 text-sm">We'll get back to you within 24 hours</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactUs
