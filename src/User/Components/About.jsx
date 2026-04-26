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
          
          // Premium gradient palettes for icons
          const bulletStyles = [
            { bg: 'linear-gradient(135deg, #ff4b6e, #f43f5e)', shadow: 'rgba(244, 63, 94, 0.3)', icon: 'ri-heart-3-fill' },
            { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: 'rgba(245, 158, 11, 0.3)', icon: 'ri-star-smile-fill' },
            { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', shadow: 'rgba(59, 130, 246, 0.3)', icon: 'ri-shield-check-fill' },
            { bg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', shadow: 'rgba(139, 92, 246, 0.3)', icon: 'ri-gemini-fill' },
          ];

          const formattedHtml = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
              if (line.toLowerCase() === 'about us' || line.toLowerCase().includes('last updated')) return '';

              const delay = (index * 0.08).toFixed(2);

              // Premium Editorial Headings
              if (line.length < 35 && !line.match(/[.,!?]$/)) {
                return `<h2 class="ks-editorial-heading reveal" style="transition-delay: ${delay}s">${line}</h2>`;
              }

              // Premium Glassmorphic Feature Cards with Dynamic Icons
              if (/^([A-Za-z\s]+)( [-–:] | to )/.test(line)) {
                let processedLine = line.replace(/^([A-Za-z\s]+)( [-–:] | to )/g, '<span class="ks-feature-title">$1</span><span class="ks-feature-separator">$2</span>');
                const styleConfig = bulletStyles[colorIndex % bulletStyles.length];
                colorIndex++;

                return `
                  <div class="ks-editorial-feature reveal" style="transition-delay: ${delay}s">
                    <div class="ks-feature-icon-wrapper" style="background: ${styleConfig.bg}; box-shadow: 0 4px 12px ${styleConfig.shadow};">
                      <i class="${styleConfig.icon}"></i>
                    </div>
                    <p class="ks-feature-text">${processedLine}</p>
                  </div>
                `;
              }

              // Body text
              return `<p class="ks-editorial-body reveal" style="transition-delay: ${delay}s">${line}</p>`;
            })
            .join('');

          setPageContent(formattedHtml);
        }
      } catch (error) {
        setPageContent("<p class='ks-error-text'>Unable to load content. Please try again.</p>");
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
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const items = document.querySelectorAll('.reveal');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [pageContent, isLoading]);

  const internalStyles = `
    /* Import Premium Fonts & Remix Icons */
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap') !important;
    @import url('https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css') !important;

    #ks-about-page-unique-wrapper {
      position: relative !important;
      min-height: 100vh !important;
      background: linear-gradient(180deg, #fdfbfb 0%, #f4f4f6 100%) !important;
      font-family: 'Plus Jakarta Sans', sans-serif !important;
      color: #1a1a1a !important;
      text-align: center !important;
      overflow-x: hidden !important; 
    }

    /* Subtle background pattern */
    #ks-about-page-unique-wrapper::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: radial-gradient(rgba(220, 38, 38, 0.03) 1px, transparent 1px);
      background-size: 30px 30px;
      z-index: 0;
      pointer-events: none;
    }

    /* --- CONTENT WRAPPER --- */
    #ks-about-page-unique-wrapper .ks-about-content {
      position: relative !important;
      z-index: 10 !important; 
      max-width: 850px !important; 
      margin: 0 auto !important;
      padding: 0 1.5rem !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    /* --- ANIMATIONS --- */
    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(30px) scale(0.98) !important;
      transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1) !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) scale(1) !important;
    }

    @keyframes floating {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-15px); }
      100% { transform: translateY(0px); }
    }

    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    /* --- HERO HEADER --- */
    #ks-about-page-unique-wrapper .ks-hero-header { 
      padding: 5rem 0 3rem 0 !important; 
    }

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      align-items: center;
      gap: 6px;
      padding: 0.4rem 1.2rem !important;
      border: 1px solid rgba(220, 38, 38, 0.2) !important;
      background: rgba(255, 255, 255, 0.6) !important;
      backdrop-filter: blur(10px) !important;
      border-radius: 50px !important;
      font-size: 0.75rem !important; 
      font-weight: 600 !important;
      color: #dc2626 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      margin-bottom: 2rem !important;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.05) !important;
    }

    #ks-about-page-unique-wrapper .ks-pill-badge i {
      font-size: 1rem;
    }

    #ks-about-page-unique-wrapper .ks-hero-title {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(2.5rem, 6vw, 4rem) !important; 
      font-weight: 700 !important;
      line-height: 1.1 !important;
      margin-bottom: 1.2rem !important;
      color: #0f172a !important;
      letter-spacing: -0.02em !important;
    }

    #ks-about-page-unique-wrapper .ks-text-gradient {
      background: linear-gradient(270deg, #dc2626, #f43f5e, #f59e0b, #dc2626) !important;
      background-size: 300% 300% !important;
      animation: gradientShift 6s ease infinite !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      font-style: italic !important;
      padding-right: 0.1em !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-subtitle {
      font-size: clamp(1rem, 1.5vw, 1.2rem) !important; 
      color: #64748b !important;
      max-width: 550px !important;
      margin: 0 auto !important;
      line-height: 1.7 !important;
      font-weight: 400 !important;
    }

    /* --- PREMIUM HERO IMAGE --- */
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
      position: relative !important;
      width: 100% !important; 
      margin: 0 auto 4rem auto !important;
      border-radius: 30px !important;
      overflow: visible !important; 
      line-height: 0 !important; 
    }

    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper::after {
      content: '';
      position: absolute;
      top: 10%; left: 5%; right: 5%; bottom: -5%;
      background: inherit;
      filter: blur(25px);
      z-index: -1;
      opacity: 0.4;
      background-image: url(${HERO_IMAGE});
      background-size: cover;
    }

    #ks-about-page-unique-wrapper .ks-hero-img {
      width: 100% !important;
      height: 500px !important; 
      display: block !important;
      object-fit: cover !important; 
      object-position: center 25% !important; 
      border-radius: 30px !important;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important; 
      border: 1px solid rgba(255,255,255,0.4);
    }

    /* --- TYPOGRAPHY & CONTENT --- */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer {
      width: 100% !important;
      padding-bottom: 2rem !important; 
      text-align: left !important; 
    }

    #ks-about-page-unique-wrapper .ks-editorial-heading {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.6rem, 3vw, 2.2rem) !important; 
      color: #0f172a !important;
      margin: 3.5rem 0 1.5rem 0 !important;
      font-weight: 700 !important;
      position: relative;
      padding-bottom: 0.8rem !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-heading::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #dc2626, transparent);
      border-radius: 2px;
    }

    #ks-about-page-unique-wrapper .ks-editorial-body {
      font-size: 1.05rem !important; 
      line-height: 1.85 !important;
      color: #475569 !important;
      margin-bottom: 1.5rem !important;
    }

    /* --- PREMIUM FEATURE CARDS (GLASSMORPHISM) --- */
    #ks-about-page-unique-wrapper .ks-editorial-feature {
      display: flex !important;
      align-items: center !important;
      text-align: left !important;
      background: rgba(255, 255, 255, 0.7) !important; 
      backdrop-filter: blur(12px) !important;
      padding: 1.5rem !important;
      border-radius: 20px !important; 
      border: 1px solid rgba(255, 255, 255, 1) !important;
      margin-bottom: 1.2rem !important;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-feature:hover {
      box-shadow: 0 15px 35px rgba(220, 38, 38, 0.08) !important;
      transform: translateY(-5px) scale(1.01) !important;
      background: rgba(255, 255, 255, 0.95) !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-icon-wrapper {
      width: 45px !important;
      height: 45px !important;
      border-radius: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin-right: 1.5rem !important;
      flex-shrink: 0 !important;
      color: white !important;
      font-size: 1.3rem !important;
      transition: transform 0.3s ease;
    }

    #ks-about-page-unique-wrapper .ks-editorial-feature:hover .ks-feature-icon-wrapper {
      transform: rotate(8deg) scale(1.1);
    }

    #ks-about-page-unique-wrapper .ks-feature-text {
      font-size: 1rem !important; 
      color: #334155 !important;
      line-height: 1.6 !important;
      margin: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-title { 
      font-weight: 700 !important; 
      color: #0f172a !important; 
      font-size: 1.05rem !important;
    }

    /* --- BOTTOM IMAGE (FLOATING ANIMATION) --- */
    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
      width: 100% !important;
      max-width: 650px !important;
      margin: 4rem auto 6rem auto !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      animation: floating 6s ease-in-out infinite !important;
    }

    #ks-about-page-unique-wrapper .ks-bottom-img {
      width: 100% !important;
      height: auto !important;
      object-fit: contain !important;
      filter: drop-shadow(0 20px 30px rgba(0,0,0,0.1));
    }

    /* --- SHIMMER LOADER --- */
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    .ks-skeleton-pulse {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 1000px 100%;
      animation: shimmer 2s infinite linear;
      border-radius: 8px;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-hero-header { 
        padding: 4rem 0 2rem 0 !important; 
      }

      #ks-about-page-unique-wrapper .ks-pill-badge { 
        font-size: 0.65rem !important; 
        padding: 0.35rem 1rem !important; 
      }
      
      #ks-about-page-unique-wrapper .ks-hero-img {
        height: 300px !important; 
        border-radius: 20px !important;
      }
      
      #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
        border-radius: 20px !important;
      }

      #ks-about-page-unique-wrapper .ks-editorial-heading { 
        font-size: 1.4rem !important; 
        margin: 2rem 0 1.2rem 0 !important; 
      }

      #ks-about-page-unique-wrapper .ks-editorial-body { 
        font-size: 0.95rem !important; 
      }
      
      #ks-about-page-unique-wrapper .ks-editorial-feature { 
        padding: 1.2rem !important; 
        flex-direction: column !important;
        align-items: flex-start !important;
      }

      #ks-about-page-unique-wrapper .ks-feature-icon-wrapper {
        margin-bottom: 1rem !important;
      }

      #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
        margin: 2rem auto 4rem auto !important;
      }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <style>{internalStyles}</style>

      {/* Main Content Area */}
      <div className="ks-about-content">
        <header className="ks-hero-header reveal">
          <div className="ks-pill-badge">
            <i className="ri-sparkling-fill"></i> Our Journey
          </div>
          <h1 className="ks-hero-title">About <span className="ks-text-gradient">Us</span></h1>
          <p className="ks-hero-subtitle">
            Where Tradition Meets Modern Connection. Discover the story behind the platform that brings hearts together.
          </p>
        </header>

        {/* --- PREMIUM HERO IMAGE --- */}
        <div className="ks-hero-image-fullwidth-wrapper reveal">
          <img 
            src={HERO_IMAGE} 
            alt="Matrimony Discussion" 
            className="ks-hero-img" 
          />
        </div>

        <div className="ks-rich-text-renderer">
          {isLoading ? (
            <div className="ks-skeleton-container" style={{paddingTop: '2rem'}}>
              <div className="ks-skeleton-pulse" style={{height: '35px', width: '40%', marginBottom: '1.5rem'}}></div>
              <div className="ks-skeleton-pulse" style={{height: '18px', width: '100%', marginBottom: '0.8rem'}}></div>
              <div className="ks-skeleton-pulse" style={{height: '18px', width: '95%', marginBottom: '0.8rem'}}></div>
              <div className="ks-skeleton-pulse" style={{height: '18px', width: '80%', marginBottom: '3rem'}}></div>
              
              <div className="ks-skeleton-pulse" style={{height: '80px', width: '100%', marginBottom: '1rem', borderRadius: '20px'}}></div>
              <div className="ks-skeleton-pulse" style={{height: '80px', width: '100%', marginBottom: '1rem', borderRadius: '20px'}}></div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: pageContent }} />
          )}
        </div>

        {/* --- BOTTOM IMAGE COMPONENT --- */}
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
