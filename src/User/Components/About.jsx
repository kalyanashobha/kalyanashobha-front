import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { HeartHandshake, Sparkles, Gem } from 'lucide-react';
import Navbar from "./Navbar.jsx"; // Adjust the path if necessary

// ==========================================
// UPDATE YOUR IMAGE LINKS HERE
// ==========================================
const OLD_DESKTOP_BG = 'https://res.cloudinary.com/dppiuypop/image/upload/v1772885504/uploads/utm0yfy95zgrber54m2k.png';
const NEW_DESKTOP_BG = 'https://res.cloudinary.com/dppiuypop/image/upload/v1772889701/uploads/ys2i1n2qp8o4i4mjf7e9.png';

const OLD_MOBILE_BG = 'https://res.cloudinary.com/dppiuypop/image/upload/v1772885426/uploads/jcamdhvitkbvy1wk5fxm.png';
const NEW_MOBILE_BG = 'https://res.cloudinary.com/dppiuypop/image/upload/v1772889749/uploads/pjdgq24tu5kbmaqlchiz.png';
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
          // DIRECTLY set the HTML content provided by the admin. 
          setPageContent(response.data.content || "<p>No content available.</p>");
        }
      } catch (error) {
        setPageContent("<p class='ks-error-text'>Unable to load content.</p>");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Animation Trigger logic (Updated to target standard HTML tags)
  useEffect(() => {
    if (isLoading || !pageContent) return;

    // Find the wrapper containing the injected HTML
    const wrapper = document.querySelector('.ks-rich-text-content');
    if (!wrapper) return;

    // Grab all direct children (h2, p, ul, etc.)
    const items = wrapper.children;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    Array.from(items).forEach((item, index) => {
      item.classList.add('reveal');
      // Calculate stagger delay, maxing out at 1.5s
      const delay = Math.min(index * 0.1, 1.5).toFixed(2);
      item.style.transitionDelay = `${delay}s`;
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [pageContent, isLoading]);

  const internalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Montserrat:wght@300;400;600&display=swap') !important;

    /* BY PREFIXING THE ID, WE GUARANTEE ZERO BLEEDING TO OTHER PAGES */
    #ks-about-page-unique-wrapper {
      position: relative !important;
      min-height: 100vh !important;
      background-color: #ffffff !important; 
      font-family: 'Montserrat', sans-serif !important;
      color: #1a1a1a !important;
      text-align: center !important;
      overflow: hidden !important; 
    }

    /* --- TOP DESKTOP BACKGROUND --- */
    #ks-about-page-unique-wrapper .ks-about-bg-desktop {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100vh !important; 
      z-index: 0 !important;
      pointer-events: none !important;
      background-image: url('${OLD_DESKTOP_BG}') !important;
      background-size: cover !important;
      background-position: center right !important;
      background-repeat: no-repeat !important;
    }

    #ks-about-page-unique-wrapper .ks-about-overlay-desktop {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100vh !important;
      z-index: 1 !important;
      pointer-events: none !important;
      background: linear-gradient(to right, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.85) 40%, rgba(255, 255, 255, 0.2) 100%),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 1) 100%) !important;
    }

    /* --- BOTTOM DESKTOP BACKGROUND --- */
    #ks-about-page-unique-wrapper .ks-about-bottom-bg-desktop {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 90vh !important; 
      z-index: 0 !important;
      pointer-events: none !important;
      background-image: url('${NEW_DESKTOP_BG}') !important;
      background-size: cover !important;
      background-position: center left !important;
      background-repeat: no-repeat !important;
    }

    #ks-about-page-unique-wrapper .ks-about-bottom-overlay-desktop {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 90vh !important;
      z-index: 1 !important;
      pointer-events: none !important;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.1) 100%) !important;
    }

    /* Hide Mobile Elements on Desktop */
    #ks-about-page-unique-wrapper .ks-about-bg-mobile,
    #ks-about-page-unique-wrapper .ks-about-overlay-mobile,
    #ks-about-page-unique-wrapper .ks-about-bottom-bg-mobile,
    #ks-about-page-unique-wrapper .ks-about-bottom-overlay-mobile { display: none !important; }

    /* --- CONTENT ON TOP --- */
    #ks-about-page-unique-wrapper .ks-about-content {
      position: relative !important;
      z-index: 10 !important;
      max-width: 1000px !important;
      margin: 0 auto !important;
      padding: 0 2rem !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    /* Animation Classes */
    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(30px) !important;
      transition: all 0.8s cubic-bezier(0.2, 1, 0.3, 1) !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-header { padding: 8rem 0 4rem 0 !important; margin-top: 40px !important;}

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.4rem 1rem !important;
      border: 1px solid #dc2626 !important;
      border-radius: 50px !important;
      font-size: 0.7rem !important;
      font-weight: 600 !important;
      color: #dc2626 !important;
      text-transform: uppercase !important;
      letter-spacing: 2px !important;
      margin-bottom: 2rem !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-title {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(2.5rem, 5vw, 4.5rem) !important;
      line-height: 1.1 !important;
      margin-bottom: 1.5rem !important;
    }

    #ks-about-page-unique-wrapper .ks-text-gradient {
      background: linear-gradient(135deg, #dc2626, #f59e0b) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      font-style: italic !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-subtitle {
      font-size: clamp(0.9rem, 1.2vw, 1.1rem) !important;
      color: #666 !important;
      max-width: 650px !important;
      line-height: 1.7 !important;
    }

    /* --- RICH TEXT RENDERER SCOPED STYLES (Standard HTML Tags) --- */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer {
      width: 100% !important;
      max-width: 800px !important;
      padding-bottom: 30vh !important;
      text-align: center !important;
    }

    #ks-about-page-unique-wrapper .ks-rich-text-renderer h2 {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.8rem, 3vw, 2.5rem) !important;
      margin: 4rem 0 1.5rem 0 !important;
      color: #1a1a1a !important;
    }

    #ks-about-page-unique-wrapper .ks-rich-text-renderer h3 {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.4rem, 2vw, 1.8rem) !important;
      margin: 2.5rem 0 1rem 0 !important;
      color: #1a1a1a !important;
    }

    #ks-about-page-unique-wrapper .ks-rich-text-renderer p {
      font-size: clamp(0.95rem, 1.1vw, 1.05rem) !important;
      line-height: 1.9 !important;
      color: #444 !important;
      margin-bottom: 1.5rem !important;
    }

    #ks-about-page-unique-wrapper .ks-rich-text-renderer strong {
      color: #111 !important;
      font-weight: 600 !important;
    }

    /* Styled Lists to replace your old manual feature boxes */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer ul {
      list-style: none !important;
      padding: 0 !important;
      margin: 2rem 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-rich-text-renderer li {
      display: flex !important;
      text-align: left !important;
      background: rgba(255, 255, 255, 0.9) !important; 
      backdrop-filter: blur(5px) !important;
      padding: 1.2rem 1.5rem !important;
      border-radius: 12px !important;
      border: 1px solid rgba(0, 0, 0, 0.05) !important;
      margin-bottom: 1rem !important;
      align-items: center !important;
      transition: all 0.3s ease !important;
      color: #444 !important;
      font-size: clamp(0.95rem, 1.1vw, 1.05rem) !important;
    }

    #ks-about-page-unique-wrapper .ks-rich-text-renderer li:hover {
      box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important;
      transform: scale(1.02) !important;
    }

    /* Creates the custom bullet point dot */
    #ks-about-page-unique-wrapper .ks-rich-text-renderer li::before {
      content: '' !important;
      display: inline-block !important;
      width: 10px !important;
      height: 10px !important;
      border-radius: 50% !important;
      margin-right: 1.2rem !important;
      flex-shrink: 0 !important;
      background: linear-gradient(135deg, #dc2626, #f59e0b) !important;
    }

    /* Skeletons */
    #ks-about-page-unique-wrapper .ks-skeleton-container {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      gap: 1.5rem !important;
      width: 100% !important;
    }

    #ks-about-page-unique-wrapper .ks-skeleton-pulse {
      height: 1.5rem !important;
      background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%) !important;
      background-size: 200% 100% !important;
      animation: pulseLoad 2s infinite ease-in-out !important;
      border-radius: 4px !important;
    }
    
    #ks-about-page-unique-wrapper .ks-skel-title { height: 3rem !important; width: 50% !important; margin-bottom: 1rem !important; }
    #ks-about-page-unique-wrapper .ks-skel-full { width: 100% !important; }

    @keyframes pulseLoad {
      0% { background-position: 200% 0 !important; }
      100% { background-position: -200% 0 !important; }
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-about-bg-desktop,
      #ks-about-page-unique-wrapper .ks-about-overlay-desktop,
      #ks-about-page-unique-wrapper .ks-about-bottom-bg-desktop,
      #ks-about-page-unique-wrapper .ks-about-bottom-overlay-desktop { display: none !important; }
      
      #ks-about-page-unique-wrapper .ks-about-bg-mobile {
        display: block !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 60vh !important; 
        background-image: url('${OLD_MOBILE_BG}') !important;
        background-size: cover !important;
        background-position: center center !important; 
        z-index: 0 !important;
      }
      
      #ks-about-page-unique-wrapper .ks-about-overlay-mobile {
        display: block !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 60vh !important;
        z-index: 1 !important;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.5) 70%, #ffffff 100%) !important;
      }

      #ks-about-page-unique-wrapper .ks-about-bottom-bg-mobile {
        display: block !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 70vh !important;
        z-index: 0 !important;
        background-image: url('${NEW_MOBILE_BG}') !important;
        background-size: cover !important;
        background-position: center bottom !important; 
      }

      #ks-about-page-unique-wrapper .ks-about-bottom-overlay-mobile {
        display: block !important;
        position: absolute !important;
        bottom: 0 !important;
        left: 0 !important;
        width: 100% !important;
        height: 70vh !important;
        z-index: 1 !important;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.7) 40%, rgba(255, 255, 255, 0) 100%) !important;
      }

      /* --- REDUCED MOBILE FONTS --- */
      #ks-about-page-unique-wrapper .ks-hero-title { font-size: 2.2rem !important; }
      #ks-about-page-unique-wrapper .ks-hero-subtitle { font-size: 0.85rem !important; line-height: 1.5 !important; }

      /* Mobile Headings */
      #ks-about-page-unique-wrapper .ks-rich-text-renderer h2 { margin: 2.5rem 0 1rem 0 !important; font-size: 1.4rem !important; text-align: left !important; }
      #ks-about-page-unique-wrapper .ks-rich-text-renderer h3 { margin: 1.5rem 0 0.5rem 0 !important; font-size: 1.1rem !important; text-align: left !important; }

      /* Mobile Body Text */
      #ks-about-page-unique-wrapper .ks-rich-text-renderer p { font-size: 0.85rem !important; line-height: 1.6 !important; text-align: left !important; }
      
      /* Mobile List Adjustments */
      #ks-about-page-unique-wrapper .ks-rich-text-renderer li {
        font-size: 0.85rem !important;
        line-height: 1.5 !important;
        padding: 1rem !important;
      }

      /* Layout adjustments */
      #ks-about-page-unique-wrapper .ks-hero-header { padding: 6rem 0 3rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-pill-badge { font-size: 0.6rem !important; padding: 0.3rem 0.8rem !important; }
      #ks-about-page-unique-wrapper .ks-about-content { padding: 0 1.2rem !important; }
      #ks-about-page-unique-wrapper { text-align: left !important; } 
      #ks-about-page-unique-wrapper .ks-rich-text-renderer { align-items: flex-start !important; padding-bottom: 30vh !important; }
      #ks-about-page-unique-wrapper .ks-skeleton-container { align-items: flex-start !important; }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <Navbar />
      <style>{internalStyles}</style>

      {/* Top Background elements */}
      <div className="ks-about-bg-desktop"></div>
      <div className="ks-about-overlay-desktop"></div>
      <div className="ks-about-bg-mobile"></div>
      <div className="ks-about-overlay-mobile"></div>

      {/* Bottom Background elements */}
      <div className="ks-about-bottom-bg-desktop"></div>
      <div className="ks-about-bottom-overlay-desktop"></div>
      <div className="ks-about-bottom-bg-mobile"></div>
      <div className="ks-about-bottom-overlay-mobile"></div>

      {/* Main Content */}
      <div className="ks-about-content">
        <header className="ks-hero-header reveal">
          <div className="ks-pill-badge">Our Journey</div>
          <h1 className="ks-hero-title">About <span className="ks-text-gradient">Us</span></h1>
          <p className="ks-hero-subtitle">
            Where Tradition Meets Modern Connection
          </p>
        </header>

        <div className="ks-rich-text-renderer">
          {isLoading ? (
            <div className="ks-skeleton-container">
              <div className="ks-skeleton-pulse ks-skel-title"></div>
              <div className="ks-skeleton-pulse ks-skel-full"></div>
              <div className="ks-skeleton-pulse ks-skel-full"></div>
            </div>
          ) : (
            <div 
              className="ks-rich-text-content" 
              dangerouslySetInnerHTML={{ __html: pageContent }} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
