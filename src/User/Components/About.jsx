import React, { useEffect, useState } from 'react';
import axios from 'axios';

// ==========================================
// IMAGES
// ==========================================
const HERO_IMAGE = 'https://res.cloudinary.com/dppiuypop/image/upload/v1776784795/uploads/agvylyvj7vc0tpbmc7zj.png'; 
const BOTTOM_IMAGE = 'https://res.cloudinary.com/dppiuypop/image/upload/v1776787554/uploads/vev36jtrtvhb8htfuqc1.png';
// ==========================================

const AboutUs = () => {
  const [pageContent, setPageContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchAboutData = async () => {
      try {
        const response = await axios.get('https://kalyanashobha-back.vercel.app/api/pages/about');

        if (response.data.success) {
          const rawText = response.data.content;
          let colorIndex = 0;

          const bulletColors = [
            'linear-gradient(135deg, #D91624, #b9111c)', // Kunkuma Deep Red
            'linear-gradient(135deg, #FFC300, #e6b000)', // Pasupu Vibrant Yellow
            'linear-gradient(135deg, #f97316, #c2410c)', // Warm Orange
          ];

          const formattedHtml = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
              if (line.toLowerCase() === 'about us' || line.toLowerCase().includes('last updated')) return '';

              const delay = (index * 0.08).toFixed(2);

              if (line.length < 35 && !line.match(/[.,!?]$/)) {
                return `<h2 class="ks-editorial-heading reveal" style="transition-delay: ${delay}s">${line}</h2>`;
              }

              if (/^([A-Za-z\s]+)( [-–:] | to )/.test(line)) {
                let processedLine = line.replace(/^([A-Za-z\s]+)( [-–:] | to )/g, '<span class="ks-feature-title">$1</span><span class="ks-feature-separator">$2</span>');
                const currentColor = bulletColors[colorIndex % bulletColors.length];
                colorIndex++;

                return `
                  <div class="ks-editorial-feature reveal" style="transition-delay: ${delay}s">
                    <div class="ks-feature-indicator" style="background: ${currentColor} !important;"></div>
                    <p class="ks-feature-text">${processedLine}</p>
                  </div>
                `;
              }

              return `<p class="ks-editorial-body reveal" style="transition-delay: ${delay}s">${line}</p>`;
            })
            .join('');

          setPageContent(formattedHtml);
        }
      } catch (error) {
        setPageContent("<p class='ks-error-text'>Unable to load content.</p>");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const items = document.querySelectorAll('.reveal');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [pageContent, isLoading]);

  const internalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:wght@400;500;600&display=swap') !important;

    #ks-about-page-unique-wrapper {
      position: relative !important;
      min-height: 100vh !important;
      background-color: #fcfcfc !important; 
      font-family: 'Montserrat', sans-serif !important;
      color: #1a1a1a !important;
      text-align: center !important;
      overflow-x: hidden !important; 
    }

    /* --- TOP SECTION WITH RESTRICTED BACKGROUND --- */
    #ks-about-page-unique-wrapper .ks-top-section {
      position: relative !important;
      width: 100% !important;
      padding-top: 4rem !important;
      padding-bottom: 2rem !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    /* Animated background constrained to the top section */
    #ks-about-page-unique-wrapper .ks-top-section-bg {
      content: '' !important;
      position: absolute !important;
      top: 0 !important; right: 0 !important; left: 0 !important; bottom: 0 !important;
      background: linear-gradient(135deg, rgba(244, 143, 177, 0.15), rgba(128, 203, 196, 0.15)) !important;
      border-bottom-left-radius: 40px !important;
      border-bottom-right-radius: 40px !important;
      z-index: 0 !important;
      animation: pulseGlowBg 6s infinite alternate ease-in-out !important;
    }

    @keyframes pulseGlowBg {
      0% { opacity: 0.6; background: linear-gradient(135deg, rgba(244, 143, 177, 0.1), rgba(128, 203, 196, 0.2)); }
      100% { opacity: 1; background: linear-gradient(135deg, rgba(244, 143, 177, 0.25), rgba(128, 203, 196, 0.1)); }
    }

    #ks-about-page-unique-wrapper .ks-about-content {
      position: relative !important;
      z-index: 10 !important; 
      max-width: 900px !important; 
      margin: 0 auto !important;
      padding: 0 1.5rem !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    /* --- BASE ANIMATIONS --- */
    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(20px) !important;
      transition: all 0.7s cubic-bezier(0.2, 1, 0.3, 1) !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-header { 
      position: relative !important;
      z-index: 2 !important;
      padding: 0 0 2rem 0 !important; 
    }

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.35rem 1rem !important;
      border: 1px solid rgba(217, 22, 36, 0.3) !important;
      background: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(4px) !important;
      border-radius: 50px !important;
      font-size: 0.65rem !important; 
      font-weight: 600 !important;
      color: #D91624 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      margin-bottom: 1.5rem !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-title {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(2.2rem, 5vw, 3.5rem) !important; 
      font-weight: 600 !important;
      line-height: 1.2 !important;
      margin-bottom: 1rem !important;
      color: #111 !important;
    }

    #ks-about-page-unique-wrapper .ks-text-gradient {
      background: linear-gradient(135deg, #D91624, #FFC300) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      font-style: italic !important;
      padding-right: 0.1em !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-subtitle {
      font-size: clamp(0.95rem, 1.2vw, 1.1rem) !important; 
      color: #555 !important;
      max-width: 600px !important;
      margin: 0 auto 2rem auto !important;
      line-height: 1.6 !important;
      font-weight: 400 !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
      position: relative !important;
      z-index: 2 !important;
      width: 100% !important; 
      max-width: 850px !important;
      border-radius: 24px !important;
      overflow: hidden !important; 
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08) !important; 
      line-height: 0 !important; 
      transform: translateZ(0); 
    }

    #ks-about-page-unique-wrapper .ks-hero-img {
      width: 100% !important;
      height: 450px !important; 
      display: block !important;
      object-fit: cover !important; 
      object-position: center 20% !important; 
    }

    /* --- TEXT SECTION --- */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer {
      width: 100% !important;
      max-width: 800px !important;
      padding-top: 3rem !important;
      padding-bottom: 2rem !important; 
      text-align: left !important; 
    }

    #ks-about-page-unique-wrapper .ks-editorial-heading {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.4rem, 2.5vw, 1.8rem) !important; 
      background: linear-gradient(135deg, #D91624, #FFC300) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      margin: 3rem 0 1rem 0 !important;
      font-weight: 600 !important;
      padding-bottom: 0.4rem !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-body {
      font-size: clamp(0.9rem, 1.1vw, 1rem) !important; 
      line-height: 1.8 !important;
      color: #444 !important;
      margin-bottom: 1.2rem !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-feature {
      display: flex !important;
      text-align: left !important;
      background: #ffffff !important; 
      padding: 1.2rem 1.5rem !important;
      border-radius: 14px !important; 
      border: 1px solid rgba(0, 0, 0, 0.04) !important;
      margin-bottom: 1rem !important;
      align-items: flex-start !important;
      transition: all 0.3s ease !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.02) !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-feature:hover {
      box-shadow: 0 8px 25px rgba(0,0,0,0.06) !important;
      transform: translateY(-2px) !important;
      border-color: rgba(217, 22, 36, 0.15) !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-indicator {
      width: 8px !important;
      height: 8px !important;
      border-radius: 50% !important;
      margin-right: 1.2rem !important;
      margin-top: 0.45rem !important;
      flex-shrink: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-text {
      font-size: 0.95rem !important; 
      color: #444 !important;
      line-height: 1.6 !important;
      margin: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-title { 
      font-weight: 600 !important; 
      color: #111 !important; 
      font-family: 'Montserrat', sans-serif !important;
    }

    /* --- BOTTOM IMAGE & MULTIPLE ANIMATED BADGES --- */
    #ks-about-page-unique-wrapper .ks-bottom-section {
      width: 100% !important;
      display: flex !important;
      justify-content: center !important;
      padding-top: 2rem !important;
      padding-bottom: 6rem !important;
    }

    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
      position: relative !important;
      width: 100% !important;
      max-width: 650px !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }

    #ks-about-page-unique-wrapper .ks-bottom-img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      border-radius: 16px !important;
      position: relative !important;
      z-index: 1 !important;
    }

    /* Floating Badges Global Styles */
    #ks-about-page-unique-wrapper .ks-floating-badge {
      position: absolute !important;
      background: rgba(255, 255, 255, 0.95) !important;
      backdrop-filter: blur(10px) !important;
      padding: 0.6rem 1.1rem !important;
      border-radius: 30px !important;
      box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-family: 'Montserrat', sans-serif !important;
      font-weight: 600 !important;
      font-size: 0.85rem !important;
      color: #222 !important;
      z-index: 5 !important;
      animation: floatUpDown 3.5s ease-in-out infinite !important;
      white-space: nowrap !important;
      border: 1px solid rgba(0,0,0,0.03) !important;
    }

    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    /* Individual Badge Positions & Delays */
    #ks-about-page-unique-wrapper .badge-1 {
      top: 10% !important;
      left: -5% !important;
      animation-delay: 0s !important;
    }
    
    #ks-about-page-unique-wrapper .badge-2 {
      top: 25% !important;
      right: -8% !important;
      animation-delay: 1.2s !important;
    }

    #ks-about-page-unique-wrapper .badge-3 {
      bottom: 25% !important;
      left: -6% !important;
      animation-delay: 0.8s !important;
    }

    #ks-about-page-unique-wrapper .badge-4 {
      bottom: 12% !important;
      right: -2% !important;
      animation-delay: 1.8s !important;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-top-section { padding-top: 3rem !important; padding-bottom: 1.5rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-header { text-align: center !important; padding: 0 1rem 1.5rem 1rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-title { font-size: 2rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-subtitle { font-size: 0.85rem !important; }
      
      #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper { border-radius: 16px !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06) !important; }
      #ks-about-page-unique-wrapper .ks-hero-img { height: 220px !important; object-position: center 15% !important; }

      #ks-about-page-unique-wrapper .ks-editorial-heading { font-size: 1.15rem !important; margin: 1.5rem 0 1rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-editorial-body { font-size: 0.85rem !important; }
      #ks-about-page-unique-wrapper .ks-feature-text { font-size: 0.8rem !important; }
      #ks-about-page-unique-wrapper .ks-editorial-feature { padding: 1rem 1.2rem !important; }
      
      /* Mobile adjustments for badges to avoid clipping off-screen */
      #ks-about-page-unique-wrapper .ks-floating-badge {
        font-size: 0.65rem !important;
        padding: 0.4rem 0.8rem !important;
      }
      #ks-about-page-unique-wrapper .ks-floating-badge svg { width: 14px !important; height: 14px !important; }
      
      #ks-about-page-unique-wrapper .badge-1 { top: 5% !important; left: 0% !important; }
      #ks-about-page-unique-wrapper .badge-2 { top: 18% !important; right: 0% !important; }
      #ks-about-page-unique-wrapper .badge-3 { bottom: 20% !important; left: 2% !important; }
      #ks-about-page-unique-wrapper .badge-4 { bottom: 8% !important; right: 2% !important; }
      
      #ks-about-page-unique-wrapper .ks-bottom-section { padding-bottom: 4rem !important; }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <style>{internalStyles}</style>

      {/* --- TOP SECTION WITH CONSTRAINED BACKGROUND --- */}
      <div className="ks-top-section">
        <div className="ks-top-section-bg"></div>
        <div className="ks-about-content">
          <header className="ks-hero-header reveal">
            <div className="ks-pill-badge">Our Journey</div>
            <h1 className="ks-hero-title">About <span className="ks-text-gradient">Us</span></h1>
            <p className="ks-hero-subtitle">
              Where Tradition Meets Modern Connection
            </p>
          </header>

          <div className="ks-hero-image-fullwidth-wrapper reveal">
            <img 
              src={HERO_IMAGE} 
              alt="Matrimony Discussion" 
              className="ks-hero-img" 
            />
          </div>
        </div>
      </div>

      {/* --- TEXT CONTENT AREA --- */}
      <div className="ks-about-content">
        <div className="ks-rich-text-renderer">
          {isLoading ? (
            <div className="ks-skeleton-container">
              <div className="ks-skeleton-pulse ks-skel-title" style={{height: '30px', width: '50%', marginBottom: '1rem', background: '#e0e0e0', borderRadius: '4px'}}></div>
              <div className="ks-skeleton-pulse ks-skel-full" style={{height: '15px', width: '100%', marginBottom: '0.5rem', background: '#e0e0e0', borderRadius: '4px'}}></div>
              <div className="ks-skeleton-pulse ks-skel-full" style={{height: '15px', width: '80%', marginBottom: '2rem', background: '#e0e0e0', borderRadius: '4px'}}></div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: pageContent }} />
          )}
        </div>
      </div>

      {/* --- BOTTOM SECTION WITH MULTIPLE ICONS --- */}
      <div className="ks-bottom-section reveal">
        <div className="ks-about-content">
          <div className="ks-bottom-image-wrapper">
            
            {/* Badge 1: Easy Verification */}
            <div className="ks-floating-badge badge-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
              Easy Verification
            </div>

            {/* Badge 2: Elite Matches */}
            <div className="ks-floating-badge badge-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC300" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Elite Matches
            </div>

            {/* Badge 3: 100% Secure */}
            <div className="ks-floating-badge badge-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              100% Secure
            </div>

            {/* Badge 4: Privacy First */}
            <div className="ks-floating-badge badge-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D91624" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Privacy First
            </div>

            <img 
              src={BOTTOM_IMAGE} 
              alt="App Interface Preview" 
              className="ks-bottom-img" 
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutUs;
