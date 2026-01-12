

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Eye, EyeOff, Mail, Lock, User, Shield, ArrowRight, Loader2 } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import axios from 'axios'
import { useNavigate } from "react-router-dom"

gsap.registerPlugin(ScrollTrigger)

const Authenticate = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const navigate = useNavigate()
  const leftColRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const orbsRef = useRef<HTMLDivElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear error when user starts typing
    if (error) setError("")
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return false
    }

    if (!isLogin) {
      if (!formData.name) {
        setError("Name is required")
        return false
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return false
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)

    // Validate Form
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError("")

    try {
      let response
      const apiUrl = 'http://localhost:3000/api/v1/auth' 

      if (isLogin) {
        response = await axios.post(`${apiUrl}/login`, {
          email: formData.email,
          password: formData.password
        })
      } else {
        response = await axios.post(`${apiUrl}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      }

      if (response.data.success) {
        console.log(isLogin ? "Login successful:" : "Register successful:", response.data)

        // Save token and user info into localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        setError("") 

        // Redirect to dashboard 
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)

      } else {
        setError(response.data.error || "Authentication failed")
      }
    } catch (error: any) {
      console.error("Error submitting form:", error.response?.data || error.message)

      // Handle different types of errors
      if (error.response?.data?.error) {
        setError(error.response.data.error)
      } else if (error.code === 'NETWORK_ERROR') {
        setError("Network error. Please check your connection.")
      } else if (error.code === 'ECONNREFUSED') {
        setError("Cannot connect to server. Please try again later.")
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Reset Form when switching between login/register
  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setError("")
  }, [isLogin])

  useEffect(() => {
    const tl = gsap.timeline()

    // Animate left column content
    const leftColElements = leftColRef.current?.querySelectorAll("[data-animate]")
    if (leftColElements && leftColElements.length > 0) {
      tl.fromTo(
        leftColElements,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" },
        0,
      )
    }

    // Animate form
    tl.fromTo(formRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" }, 0.2)

    // Parallax effect on background orbs
    const orbAuth1 = orbsRef.current?.querySelector(".orb-auth-1")
    if (orbAuth1) {
      gsap.to(orbAuth1, {
        y: 20,
        x: 15,
        ease: "none",
        scrollTrigger: {
          trigger: orbsRef.current,
          scrub: 2,
        },
      })
    }

    const orbAuth2 = orbsRef.current?.querySelector(".orb-auth-2")
    if (orbAuth2) {
      gsap.to(orbAuth2, {
        y: -30,
        x: -20,
        ease: "none",
        scrollTrigger: {
          trigger: orbsRef.current,
          scrub: 2.5,
        },
      })
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isLogin])

  return (
    <div className="min-h-screen bg-background flex">

      {/* Left Column , Image/Graphics */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        {/* Background Pattern */}
        <div ref={orbsRef} className="absolute inset-0 bg-linear-to-br from-primary2/20 to-background">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><pattern id='circuit' width='25' height='25' patternUnits='userSpaceOnUse'><circle cx='12.5' cy='12.5' r='1.5' fill='%230E5D16'/><path d='M 12.5 0 L 12.5 25 M 0 12.5 L 25 12.5' stroke='%230E5D16' strokeWidth='0.5' fill='none'/></pattern></defs><rect width='100' height='100' fill='url(%23circuit)'/></svg>")`,
              backgroundSize: "50px 50px",
            }}
          ></div>

          <div className="orb-auth-1 absolute top-20 left-20 w-40 h-40 bg-primary2/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="orb-auth-2 absolute bottom-20 right-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Content */}
        <div
          ref={leftColRef}
          className="relative z-10 flex flex-col justify-center items-center text-center px-16 w-full"
        >
          <div className="max-w-md">
            <div data-animate>
              <Shield className="h-16 w-16 text-primary2 mx-auto mb-6" />
            </div>
            <h2 data-animate className="text-4xl font-bold text-foreground mb-4">
              Secure Access to Your Digital Identity
            </h2>
            <p data-animate className="text-muted-foreground text-lg leading-relaxed">
              Join thousands of organizations trusting PKIChain for blockchain-powered domain validation and secure
              certificate management.
            </p>

            {/* Features List */}
            <div data-animate className="mt-8 space-y-4 text-left">
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary2 transition-colors duration-300">
                <div className="w-2 h-2 bg-primary2 rounded-full"></div>
                <span>Blockchain-powered security</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary2 transition-colors duration-300">
                <div className="w-2 h-2 bg-primary2 rounded-full"></div>
                <span>Military-grade encryption</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground hover:text-primary2 transition-colors duration-300">
                <div className="w-2 h-2 bg-primary2 rounded-full"></div>
                <span>24/7 Priority support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column , Authentication Form */}
      <div ref={formRef} className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <img src="/img/logo.png" alt="PKIChain" className="h-12 w-auto mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to your PKIChain account" : "Join PKIChain to secure your digital identity"}
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex bg-secondary rounded-xl p-1 mb-8 border border-border">
            <button
              onClick={() => setIsLogin(true)}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin
                  ? "bg-primary2 text-primary2-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin
                  ? "bg-primary2 text-primary2-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
              <p className="text-destructive text-sm text-center">{error}</p>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary2 focus:ring-1 focus:ring-primary2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary2 focus:ring-1 focus:ring-primary2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full pl-10 pr-12 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary2 focus:ring-1 focus:ring-primary2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-muted-foreground mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required={!isLogin}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary2 focus:ring-1 focus:ring-primary2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    disabled={isLoading}
                    className="w-4 h-4 text-primary2 bg-secondary border-border rounded focus:ring-primary2 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary2 hover:text-primary2 transition-colors duration-300">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-primary2 text-primary2-foreground rounded-xl font-semibold shadow-lg hover:shadow-primary2/25 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {isLogin && (
              <p className="text-center text-muted-foreground text-sm">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  disabled={isLoading}
                  className="text-primary2 hover:text-primary2 font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign up
                </button>
              </p>
            )}
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground text-sm">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary2 hover:text-primary2 transition-colors duration-300">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary2 hover:text-primary2 transition-colors duration-300">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Authenticate