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

          // Updated bullet colors to match the warmer, traditional theme
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
      padding: 4rem 0 2rem 0 !important; 
    }

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.35rem 1rem !important;
      border: 1px solid rgba(217, 22, 36, 0.3) !important;
      background: rgba(255, 255, 255, 0.8) !important;
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

    /* Attractive Kunkuma & Pasupu Gradient */
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

    /* --- TOP IMAGE BACKGROUND ANIMATION --- */
    #ks-about-page-unique-wrapper .ks-hero-glow-wrapper {
      position: relative !important;
      width: 100% !important;
      max-width: 850px !important;
      margin: 0 auto 3.5rem auto !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-glow-wrapper::before {
      content: '' !important;
      position: absolute !important;
      top: -20px !important; right: -20px !important; bottom: -20px !important; left: -20px !important;
      background: linear-gradient(135deg, rgba(244, 143, 177, 0.4), rgba(128, 203, 196, 0.4)) !important;
      filter: blur(30px) !important;
      z-index: 0 !important;
      border-radius: 30px !important;
      animation: pulseGlow 4s infinite alternate ease-in-out !important;
    }

    @keyframes pulseGlow {
      0% { transform: scale(0.96); opacity: 0.6; }
      100% { transform: scale(1.04); opacity: 1; }
    }

    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
      position: relative !important;
      z-index: 1 !important;
      width: 100% !important; 
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

    #ks-about-page-unique-wrapper .ks-rich-text-renderer {
      width: 100% !important;
      max-width: 800px !important;
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

    /* --- BOTTOM IMAGE WAPPER & ANIMATED BADGE --- */
    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
      position: relative !important;
      width: 100% !important;
      max-width: 700px !important;
      margin: 2rem auto 5rem auto !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
    }

    #ks-about-page-unique-wrapper .ks-bottom-img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      border-radius: 16px !important;
    }

    #ks-about-page-unique-wrapper .ks-floating-badge {
      position: absolute !important;
      top: 15% !important;
      left: 2% !important;
      background: rgba(255, 255, 255, 0.9) !important;
      backdrop-filter: blur(8px) !important;
      padding: 0.6rem 1.2rem !important;
      border-radius: 30px !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-family: 'Montserrat', sans-serif !important;
      font-weight: 600 !important;
      font-size: 0.9rem !important;
      color: #111 !important;
      z-index: 5 !important;
      animation: floatUpDown 3.5s ease-in-out infinite !important;
    }

    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-hero-header { 
        padding: 3rem 0 1.5rem 0 !important; 
        text-align: center !important; 
      }

      #ks-about-page-unique-wrapper .ks-pill-badge { font-size: 0.6rem !important; padding: 0.3rem 0.8rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-title { font-size: 2rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-subtitle { font-size: 0.85rem !important; }
      
      #ks-about-page-unique-wrapper .ks-hero-glow-wrapper { margin-bottom: 2rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper { border-radius: 16px !important; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06) !important; }
      #ks-about-page-unique-wrapper .ks-hero-img { height: 220px !important; object-position: center 15% !important; }

      #ks-about-page-unique-wrapper .ks-editorial-heading { font-size: 1.15rem !important; margin: 1.5rem 0 1rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-editorial-body { font-size: 0.85rem !important; }
      #ks-about-page-unique-wrapper .ks-feature-text { font-size: 0.8rem !important; }
      #ks-about-page-unique-wrapper .ks-editorial-feature { padding: 1rem 1.2rem !important; }
      #ks-about-page-unique-wrapper .ks-about-content { padding: 0 1.25rem !important; }

      #ks-about-page-unique-wrapper .ks-floating-badge {
        font-size: 0.75rem !important;
        padding: 0.4rem 0.8rem !important;
        top: 10% !important;
        left: 0% !important;
      }
      #ks-about-page-unique-wrapper .ks-floating-badge svg {
        width: 14px !important;
        height: 14px !important;
      }
      
      #ks-about-page-unique-wrapper .ks-bottom-image-wrapper { margin: 1.5rem auto 4rem auto !important; }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <style>{internalStyles}</style>

      {/* Main Content Area */}
      <div className="ks-about-content">
        <header className="ks-hero-header reveal">
          <div className="ks-pill-badge">Our Journey</div>
          <h1 className="ks-hero-title">About <span className="ks-text-gradient">Us</span></h1>
          <p className="ks-hero-subtitle">
            Where Tradition Meets Modern Connection
          </p>
        </header>

        {/* --- PREMIUM HERO IMAGE WITH ANIMATED GLOW --- */}
        <div className="ks-hero-glow-wrapper reveal">
          <div className="ks-hero-image-fullwidth-wrapper">
            <img 
              src={HERO_IMAGE} 
              alt="Matrimony Discussion" 
              className="ks-hero-img" 
            />
          </div>
        </div>

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

        {/* --- BOTTOM IMAGE COMPONENT WITH FLOATING BADGE --- */}
        <div className="ks-bottom-image-wrapper reveal">
          <div className="ks-floating-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
            Easy Verification
          </div>
          <img 
            src={BOTTOM_IMAGE} 
            alt="App Interface Preview" 
            className="ks-bottom-img" 
          />
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
