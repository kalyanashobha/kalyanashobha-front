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

          const formattedHtml = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
              // Filters out 'About Us' and any 'Last updated' line
              if (line.toLowerCase() === 'about us' || line.toLowerCase().includes('last updated')) return '';

              const delay = (index * 0.08).toFixed(2);

              // Headings identified as dynamically rendered will now use the gradient style
              if (line.length < 35 && !line.match(/[.,!?]$/)) {
                return `<h2 class="ks-editorial-heading reveal" style="transition-delay: ${delay}s">${line}</h2>`;
              }

              // Feature Cards (List items) will remain visually clean card elements with red dots
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
      background-color: #fcfcfc !important; /* Gentle off-white background */
      font-family: 'Montserrat', sans-serif !important;
      color: #1a1a1a !important;
      text-align: center !important;
      overflow-x: hidden !important; 
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

    /* --- ANIMATIONS --- */
    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(20px) !important;
      transition: all 0.7s cubic-bezier(0.2, 1, 0.3, 1) !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* --- HERO HEADER --- */
    #ks-about-page-unique-wrapper .ks-hero-header { 
      padding: 4rem 0 2rem 0 !important; 
    }

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.35rem 1rem !important;
      border: 1px solid rgba(220, 38, 38, 0.3) !important;
      background: rgba(255, 255, 255, 0.8) !important;
      backdrop-filter: blur(4px) !important;
      border-radius: 50px !important;
      font-size: 0.65rem !important; 
      font-weight: 600 !important;
      color: #dc2626 !important;
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

    /* Unique gradient for "Us" */
    #ks-about-page-unique-wrapper .ks-text-gradient {
      background: linear-gradient(135deg, #dc2626, #f59e0b) !important;
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

    /* --- FULL WIDTH HERO IMAGE WITH GRADIENT BLENDS --- */
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
      position: relative !important;
      width: 100vw !important; /* Forces full width of the screen */
      max-width: 100vw !important;
      margin-left: calc(-50vw + 50%) !important; /* Breaks out of the parent container */
      margin-right: calc(-50vw + 50%) !important;
      margin-bottom: 3rem !important;
      line-height: 0 !important; /* removes bottom gap */
    }

    /* Top and Bottom Gradient Edge Blenders */
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper::before,
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper::after {
      content: '' !important;
      position: absolute !important;
      left: 0 !important;
      right: 0 !important;
      height: 8px !important; 
      z-index: 2 !important;
      pointer-events: none !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper::before {
      top: 0 !important;
      background: linear-gradient(to bottom, #fcfcfc 0%, rgba(252,252,252,0) 100%) !important; 
    }

    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper::after {
      bottom: 0 !important;
      background: linear-gradient(to top, #fcfcfc 0%, rgba(252,252,252,0) 100%) !important; 
    }

    #ks-about-page-unique-wrapper .ks-hero-img {
      width: 100% !important;
      height: auto !important;
      max-height: 60vh !important;
      display: block !important;
      object-fit: cover !important; 
      object-position: center !important;
    }

    /* --- TYPOGRAPHY & CONTENT --- */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer {
      width: 100% !important;
      max-width: 800px !important;
      padding-bottom: 2rem !important; 
      text-align: left !important; 
    }

    /* ALL Headings now use the exact same Red/Amber Yellow gradient as "Us" */
    #ks-about-page-unique-wrapper .ks-editorial-heading {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.4rem, 2.5vw, 1.8rem) !important; 
      background: linear-gradient(135deg, #dc2626, #f59e0b) !important;
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

    /* --- PREMIUM FEATURE CARDS --- */
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
      border-color: rgba(225, 29, 72, 0.15) !important;
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

    /* --- BOTTOM IMAGE WAPPER --- */
    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
      width: 100% !important;
      max-width: 700px !important; /* Constrained width so the mobile mockup doesn't stretch too wide */
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

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-hero-header { 
        padding: 3rem 0 1.5rem 0 !important; 
        text-align: center !important; 
      }

      #ks-about-page-unique-wrapper .ks-pill-badge { font-size: 0.6rem !important; padding: 0.3rem 0.8rem !important; }
      
      /* Reduced Mobile Font Sizes */
      #ks-about-page-unique-wrapper .ks-hero-title { font-size: 2rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-subtitle { font-size: 0.85rem !important; }
      #ks-about-page-unique-wrapper .ks-editorial-heading { font-size: 1.15rem !important; margin: 1.5rem 0 1rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-editorial-body { font-size: 0.85rem !important; }
      #ks-about-page-unique-wrapper .ks-feature-text { font-size: 0.8rem !important; }
      
      #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
        margin-bottom: 2rem !important;
      }
      
      #ks-about-page-unique-wrapper .ks-editorial-feature { padding: 1rem 1.2rem !important; }
      #ks-about-page-unique-wrapper .ks-about-content { padding: 0 1.25rem !important; }

      #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
        margin: 1.5rem auto 4rem auto !important;
      }
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

        {/* --- FULL WIDTH HERO IMAGE WITH GRADIENT BLENDING EDGES --- */}
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
