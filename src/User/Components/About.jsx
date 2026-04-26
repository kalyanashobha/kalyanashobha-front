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

          // Premium App-Style SVG Icon for features
          const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

          const formattedHtml = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
              // Filters out 'About Us' and any 'Last updated' line
              if (line.toLowerCase() === 'about us' || line.toLowerCase().includes('last updated')) return '';

              const delay = (index * 0.05).toFixed(2);

              // Editorial Headings
              if (line.length < 35 && !line.match(/[.,!?]$/)) {
                return `<h2 class="ks-bento-heading reveal" style="transition-delay: ${delay}s">${line}</h2>`;
              }

              // Mini-Bento Feature Cards
              if (/^([A-Za-z\s]+)( [-–:] | to )/.test(line)) {
                let processedLine = line.replace(/^([A-Za-z\s]+)( [-–:] | to )/g, '<span class="ks-feature-title">$1</span><br/>');
                const currentColor = bulletColors[colorIndex % bulletColors.length];
                colorIndex++;

                return `
                  <div class="ks-mini-bento-feature reveal" style="transition-delay: ${delay}s">
                    <div class="ks-feature-icon-box" style="background: ${currentColor} !important;">
                      ${iconSvg}
                    </div>
                    <p class="ks-feature-text">${processedLine}</p>
                  </div>
                `;
              }

              // Standard Body Text
              return `<p class="ks-bento-body reveal" style="transition-delay: ${delay}s">${line}</p>`;
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
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Montserrat:wght@400;500;600;700&display=swap') !important;

    @keyframes floatApp {
      0% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-10px) scale(1.02); }
      100% { transform: translateY(0px) scale(1); }
    }

    @keyframes shimmerPill {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    #ks-about-page-unique-wrapper {
      position: relative !important;
      min-height: 100vh !important;
      background-color: #f4f5f7 !important; /* Premium App Dashboard Gray */
      font-family: 'Montserrat', sans-serif !important;
      color: #1a1a1a !important;
      overflow-x: hidden !important; 
      padding: 4rem 1.5rem !important; /* Master padding for the page */
    }

    /* --- BENTO GRID LAYOUT --- */
    #ks-about-page-unique-wrapper .ks-bento-container {
      max-width: 1150px !important; 
      margin: 0 auto !important;
      display: grid !important;
      grid-template-columns: repeat(12, 1fr) !important;
      gap: 1.5rem !important; /* Space between bento boxes */
      align-items: start !important;
    }

    /* Base style for all Bento Boxes */
    #ks-about-page-unique-wrapper .ks-bento-box {
      background: #ffffff !important;
      border-radius: 32px !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
      overflow: hidden !important;
      transition: transform 0.4s ease, box-shadow 0.4s ease !important;
    }
    
    #ks-about-page-unique-wrapper .ks-bento-box:hover {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06), 0 4px 10px rgba(0, 0, 0, 0.03) !important;
    }

    /* --- SPECIFIC BENTO BOX PLACEMENTS (DESKTOP) --- */
    
    /* 1. Header Box (Top Left) */
    #ks-about-page-unique-wrapper .ks-box-header {
      grid-column: 1 / 6 !important; /* Spans 5 columns */
      padding: 4rem 3rem !important;
      display: flex !important;
      flex-direction: column !important;
      justify-content: center !important;
      height: 100% !important;
      text-align: left !important;
    }

    /* 2. Hero Image Box (Top Right) */
    #ks-about-page-unique-wrapper .ks-box-hero-img {
      grid-column: 6 / 13 !important; /* Spans 7 columns */
      position: relative !important;
      min-height: 380px !important;
      height: 100% !important;
      padding: 0 !important; /* Image goes edge-to-edge inside the box */
    }

    #ks-about-page-unique-wrapper .ks-box-hero-img img {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      object-position: center 20% !important;
    }

    /* 3. Text Content Box (Bottom Left) */
    #ks-about-page-unique-wrapper .ks-box-content {
      grid-column: 1 / 8 !important; /* Spans 7 columns */
      padding: 3.5rem 3rem !important;
      text-align: left !important;
    }

    /* 4. App Image Box (Bottom Right - Sticky) */
    #ks-about-page-unique-wrapper .ks-box-app-img {
      grid-column: 8 / 13 !important; /* Spans 5 columns */
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
      padding: 4rem 2rem !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      position: sticky !important; /* Sticks while user reads content on the left */
      top: 2rem !important; 
    }

    #ks-about-page-unique-wrapper .ks-box-app-img img {
      width: 100% !important;
      max-width: 280px !important;
      height: auto !important;
      object-fit: contain !important;
      filter: drop-shadow(0 25px 40px rgba(0,0,0,0.12)) !important;
      animation: floatApp 7s ease-in-out infinite !important;
    }

    /* --- INNER BOX STYLING --- */
    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(20px) !important;
      transition: all 0.7s cubic-bezier(0.2, 1, 0.3, 1) !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.4rem 1.2rem !important;
      background: linear-gradient(90deg, #fff1f2, #ffe4e6, #fff1f2) !important;
      background-size: 200% 100% !important;
      animation: shimmerPill 3s infinite linear !important;
      border: 1px solid rgba(225, 29, 72, 0.15) !important;
      border-radius: 50px !important;
      font-size: 0.7rem !important; 
      font-weight: 700 !important;
      color: #e11d48 !important;
      text-transform: uppercase !important;
      letter-spacing: 1.5px !important;
      margin-bottom: 1.5rem !important;
      align-self: flex-start !important; /* Keeps it tight to text */
    }

    #ks-about-page-unique-wrapper .ks-hero-title {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(2.2rem, 4vw, 3.2rem) !important; 
      font-weight: 700 !important;
      line-height: 1.15 !important;
      margin-bottom: 1rem !important;
      color: #111 !important;
    }

    #ks-about-page-unique-wrapper .ks-text-gradient {
      background: linear-gradient(135deg, #e11d48, #f59e0b) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      font-style: italic !important;
      padding-right: 0.1em !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-subtitle {
      font-size: clamp(0.95rem, 1.1vw, 1.05rem) !important; 
      color: #64748b !important;
      line-height: 1.6 !important;
      font-weight: 500 !important;
      margin: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-bento-heading {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.4rem, 2vw, 1.8rem) !important; 
      color: #0f172a !important;
      margin: 2.5rem 0 1.2rem 0 !important;
      font-weight: 700 !important;
    }
    #ks-about-page-unique-wrapper .ks-bento-heading:first-child {
      margin-top: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-bento-body {
      font-size: 1rem !important; 
      line-height: 1.8 !important;
      color: #475569 !important;
      margin-bottom: 1.5rem !important;
    }

    /* Mini-Bento Feature Cards (Inside Content Box) */
    #ks-about-page-unique-wrapper .ks-mini-bento-feature {
      display: flex !important;
      align-items: flex-start !important;
      background: #f8fafc !important; /* Very subtle inner box gray */
      padding: 1.25rem 1.5rem !important;
      border-radius: 20px !important; 
      border: 1px solid #f1f5f9 !important;
      margin-bottom: 1rem !important;
      transition: all 0.2s ease !important;
    }

    #ks-about-page-unique-wrapper .ks-mini-bento-feature:hover {
      background: #ffffff !important;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04) !important;
      transform: translateY(-2px) !important;
      border-color: rgba(225, 29, 72, 0.1) !important;
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
      color: #64748b !important;
      line-height: 1.6 !important;
      margin: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-title { 
      font-weight: 700 !important; 
      color: #0f172a !important; 
      font-size: 1.05rem !important;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 992px) {
      #ks-about-page-unique-wrapper { padding: 2rem 1.2rem !important; }
      
      #ks-about-page-unique-wrapper .ks-bento-container {
        display: flex !important;
        flex-direction: column !important;
        gap: 1.2rem !important;
      }

      #ks-about-page-unique-wrapper .ks-bento-box {
        border-radius: 24px !important; /* Slightly tighter curves on mobile */
      }

      /* Stack elements elegantly */
      #ks-about-page-unique-wrapper .ks-box-header { 
        padding: 3rem 2rem !important; 
        text-align: center !important; 
        align-items: center !important;
      }

      #ks-about-page-unique-wrapper .ks-pill-badge { align-self: center !important; }
      
      #ks-about-page-unique-wrapper .ks-box-hero-img { 
        min-height: 280px !important; /* Shorter height for mobile to save space */
      }

      #ks-about-page-unique-wrapper .ks-box-content { 
        padding: 2.5rem 1.5rem !important; 
      }
      
      #ks-about-page-unique-wrapper .ks-box-app-img { 
        position: static !important; /* Remove sticky on mobile */
        padding: 3rem 1.5rem !important; 
      }

      #ks-about-page-unique-wrapper .ks-box-app-img img {
        max-width: 220px !important; /* Smaller app mock on mobile */
      }

      #ks-about-page-unique-wrapper .ks-bento-heading { font-size: 1.3rem !important; margin: 1.5rem 0 1rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-bento-body { font-size: 0.9rem !important; }
      #ks-about-page-unique-wrapper .ks-mini-bento-feature { padding: 1rem 1.2rem !important; }
      #ks-about-page-unique-wrapper .ks-feature-text { font-size: 0.85rem !important; }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <style>{internalStyles}</style>

      {/* --- MASTER BENTO GRID --- */}
      <div className="ks-bento-container">
        
        {/* Box 1: Header */}
        <div className="ks-bento-box ks-box-header reveal">
          <div className="ks-pill-badge">Our Journey</div>
          <h1 className="ks-hero-title">About <span className="ks-text-gradient">Us</span></h1>
          <p className="ks-hero-subtitle">
            Where Tradition Meets Modern Connection
          </p>
        </div>

        {/* Box 2: Hero Image */}
        <div className="ks-bento-box ks-box-hero-img reveal">
          <img 
            src={HERO_IMAGE} 
            alt="Matrimony Discussion" 
          />
        </div>

        {/* Box 3: Rich Text Content */}
        <div className="ks-bento-box ks-box-content">
          {isLoading ? (
            <div className="ks-skeleton-container">
              <div className="ks-skeleton-pulse" style={{height: '30px', width: '50%', marginBottom: '1rem', background: '#e2e8f0', borderRadius: '8px'}}></div>
              <div className="ks-skeleton-pulse" style={{height: '15px', width: '100%', marginBottom: '0.5rem', background: '#e2e8f0', borderRadius: '8px'}}></div>
              <div className="ks-skeleton-pulse" style={{height: '15px', width: '80%', marginBottom: '2rem', background: '#e2e8f0', borderRadius: '8px'}}></div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: pageContent }} />
          )}
        </div>

        {/* Box 4: App Image (Sticky) */}
        <div className="ks-bento-box ks-box-app-img reveal">
          <img 
            src={BOTTOM_IMAGE} 
            alt="App Interface Preview" 
          />
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
