// import { useState, useEffect, useRef } from 'react';
// import { ArrowRight, Shield, Lock, Zap, Activity, Database, Code, Globe2, Cpu, Network } from "lucide-react";

// const HeroSection = () => {
//   const [activeBlock, setActiveBlock] = useState(0);
//   const [hashValue, setHashValue] = useState('0x7a4f...c2b9');
//   const [verifications, setVerifications] = useState(10247832);
//   const [networkNodes, setNetworkNodes] = useState(247);
//   const [encryptionProgress, setEncryptionProgress] = useState(0);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const particlesRef = useRef<Array<{
//     x: number;
//     y: number;
//     vx: number;
//     vy: number;
//     size: number;
//   }>>([]);

//   // Generate random hash
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const hex = '0123456789abcdef';
//       let hash = '0x';
//       for (let i = 0; i < 4; i++) {
//         hash += hex[Math.floor(Math.random() * 16)];
//       }
//       hash += '...';
//       for (let i = 0; i < 4; i++) {
//         hash += hex[Math.floor(Math.random() * 16)];
//       }
//       setHashValue(hash);
//     }, 2500);
//     return () => clearInterval(interval);
//   }, []);

//   // Increment verifications
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setVerifications(prev => prev + Math.floor(Math.random() * 50));
//     }, 1800);
//     return () => clearInterval(interval);
//   }, []);

//   // Cycle through blocks
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveBlock(prev => (prev + 1) % 6);
//     }, 1800);
//     return () => clearInterval(interval);
//   }, []);

//   // Network nodes pulse
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setNetworkNodes(prev => prev + Math.floor(Math.random() * 3) - 1);
//     }, 3500);
//     return () => clearInterval(interval);
//   }, []);

//   // Encryption progress
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setEncryptionProgress(prev => (prev + 1) % 101);
//     }, 50);
//     return () => clearInterval(interval);
//   }, []);

//   // Canvas particle system
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
    
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
    
//     canvas.width = canvas.offsetWidth;
//     canvas.height = canvas.offsetHeight;

//     // Initialize particles
//     particlesRef.current = Array.from({ length: 60 }, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       vx: (Math.random() - 0.5) * 0.3,
//       vy: (Math.random() - 0.5) * 0.3,
//       size: Math.random() * 1.5 + 0.5
//     }));

//     let animationFrame: number;
//     const animate = () => {
//       if (!ctx) return;
//       ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       particlesRef.current.forEach((particle, i) => {
//         particle.x += particle.vx;
//         particle.y += particle.vy;

//         if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
//         if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

//         // Draw particle
//         ctx.fillStyle = 'rgba(20, 184, 87, 0.5)';
//         ctx.beginPath();
//         ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
//         ctx.fill();

//         // Draw connections
//         particlesRef.current.slice(i + 1).forEach(other => {
//           const dx = particle.x - other.x;
//           const dy = particle.y - other.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < 80) {
//             ctx.strokeStyle = `rgba(20, 184, 87, ${0.25 * (1 - distance / 80)})`;
//             ctx.lineWidth = 0.5;
//             ctx.beginPath();
//             ctx.moveTo(particle.x, particle.y);
//             ctx.lineTo(other.x, other.y);
//             ctx.stroke();
//           }
//         });
//       });

//       animationFrame = requestAnimationFrame(animate);
//     };
//     animate();

//     return () => cancelAnimationFrame(animationFrame);
//   }, []);

// const handleGetStarted = () => {
//   console.log('Navigate to authenticate');
// };

//   return (
//     <section className="relative min-h-screen mt-16 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 lg:px-20 overflow-hidden">
//       {/* Background System */}
//       <div className="absolute inset-0 bg-black">
//         <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#0a4d0f_1px,transparent_1px),linear-gradient(to_bottom,#0a4d0f_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
//         <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40" />
//         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70"></div>
//       </div>

//       {/* Spotlight */}
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#0c5d14] opacity-12 blur-[140px] rounded-full"></div>

//       <div className="relative z-10 max-w-7xl mx-auto w-full">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

//           {/* Left Content */}
//           <div className="flex flex-col space-y-6 text-center lg:text-left">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0c5d14]/10 border border-[#0c5d14]/30 rounded-full text-[#14b857] text-sm font-medium w-fit mx-auto lg:mx-0">
//               <Shield className="w-4 h-4" />
//               <span>Blockchain Security</span>
//             </div>

//             {/* Heading */}
//             <div className="space-y-4">
//               <h1 style={{ fontFamily: "'Jost', sans-serif" }} className="text-4xl font-semibold sm:text-6xl md:text-6xl lg:text-7xl font-sans text-white leading-none">
//                 PKI Chain
//               </h1>
//               <div className="h-1 w-24 bg-gradient-to-r from-[#0c5d14] to-[#14b857] mx-auto lg:mx-0"></div>
//             </div>

//             <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
//               Next-generation digital identity verification with quantum-resistant encryption and 
//               <span className="text-[#14b857] font-semibold"> zero-knowledge proofs</span>.
//             </p>

//             {/* CTA */}
//             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
//               <button
//                 className="group px-8 py-4 bg-gradient-to-r from-[#0c5d14] to-[#14b857] text-white rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 text-base shadow-lg shadow-[#0c5d14]/40 hover:shadow-xl hover:shadow-[#14b857]/40"
//                 onClick={handleGetStarted}
//               >
//                 Get Started
//                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//               </button>

//               <button className="px-8 py-4 bg-transparent border border-slate-700 text-zinc-300 rounded-lg font-bold hover:border-[#0c5d14] hover:text-white transition-all duration-300 text-base">
//                 Documentation
//               </button>
//             </div>

//             {/* Features */}
//             <div className="grid grid-cols-2 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
//               {[
//                 { icon: Lock, text: 'AES-256 Encryption' },
//                 { icon: Zap, text: '<100ms Latency' },
//                 { icon: Database, text: 'Decentralized Storage' },
//                 { icon: Activity, text: '99.99% Uptime' },
//               ].map((feature, i) => {
//                 const Icon = feature.icon;
//                 return (
//                   <div key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
//                     <Icon className="w-4 h-4 text-[#14b857] flex-shrink-0" />
//                     <span>{feature.text}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Right Visual */}
//           <div className="hidden lg:flex justify-center items-center">
//             <div className="relative w-full max-w-lg h-[500px]">
//               {/* Central Node */}
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
//                 <div className="relative">
//                   <div className="w-24 h-24 bg-gradient-to-br from-[#0c5d14] to-[#14b857] rounded-xl rotate-45 flex items-center justify-center shadow-xl shadow-[#0c5d14]/50">
//                     <div className="w-20 h-20 bg-black rounded-xl -rotate-45 flex items-center justify-center">
//                       <Shield className="w-10 h-10 text-[#14b857]" />
//                     </div>
//                   </div>
//                   <div className="absolute inset-0 border-2 border-[#14b857] rounded-xl rotate-45 animate-ping"></div>
//                 </div>
//               </div>

//               {/* Surrounding Nodes */}
//               {[
//                 { x: '50%', y: '10%', label: 'Block 1', active: activeBlock === 0 },
//                 { x: '85%', y: '30%', label: 'Block 2', active: activeBlock === 1 },
//                 { x: '85%', y: '70%', label: 'Block 3', active: activeBlock === 2 },
//                 { x: '50%', y: '90%', label: 'Block 4', active: activeBlock === 3 },
//                 { x: '15%', y: '70%', label: 'Block 5', active: activeBlock === 4 },
//                 { x: '15%', y: '30%', label: 'Block 6', active: activeBlock === 5 },
//               ].map((node, i) => (
//                 <div
//                   key={i}
//                   className="absolute"
//                   style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
//                 >
//                   <div className={`w-16 h-16 bg-gradient-to-br from-[#0c5d14] to-[#14b857] rounded-lg flex items-center justify-center shadow-lg transition-all duration-500 ${node.active ? 'scale-110 shadow-[#14b857]/60' : 'opacity-70'}`}>
//                     <div className="text-white text-xs font-bold">{node.label}</div>
//                   </div>
//                 </div>
//               ))}

//               {/* Connecting Lines */}
//               <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
//                 <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="#0c5d14" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
//                 <line x1="85%" y1="30%" x2="50%" y2="50%" stroke="#0c5d14" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
//                 <line x1="85%" y1="70%" x2="50%" y2="50%" stroke="#0c5d14" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
//                 <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="#0c5d14" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
//                 <line x1="15%" y1="70%" x2="50%" y2="50%" stroke="#0c5d14" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
//                 <line x1="15%" y1="30%" x2="50%" y2="50%" stroke="#0c5d14" strokeWidth="2" strokeDasharray="5,5" opacity="0.6" />
//               </svg>

//               {/* Info Panels */}
//               <div className="absolute top-4 right-4 bg-black/90 border border-[#0c5d14]/40 rounded-lg px-4 py-3 backdrop-blur">
//                 <div className="flex items-center gap-2 mb-2">
//                   <div className="w-2 h-2 bg-[#14b857] rounded-full animate-pulse"></div>
//                   <span className="text-white text-sm font-bold">Active</span>
//                 </div>
//                 <div className="text-zinc-400 text-xs">Nodes: <span className="text-[#14b857]">{networkNodes}</span></div>
//               </div>

//               <div className="absolute bottom-4 left-4 bg-black/90 border border-[#0c5d14]/40 rounded-lg px-4 py-3 backdrop-blur">
//                 <div className="text-zinc-400 text-xs mb-1">Block Hash</div>
//                 <div className="text-[#14b857] text-xs font-mono">{hashValue}</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="mt-16 grid grid-cols-3 gap-6 max-w-3xl mx-auto">
//           <div className="text-center">
//             <div className="text-3xl sm:text-4xl font-black text-white mb-1">99.99%</div>
//             <div className="text-zinc-500 text-sm">Uptime</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl sm:text-4xl font-black text-white mb-1">{(verifications / 1000000).toFixed(1)}M+</div>
//             <div className="text-zinc-500 text-sm">Verifications</div>
//           </div>
//           <div className="text-center">
//             <div className="text-3xl sm:text-4xl font-black text-white mb-1">256-bit</div>
//             <div className="text-zinc-500 text-sm">Encryption</div>
//           </div>
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-[#0c5d14] rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-[#0c5d14] rounded-full mt-2"></div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;



// NEW CODE 

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  Shield,
  Lock,
  Zap,
  Activity,
  Database,
} from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  const [activeBlock, setActiveBlock] = useState(0);
  const [hashValue, setHashValue] = useState("0x7a4f...c2b9");
  const [verifications, setVerifications] = useState(10247832);
  const [networkNodes, setNetworkNodes] = useState(247);
  const [showIframe, setShowIframe] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<
    { x: number; y: number; vx: number; vy: number; size: number }[]
  >([]);
  const handleGetStarted = () => {
    console.log('Navigate to authenticate');
  };

  /* ---------------- HASH ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      const hex = "0123456789abcdef";
      let hash = "0x";
      for (let i = 0; i < 4; i++) hash += hex[Math.floor(Math.random() * 16)];
      hash += "...";
      for (let i = 0; i < 4; i++) hash += hex[Math.floor(Math.random() * 16)];
      setHashValue(hash);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  /* ---------------- COUNTERS ---------------- */
  useEffect(() => {
    const i = setInterval(
      () => setVerifications((p) => p + Math.floor(Math.random() * 50)),
      1800
    );
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setActiveBlock((p) => (p + 1) % 6), 1800);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(
      () => setNetworkNodes((p) => p + Math.floor(Math.random() * 3) - 1),
      3500
    );
    return () => clearInterval(i);
  }, []);

  /* ---------------- CANVAS PARTICLES ---------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    particlesRef.current = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
    }));

    let frame: number;
    const animate = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = "rgba(20,184,87,0.5)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        particlesRef.current.slice(i + 1).forEach((o) => {
          const d = Math.hypot(p.x - o.x, p.y - o.y);
          if (d < 80) {
            ctx.strokeStyle = `rgba(20,184,87,${0.25 * (1 - d / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(o.x, o.y);
            ctx.stroke();
          }
        });
      });

      frame = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  /* ---------------- SCROLL SWITCH ---------------- */
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) setShowIframe(false);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 px-6 py-16 overflow-hidden z-10">
      <div
        className="absolute inset-0 bg-[#295D16] z-0 transition-all duration-1000 ease-in-out"
        style={{
          clipPath: !showIframe ? "circle(150% at 100% 100%)" : "circle(0% at 100% 100%)"
        }}
      />


      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
       
          {/* Left Content */}
          <div className="flex flex-col space-y-6 text-center lg:text-left">
            {/* Badge */}
          <div 
          className={`inline-flex items-center gap-2 px-4 py-2  border  rounded-full  text-sm font-medium w-fit mx-auto lg:mx-0 ${
            showIframe ? "border-[#0c5d14]/30 text-[#14b857] bg-[#0c5d14]/10" : "border-[#000000] text-[#000000] bg-[#000000]/10"
          }`}
        >
              <Shield className="w-4 h-4" />
              <span>Blockchain Security</span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 style={{ fontFamily: "'Jost', sans-serif" }} className="text-4xl font-semibold sm:text-6xl md:text-6xl lg:text-7xl font-sans text-white leading-none">
                PKI Chain
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-[#0c5d14] to-[#14b857] mx-auto lg:mx-0"></div>
            </div>

            <p className="text-zinc-300 text-lg font-normal sm:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0">
              Next-generation digital identity verification with quantum-resistant encryption and
              <span className="text-[#14b857] font-semibold"> zero-knowledge proofs</span>.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
              <button
                className={`group px-8 py-4  rounded-lg font-bold transition-all duration-500 flex items-center justify-center gap-2 text-base shadow-lg shadow-[#126e84]/10 hover:cursor-pointer hover:shadow-xl hover:shadow-[#126e84]/10
                 ${
                 showIframe ? "bg-[#0c5d14] text-white" : "bg-zinc-300 text-black"
                 } `}
                onClick={handleGetStarted}
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button className={`px-8 py-4 bg-transparent border  text-zinc-300 rounded-lg font-bold cursor-pointer hover:text-white transition-all duration-300 text-base
                ${ showIframe ? "border-zinc-700":"border-white" }`}>
                Documentation
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              {[
                { icon: Lock, text: 'AES-256 Encryption' },
                { icon: Zap, text: '<100ms Latency' },
                { icon: Database, text: 'Decentralized Storage' },
                { icon: Activity, text: '99.99% Uptime' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-zinc-300 text-sm">
                    <Icon className={`w-4 h-4  flex-shrink-0
                      ${showIframe ? "text-[#14b857]":"text-zinc-300"}`} />
                    <span>{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

        {/* RIGHT VISUAL */}
        <div className="relative hidden lg:flex items-center justify-center min-h-[600px] ">
          {/* Globe */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-700
            ${showIframe ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
          >
            <iframe
              src="/mode/index.html"
              title="Globe"
              className="w-full h-full"
              style={{ border: "none" }}
            />
          </div>

          {/* Nodes */}
          <div
            className={`absolute inset-0 transition-all duration-700
            ${showIframe ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"}`}
          >
            <div className="relative w-full max-w-lg h-[500px]">
              {/* Central Node */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-xl rotate-45 flex items-center justify-center shadow-xl shadow-[#0c5d14]/50">
                    <div className="w-20 h-20 bg-black rounded-xl -rotate-45 flex items-center justify-center">
                      <Shield className="w-10 h-10 text-[#ffffff]" />
                    </div>
                  </div>
                  <div className="absolute inset-0 border-2 border-[#14b857] rounded-xl rotate-45 animate-ping"></div>
                </div>
              </div>

              {/* Surrounding Nodes */}
              {[
                {
                  x: "50%",
                  y: "10%",
                  label: "Block 1",
                  active: activeBlock === 0,
                },
                {
                  x: "85%",
                  y: "30%",
                  label: "Block 2",
                  active: activeBlock === 1,
                },
                {
                  x: "85%",
                  y: "70%",
                  label: "Block 3",
                  active: activeBlock === 2,
                },
                {
                  x: "50%",
                  y: "90%",
                  label: "Block 4",
                  active: activeBlock === 3,
                },
                {
                  x: "15%",
                  y: "70%",
                  label: "Block 5",
                  active: activeBlock === 4,
                },
                {
                  x: "15%",
                  y: "30%",
                  label: "Block 6",
                  active: activeBlock === 5,
                },
              ].map((node, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: node.x,
                    top: node.y,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className={`w-16 h-16 bg-white text-black rounded-lg flex items-center justify-center shadow-lg transition-all duration-500 ${node.active
                      ? "scale-110 shadow-[#14b857]/60"
                      : "opacity-70"
                      }`}
                  >
                    <div className="text-black text-xs font-bold">
                      {node.label}
                    </div>
                  </div>
                </div>
              ))}

              {/* Connecting Lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ zIndex: -1 }}
              >
                <line
                  x1="50%"
                  y1="10%"
                  x2="50%"
                  y2="50%"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                <line
                  x1="85%"
                  y1="30%"
                  x2="50%"
                  y2="50%"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                <line
                  x1="85%"
                  y1="70%"
                  x2="50%"
                  y2="50%"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                <line
                  x1="50%"
                  y1="90%"
                  x2="50%"
                  y2="50%"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                <line
                  x1="15%"
                  y1="70%"
                  x2="50%"
                  y2="50%"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
                <line
                  x1="15%"
                  y1="30%"
                  x2="50%"
                  y2="50%"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.6"
                />
              </svg>

              {/* Info Panels */}
              <div className="absolute top-4 right-4 bg-black/90 boSponsersrder-[#0c5d14]/40 rounded-lg px-4 py-3 backdrop-blur">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-[#14b857] rounded-full animate-pulse"></div>
                  <span className="text-white text-sm font-bold">Active</span>
                </div>
                <div className="text-slate-400 text-xs">
                  Nodes: <span className="text-[#14b857]">{networkNodes}</span>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-black/90 border border-[#0c5d14]/40 rounded-lg px-4 py-3 backdrop-blur">
                <div className="text-slate-400 text-xs mb-1">Block Hash</div>
                <div className="text-[#14b857] text-xs font-mono">
                  {hashValue}
                </div>
              </div>
            </div>          
          </div>
          
        </div>
        
      </div>
      {/* Stats */}
      <div className="mt-0 grid grid-cols-3 gap-6 max-w-3xl mx-auto relative z-10">
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-black text-white mb-1">99.99%</div>
          <div className={`text-sm ${showIframe ? "text-zinc-400" : "text-zinc-300"}`}>Uptime</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-black text-white mb-1">{(verifications / 1000000).toFixed(1)}M+</div>
          <div className={`text-sm ${showIframe ? "text-zinc-400" : "text-zinc-300"}`}>Verifications</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-black text-white mb-1">256-bit</div>
          <div className={`text-sm ${showIframe ? "text-zinc-400" : "text-zinc-300"}`}>Encryption</div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-9 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className={`w-6 h-10 border-2 rounded-full flex justify-center ${showIframe ? "border-[#0c5d14]" : "border-white"}`}>
          <div className={`w-1 h-3  rounded-full mt-2 ${showIframe ? "bg-[#0c5d14]" : "bg-white"}`}></div>
        </div>
      </div>
      
    </section>
  );
};

export default HeroSection;

