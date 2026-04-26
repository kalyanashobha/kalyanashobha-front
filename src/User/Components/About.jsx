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
            'linear-gradient(135deg, #E11D48, #be123c)', // Red
            'linear-gradient(135deg, #F59E0B, #d97706)', // Amber
            'linear-gradient(135deg, #0ea5e9, #0284c7)', // Blue
          ];

          // Sparkle/Star Icon SVG for feature cards
          const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

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
                    <div class="ks-feature-icon-box" style="background: ${currentColor} !important;">
                      ${iconSvg}
                    </div>
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

    /* --- ANIMATION KEYFRAMES --- */
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
      100% { transform: translateY(0px); }
    }
    
    @keyframes pulseGlow {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(1.05); }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    #ks-about-page-unique-wrapper {
      position: relative !important;
      min-height: 100vh !important;
      background-color: #fafafa !important; 
      font-family: 'Montserrat', sans-serif !important;
      color: #1a1a1a !important;
      text-align: center !important;
      overflow: hidden !important; /* Contains absolute blobs */
    }

    /* --- AMBIENT BACKGROUND BLOBS --- */
    #ks-about-page-unique-wrapper .ks-bg-blob {
      position: absolute !important;
      border-radius: 50% !important;
      filter: blur(80px) !important;
      z-index: 0 !important;
      animation: pulseGlow 8s infinite alternate ease-in-out !important;
      pointer-events: none !important;
    }
    #ks-about-page-unique-wrapper .ks-blob-1 {
      top: -5%; left: -10%; width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(225,29,72,0.15) 0%, transparent 70%) !important;
    }
    #ks-about-page-unique-wrapper .ks-blob-2 {
      top: 40%; right: -15%; width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%) !important;
      animation-delay: -4s !important;
    }

    /* --- CONTENT WRAPPER --- */
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

    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(25px) !important;
      transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1) !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* --- HERO HEADER --- */
    #ks-about-page-unique-wrapper .ks-hero-header { 
      padding: 4rem 0 2rem 0 !important; 
    }

    /* Animated Shimmer Badge */
    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.4rem 1.2rem !important;
      background: linear-gradient(90deg, rgba(255,255,255,0.9), rgba(255,255,255,0.4), rgba(255,255,255,0.9)) !important;
      background-size: 200% 100% !important;
      animation: shimmer 3s infinite linear !important;
      backdrop-filter: blur(8px) !important;
      border: 1px solid rgba(220, 38, 38, 0.2) !important;
      border-radius: 50px !important;
      font-size: 0.65rem !important; 
      font-weight: 700 !important;
      color: #dc2626 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      margin-bottom: 1.5rem !important;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.1) !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-title {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(2.2rem, 5vw, 3.8rem) !important; 
      font-weight: 700 !important;
      line-height: 1.2 !important;
      margin-bottom: 1rem !important;
      color: #111 !important;
    }

    #ks-about-page-unique-wrapper .ks-text-gradient {
      background: linear-gradient(135deg, #dc2626, #f59e0b) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      font-style: italic !important;
      padding-right: 0.1em !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-subtitle {
      font-size: clamp(0.95rem, 1.2vw, 1.1rem) !important; 
      color: #666 !important;
      max-width: 600px !important;
      margin: 0 auto 2rem auto !important;
      line-height: 1.6 !important;
      font-weight: 400 !important;
    }

    /* --- PREMIUM ARCHED HERO IMAGE --- */
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
      position: relative !important;
      width: 80% !important; /* Changed to 80% width on Desktop */
      margin: 0 auto 3.5rem auto !important;
      
      /* UNIQUE ARCH SHAPE (Circle Top, Rounded Bottom) */
      border-radius: 250px 250px 24px 24px !important; 
      
      overflow: hidden !important; 
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1) !important; 
      transform: translateZ(0); 
      animation: float 6s ease-in-out infinite !important; 
      border: 6px solid #fff !important; /* Thick white border for premium framing */
    }

    #ks-about-page-unique-wrapper .ks-hero-img {
      width: 100% !important;
      height: 480px !important; /* Slightly taller to accommodate the deep arch */
      display: block !important;
      object-fit: cover !important; 
      object-position: center 30% !important; /* Adjusted so faces aren't cut off by the top arch */
      transition: transform 0.5s ease !important;
    }
    
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper:hover .ks-hero-img {
      transform: scale(1.05) !important; 
    }

    /* --- TYPOGRAPHY & CONTENT --- */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer {
      width: 100% !important;
      max-width: 800px !important;
      padding-bottom: 2rem !important; 
      text-align: left !important; 
    }

    #ks-about-page-unique-wrapper .ks-editorial-heading {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.4rem, 2.5vw, 1.8rem) !important; 
      background: linear-gradient(135deg, #111, #444) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      margin: 3rem 0 1.5rem 0 !important;
      font-weight: 700 !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-body {
      font-size: clamp(0.95rem, 1.1vw, 1.05rem) !important; 
      line-height: 1.85 !important;
      color: #555 !important;
      margin-bottom: 1.5rem !important;
    }

    /* --- PREMIUM GLASSMORPHISM FEATURE CARDS --- */
    #ks-about-page-unique-wrapper .ks-editorial-feature {
      display: flex !important;
      text-align: left !important;
      background: rgba(255, 255, 255, 0.7) !important; 
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
      padding: 1.5rem !important;
      border-radius: 16px !important; 
      border: 1px solid rgba(255, 255, 255, 1) !important;
      margin-bottom: 1.2rem !important;
      align-items: flex-start !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important; 
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04) !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-feature:hover {
      box-shadow: 0 15px 35px rgba(220, 38, 38, 0.08) !important;
      transform: translateY(-5px) scale(1.01) !important;
      background: rgba(255, 255, 255, 0.95) !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-icon-box {
      width: 32px !important;
      height: 32px !important;
      border-radius: 10px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-right: 1.2rem !important;
      flex-shrink: 0 !important;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1) !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-text {
      font-size: 0.95rem !important; 
      color: #444 !important;
      line-height: 1.7 !important;
      margin: 0 !important;
      padding-top: 0.2rem !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-title { 
      font-weight: 700 !important; 
      color: #111 !important; 
      font-size: 1.05rem !important;
      display: block !important;
      margin-bottom: 0.3rem !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-separator {
      display: none !important; 
    }

    /* --- BOTTOM BLENDED IMAGE --- */
    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
      width: 100% !important;
      max-width: 700px !important;
      margin: 3rem auto 6rem auto !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      animation: float 7s ease-in-out infinite reverse !important; 
      position: relative !important;
    }

    /* Blend Effect to make the image sink into the background smoothly */
    #ks-about-page-unique-wrapper .ks-bottom-img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      border-radius: 20px !important;
      mix-blend-mode: multiply !important; /* Seamlessly blends white backgrounds into the page */
      filter: drop-shadow(0 25px 35px rgba(220, 38, 38, 0.05)) !important; /* Soft colored ambient shadow */
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-hero-header { 
        padding: 3rem 0 1.5rem 0 !important; 
      }

      #ks-about-page-unique-wrapper .ks-blob-1 { width: 300px; height: 300px; }
      #ks-about-page-unique-wrapper .ks-blob-2 { width: 300px; height: 300px; }

      #ks-about-page-unique-wrapper .ks-hero-title { font-size: 2rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-subtitle { font-size: 0.85rem !important; }
      
      /* Mobile Hero adjustments */
      #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
        width: 95% !important; /* Expanded to 95% width */
        border-radius: 120px 120px 16px 16px !important; /* Adjusted arch for mobile proportion */
        margin-bottom: 2.5rem !important;
        border-width: 4px !important;
      }

      #ks-about-page-unique-wrapper .ks-hero-img {
        height: 260px !important; 
        object-position: center 20% !important; 
      }

      #ks-about-page-unique-wrapper .ks-editorial-heading { font-size: 1.25rem !important; margin: 1.5rem 0 1rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-editorial-body { font-size: 0.9rem !important; }
      
      #ks-about-page-unique-wrapper .ks-editorial-feature { padding: 1.2rem !important; flex-direction: column !important;}
      
      #ks-about-page-unique-wrapper .ks-feature-icon-box { margin-bottom: 0.8rem !important; }
      #ks-about-page-unique-wrapper .ks-feature-text { font-size: 0.85rem !important; }
      
      #ks-about-page-unique-wrapper .ks-about-content { padding: 0 1.25rem !important; }
      
      /* Mobile Bottom Image adjustments */
      #ks-about-page-unique-wrapper .ks-bottom-image-wrapper { 
        width: 75% !important; /* Drastically reduced size on mobile */
        margin: 1.5rem auto 4rem auto !important; 
      }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <style>{internalStyles}</style>

      {/* Ambient Background Blobs */}
      <div className="ks-bg-blob ks-blob-1"></div>
      <div className="ks-bg-blob ks-blob-2"></div>

      {/* Main Content Area */}
      <div className="ks-about-content">
        <header className="ks-hero-header reveal">
          <div className="ks-pill-badge">Our Journey</div>
          <h1 className="ks-hero-title">About <span className="ks-text-gradient">Us</span></h1>
          <p className="ks-hero-subtitle">
            Where Tradition Meets Modern Connection
          </p>
        </header>

        {/* --- PREMIUM FLOATING ARCHED HERO IMAGE --- */}
        <div className="ks-hero-image-fullwidth-wrapper reveal">
          <img 
            src={HERO_IMAGE} 
            alt="Matrimony Discussion" 
            className="ks-hero-img" 
          />
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

        {/* --- BOTTOM BLENDED IMAGE --- */}
        <div className="ks-bottom-image-wrapper reveal">
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
