
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useEffect } from "react";
import AboutUs from "./AboutUs";
import ContactUs from "./ContactUs";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import Pricing from "./Pricing";
import WhyUs from "./WhyUs";
import SponsorsMarquee from "./SponsorsMarquee";

gsap.registerPlugin(ScrollToPlugin);

const LandingPage = () => {
  useEffect(() => {
    gsap.to(window, {
      scrollTo: {
        autoKill: false,
      },
      duration: 0.5,
      ease: "power2.inOut",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      
      {/* Animated background dots */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-primary/80 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        {/* <Separator className="py-px bg-border my-3" /> */}
        <AboutUs />
        {/* <Separator className="py-px bg-border my-3" /> */}
        <WhyUs />
        {/* <Separator className="py-px bg-border my-3" /> */}
        <Pricing />
        {/* <Separator className="py-px bg-border my-3" /> */}
        <SponsorsMarquee />
        {/* <Separator className="py-px bg-border my-3" /> */}
        <ContactUs />
        {/* <Separator className="py-px bg-border my-3" /> */}
        <Footer />
      </div>
    </div>
  );
};

export default LandingPage;
