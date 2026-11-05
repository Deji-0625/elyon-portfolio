import React, { useState, useEffect, useRef } from "react";
import FloatingIconNav from "./components/FloatingIconNav";
import TechText from "./components/TechText";
import WorksWheel from "./components/WorksWheel";
import { OriginButton } from "./components/OriginButton";
import FloatingTools from "./components/FloatingTools";
import CustomCursor from "./components/CustomCursor";
import Lenis from 'lenis';
import Preloader from "./components/Preloader";
import GradientWaves from "./components/GradientWaves";
import AccordionGallery from "./components/AccordionGallery";
import "./components/CircularGallery.css"; /* Make sure this is here! */
import authorImage from "./assets/author.jpg";


// --- NEW REVEAL COMPONENT ---
const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
        observer.unobserve(ref.current);
      }
    }, { threshold: 0.15 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-transition ${isVisible ? 'reveal-visible' : ''}`}>
      {children}
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // NEW: Tracks the preloader
  const scrollBuffer = useRef(0);
  // ...

  // --- 1. SCROLL LOCKING LOGIC ---
  useEffect(() => {
    const handleWheel = (e) => {
      if (window.scrollY <= 10) {
        if (!isScrolled && e.deltaY > 0) {
          e.preventDefault();
          setIsScrolled(true);
          scrollBuffer.current = 0;
        }
        else if (isScrolled && e.deltaY > 0) {
          if (scrollBuffer.current < READ_DELAY_THRESHOLD) {
            e.preventDefault();
            scrollBuffer.current += e.deltaY;
          }
        }
        else if (isScrolled && e.deltaY < 0) {
          e.preventDefault();
          setIsScrolled(false);
          scrollBuffer.current = 0;
        }
      }
    };

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      }
    };


    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isScrolled]);

  // --- 2. LENIS SMOOTH SCROLLING ---
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      smoothTouch: false,
    });

    let rafId;

    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    // Safe Cleanup
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <main>
      {/* THE PRELOADER */}
      <div className={`preloader-wrapper ${!isLoading ? "preloader-slide-up" : ""}`}>
        <Preloader onComplete={() => setIsLoading(false)} />
      </div>
      <CustomCursor />
      {/* 1. INDEPENDENT FLOATING LOGO (Top Left) */}
      <a href="#" className={`fixed-logo ${isScrolled ? "fixed-logo-visible" : "fixed-logo-hidden"}`}>
        Elyon Concepts.
      </a>

      {/* 2. BRAND APPART STYLE ICON DOCK (Top Center) */}
      <div className={`ba-nav-wrapper ${isScrolled ? "ba-nav-visible" : "ba-nav-hidden"}`}>
        <FloatingIconNav />
      </div>

      {/* HERO SECTION */}
      {/* COMBINED HERO & TOOLS WRAPPER FOR FLUID BACKGROUND */}
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>

        {/* THE FLUID CANVAS BACKGROUND NOW COVERS BOTH */}
        <GradientWaves
          waveColor="#304F4F"
          amplitude={60}
          swell={1.5}
          lightAngle={145}
          speed={0.012}
        />

        {/* HERO SECTION */}
        <section className="hero dynamic-hero" style={{ background: 'transparent' }}>
          <p className="tagline" style={{ position: 'relative', zIndex: 10 }}>Inspired by the Spirit. Crafted with Excellence. Designed to Elevate.</p>

          <div className="hero-text-wrapper" style={{ position: 'relative', zIndex: 10 }}>
            <div className={`tech-text-container ${isScrolled ? "fade-out" : "fade-in"}`}>
              <TechText
                text="Elyon Concepts"
                fontFamily="Manrope, sans-serif"
                fontWeight={700}
                fontSize={90}
                reveal="letter"
                accentColor="#E58A3A"
                color="#304F4F"
                speed={1}
              />
            </div>

            <div className={`standard-text-container ${isScrolled ? "fade-in" : "fade-out"}`}>
              <h1>Your vision deserves more than ordinary design.</h1>
              <p className="hero-subtext">
                We transform ideas into purposeful visual experiences that help brands, businesses, and organizations communicate with clarity and stand out with confidence.
              </p>
              <div className="hero-buttons">
                <OriginButton
                  variant="primary"
                  onClick={() => {
                    // The message we want to pre-fill
                    const message = "Hello Emmanuel, I'm interested in starting a project with Elyon Concepts. Can we discuss some details?";
                    // Encodes the spaces and punctuation for a URL
                    const encodedMessage = encodeURIComponent(message);
                    // Replace YOUR_NUMBER with his actual WhatsApp number, including the country code (e.g., 2348012345678 - no '+' or spaces)
                    const whatsappUrl = `https://wa.me/2347069221629?text=${encodedMessage}`;

                    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  Start a Project
                </OriginButton>
                <OriginButton
                  variant="outline"
                  onClick={() => document.getElementById('work').scrollIntoView({ behavior: 'smooth' })}
                >
                  Explore Our Work
                </OriginButton>
              </div>
            </div>
          </div>
        </section>

        {/* FLOATING TOOLS (Now inside the wave background) */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <FloatingTools />
        </div>

      </div>
      {/* END OF COMBINED WRAPPER */}

      {/* METHODOLOGY (Sticky Process with Visual Anchor) */}
      <section className="methodology-section">
        <div className="methodology-container">
          
          {/* Left Side: Sticky Title + A Clean Process Image */}
          <div className="methodology-sticky">
            <Reveal delay={0}>
              <h2>The<br />Process.</h2>
              <p>A structured approach to transforming ideas into purposeful visual experiences. No guesswork, just absolute clarity.</p>
              
              {/* Added a subtle editorial process preview image to break up text */}
              {/* Reliable Editorial Process Image */}
              <div style={{ 
                marginTop: '2.5rem', 
                borderRadius: '0.75rem', 
                overflow: 'hidden', 
                aspectRatio: '16/10', 
                maxHeight: '260px',
                position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                border: '1px solid rgba(241, 245, 245, 0.15)'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80" 
                  alt="Elyon Concepts Workspace" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </Reveal>
          </div>

          {/* Right Side: Shortened, Punchy Steps */}
          <div className="methodology-steps">
            <Reveal delay={150}>
              <div className="methodology-step">
                <span className="step-ghost">01</span>
                <span className="step-number">Phase 01</span>
                <h3>Discovery</h3>
                <p>We map your core message and audience alignment before a single pixel is placed.</p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="methodology-step">
                <span className="step-ghost">02</span>
                <span className="step-number">Phase 02</span>
                <h3>Strategy</h3>
                <p>Color systems, typography, and brand voice frameworks are strictly locked in.</p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="methodology-step">
                <span className="step-ghost">03</span>
                <span className="step-number">Phase 03</span>
                <h3>Execution</h3>
                <p>Ideas take tactile shape, delivering absolute visual authority across all touchpoints.</p>
              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {/* BRAND PHILOSOPHY / ABOUT (Editorial Split Layout - Flipped) */}
      <section id="about" className="about-section">
        <div className="about-container">
          
          {/* Left Side: The Text (Flipped to Left) */}
          <div className="about-content">
            <Reveal delay={0}>
              <div className="about-label">The Vision</div>
              <h2>We don't just create designs. We help ideas find their visual voice.</h2>
            </Reveal>
            
            <Reveal delay={150}>
              <p>
                Every project begins with understanding your message, your audience, and the impression you want to leave. Elyon Concepts is a creative partner—combining thoughtful direction, visual communication, and reliable collaboration to help you present your ideas professionally.
              </p>
              <p>
                Whether you are building a new brand from the ground up or elevating an existing identity, we bridge the gap between imagination and execution.
              </p>
            </Reveal>
            
            <Reveal delay={300}>
              <div className="about-founder">
                — Emmanuel Augustine
              </div>
            </Reveal>
          </div>

          {/* Right Side: The Image (Flipped to Right) */}
          <Reveal delay={450}>
            <div className="about-image-wrapper">
              <img 
                src={authorImage} 
                alt="Emmanuel Augustine - Founder of Elyon Concepts" 
                className="about-image"
              />
            </div>
          </Reveal>
          
        </div>
      </section>

      {/* SERVICES (Visual Bento Grid - Premium Typography & Gradient) */}
      <section id="services" className="services-section">
        <Reveal>
          <h2>Capabilities</h2>
          <p className="services-intro">Strategic design engineered for impact.</p>
        </Reveal>

        <div className="bento-container">
          
          {/* LEFT COLUMN: Brand Identity */}
          <div className="bento-col bento-col-left">
            <Reveal delay={0}>
              <div className="bento-box bento-dark" style={{ padding: 0 }}>
                {/* Image: Full Opacity */}
                <img 
                  src="https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80" 
                  alt="Brand Identity" 
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                />
                
                {/* Overlay: Pitch black at the bottom, fading to 100% transparent by the middle */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11, 19, 19, 0.98) 0%, rgba(11, 19, 19, 0.6) 30%, transparent 60%)', zIndex: 1 }}></div>
                
                {/* Content: Premium Typography */}
                <div style={{ position: 'relative', zIndex: 2, padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                  <strong style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                    01 / Brand Systems
                  </strong>
                  <h3 style={{ fontSize: '2.5rem', fontWeight: 400, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.75rem', lineHeight: '1.1' }}>
                    Identity & Direction
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', margin: 0, maxWidth: '90%' }}>
                    Logos, typography systems, and comprehensive brand frameworks.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: Stacked Cards */}
          <div className="bento-col bento-col-right">
            
            {/* Top Right: Digital Design */}
            <Reveal delay={150}>
              <div className="bento-box bento-dark" style={{ padding: 0 }}>
                <img 
                  src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80" 
                  alt="Digital Design" 
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11, 19, 19, 0.98) 0%, rgba(11, 19, 19, 0.6) 30%, transparent 60%)', zIndex: 1 }}></div>
                
                <div style={{ position: 'relative', zIndex: 2, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                  <strong style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    02 / Digital & Social
                  </strong>
                  <h3 style={{ fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.5rem', lineHeight: '1.1' }}>
                    Campaign Visuals
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)', lineHeight: '1.6', margin: 0, maxWidth: '95%' }}>
                    High-converting social collateral and promotional assets.
                  </p>
                </div>
              </div>
            </Reveal>

            {/* Bottom Right: Partnerships (Solid Accent Color) */}
            <Reveal delay={300}>
              <div className="bento-box bento-accent" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <strong style={{ fontSize: '0.7rem', letterSpacing: '2px', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', textTransform: 'uppercase', opacity: 0.9 }}>
                  03 / Collaboration
                </strong>
                <h3 style={{ fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.03em', color: '#ffffff', marginBottom: '0.5rem', lineHeight: '1.1' }}>
                  Retainers & Scale
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: '1.6', margin: 0 }}>
                  Ongoing design execution tailored for growing teams.
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* PORTFOLIO (Accordion Gallery) */}
      <section id="work" className="works-section" style={{ backgroundColor: "var(--bg-white)", position: "relative", padding: "8rem 5%", overflow: "hidden" }}>

        <Reveal delay={0}>
          <h2 style={{ textAlign: "center", color: "var(--primary-green)", fontSize: "3rem", marginBottom: "4rem", fontFamily: "'Manrope', sans-serif", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Selected Works
          </h2>
        </Reveal>

        <Reveal delay={200}>
          {/* Ensure your AccordionGallery is configured to take up good vertical space */}
          <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
            <AccordionGallery />
          </div>
        </Reveal>
      </section>

      {/* MEGA FOOTER */}
      <footer id="contact" className="mega-footer">
        {/* Main Content Centered */}
        <div style={{ width: "100%", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Reveal delay={0}>
            <h2 className="footer-huge-text">LET'S TALK.</h2>
          </Reveal>

          <Reveal delay={150}>
            <p className="footer-sub">Ready to elevate your visual identity? Drop your email and we'll reach out to start the conversation.</p>
          </Reveal>

          <Reveal delay={300}>
            <form className="footer-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="hello@elyonconcepts.com" className="footer-input" required />
              <button type="submit" className="footer-submit">Send</button>
            </form>
          </Reveal>
        </div>

        {/* Bottom Socials & Copyright */}
        <div style={{ width: "100%" }}>
          <Reveal delay={450}>
            <div className="footer-bottom">
              <div className="footer-socials">
                <a href="#">Instagram</a>
                <a href="#">LinkedIn</a>
                <a href="#">WhatsApp</a>
              </div>
              <div className="footer-copyright">
                © 2026 Elyon Concepts.<br />Founded by Emmanuel Augustine.
              </div>
            </div>
          </Reveal>
        </div>
      </footer>
    </main>
  );
}