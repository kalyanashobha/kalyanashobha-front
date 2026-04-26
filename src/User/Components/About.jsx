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
          
          const formattedHtml = rawText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index) => {
              if (line.toLowerCase() === 'about us' || line.toLowerCase().includes('last updated')) return '';

              const delay = (index * 0.05).toFixed(2);

              if (line.length < 35 && !line.match(/[.,!?]$/)) {
                return `<h2 class="ks-editorial-heading reveal" style="transition-delay: ${delay}s">${line}</h2>`;
              }

              // Ultra-clean corporate left-border feature cards
              if (/^([A-Za-z\s]+)( [-–:] | to )/.test(line)) {
                let processedLine = line.replace(/^([A-Za-z\s]+)( [-–:] | to )/g, '<span class="ks-feature-title">$1</span><br/>');

                return `
                  <div class="ks-editorial-feature reveal" style="transition-delay: ${delay}s">
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
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const items = document.querySelectorAll('.reveal');
    items.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, [pageContent, isLoading]);

  const internalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600;700&display=swap') !important;

    #ks-about-page-unique-wrapper {
      position: relative !important;
      min-height: 100vh !important;
      background-color: #f3f4f6 !important; /* Slightly darker cool gray to make the white card pop */
      font-family: 'Inter', sans-serif !important; /* Switched to Inter for that sharp tech SaaS look */
      color: #111827 !important;
      text-align: center !important;
      overflow-x: hidden !important; 
    }

    /* --- HERO HEADER --- */
    #ks-about-page-unique-wrapper .ks-hero-header { 
      padding: 5rem 1.5rem 3rem 1.5rem !important; 
      max-width: 800px !important;
      margin: 0 auto !important;
    }

    #ks-about-page-unique-wrapper .ks-pill-badge {
      display: inline-flex !important;
      padding: 0.35rem 1rem !important;
      background: rgba(220, 38, 38, 0.1) !important;
      border-radius: 6px !important; /* Sharp corners, not a pill */
      font-size: 0.7rem !important; 
      font-weight: 700 !important;
      color: #dc2626 !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      margin-bottom: 1.5rem !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-title {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(2.5rem, 6vw, 4rem) !important; 
      font-weight: 700 !important;
      line-height: 1.1 !important;
      margin-bottom: 1.2rem !important;
      color: #111827 !important;
      letter-spacing: -0.02em !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-subtitle {
      font-size: clamp(1rem, 1.2vw, 1.15rem) !important; 
      color: #4b5563 !important;
      line-height: 1.6 !important;
      font-weight: 400 !important;
    }

    /* --- CINEMATIC HERO IMAGE --- */
    #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
      position: relative !important;
      width: 100% !important; 
      max-width: 1400px !important; /* Goes very wide on desktop */
      margin: 0 auto !important;
      padding: 0 1.5rem !important;
      z-index: 1 !important;
    }

    #ks-about-page-unique-wrapper .ks-hero-img {
      width: 100% !important;
      height: 500px !important; 
      display: block !important;
      object-fit: cover !important; 
      object-position: center 25% !important; 
      border-radius: 20px !important;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03) !important;
    }

    /* --- THE OVERLAP CARD (This is the magic part) --- */
    #ks-about-page-unique-wrapper .ks-overlap-card {
      position: relative !important;
      z-index: 10 !important; 
      max-width: 850px !important; 
      margin: -120px auto 5rem auto !important; /* Pulls the content up OVER the image */
      background: #ffffff !important;
      border-radius: 24px !important;
      padding: 4rem 4rem !important;
      box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.04) !important;
      border: 1px solid rgba(243, 244, 246, 1) !important;
      text-align: left !important;
    }

    /* Scroll Reveal Animation */
    #ks-about-page-unique-wrapper .reveal {
      opacity: 0 !important;
      transform: translateY(20px) !important;
      transition: opacity 0.6s ease-out, transform 0.6s ease-out !important;
    }
    #ks-about-page-unique-wrapper .reveal.active {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* --- TYPOGRAPHY & CONTENT --- */
    #ks-about-page-unique-wrapper .ks-editorial-heading {
      font-family: 'Playfair Display', serif !important;
      font-size: clamp(1.5rem, 2.5vw, 2rem) !important; 
      color: #111827 !important;
      margin: 3.5rem 0 1.2rem 0 !important;
      font-weight: 700 !important;
      border-bottom: 2px solid #f3f4f6 !important;
      padding-bottom: 0.8rem !important;
    }
    
    #ks-about-page-unique-wrapper .ks-editorial-heading:first-child {
      margin-top: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-body {
      font-size: 1.05rem !important; 
      line-height: 1.8 !important;
      color: #374151 !important;
      margin-bottom: 1.5rem !important;
    }

    /* --- ENTERPRISE FEATURE CARDS --- */
    #ks-about-page-unique-wrapper .ks-editorial-feature {
      background: #f9fafb !important; 
      padding: 1.2rem 1.5rem !important;
      border-radius: 8px !important; /* Sharper corners */
      border-left: 4px solid #dc2626 !important; /* Signature Corporate Stripe */
      margin-bottom: 1rem !important;
      transition: transform 0.2s ease !important;
    }

    #ks-about-page-unique-wrapper .ks-editorial-feature:hover {
      transform: translateX(5px) !important;
      background: #f3f4f6 !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-text {
      font-size: 0.95rem !important; 
      color: #4b5563 !important;
      line-height: 1.6 !important;
      margin: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-feature-title { 
      font-weight: 700 !important; 
      color: #111827 !important; 
      font-size: 1rem !important;
    }

    /* --- BOTTOM OFFSET IMAGE --- */
    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper {
      position: relative !important;
      width: 100% !important;
      max-width: 600px !important;
      margin: 4rem auto 1rem auto !important;
    }

    /* Geometric Background Accent Square */
    #ks-about-page-unique-wrapper .ks-bottom-image-wrapper::before {
      content: '' !important;
      position: absolute !important;
      top: 15px !important;
      left: -15px !important;
      width: 100% !important;
      height: 100% !important;
      background: #fef3c7 !important; /* Subtle amber offset */
      border-radius: 16px !important;
      z-index: 0 !important;
    }

    #ks-about-page-unique-wrapper .ks-bottom-img {
      position: relative !important;
      z-index: 1 !important;
      width: 100% !important;
      height: auto !important;
      object-fit: cover !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
    }

    /* --- MOBILE OPTIMIZATION --- */
    @media (max-width: 768px) {
      #ks-about-page-unique-wrapper .ks-hero-header { 
        padding: 4rem 1.25rem 2rem 1.25rem !important; 
      }

      #ks-about-page-unique-wrapper .ks-hero-image-fullwidth-wrapper {
        padding: 0 !important; /* Edge to edge on mobile looks better for the overlap */
      }

      #ks-about-page-unique-wrapper .ks-hero-img {
        height: 320px !important; 
        border-radius: 0 !important; /* Flat edges on mobile */
      }

      #ks-about-page-unique-wrapper .ks-overlap-card {
        margin: -80px 1.25rem 4rem 1.25rem !important; /* Pull up less on mobile, keep side margins */
        padding: 2.5rem 1.5rem !important;
        border-radius: 16px !important;
      }

      #ks-about-page-unique-wrapper .ks-editorial-heading { font-size: 1.4rem !important; margin: 2.5rem 0 1rem 0 !important; }
      #ks-about-page-unique-wrapper .ks-editorial-body { font-size: 0.95rem !important; }
      #ks-about-page-unique-wrapper .ks-feature-text { font-size: 0.9rem !important; }
      
      #ks-about-page-unique-wrapper .ks-bottom-image-wrapper { 
        width: 85% !important;
        margin: 3rem auto 1rem auto !important; 
      }
      #ks-about-page-unique-wrapper .ks-bottom-image-wrapper::before {
        top: 10px !important;
        left: -10px !important;
      }
    }
  `;

  return (
    <div id="ks-about-page-unique-wrapper">
      <style>{internalStyles}</style>

      {/* Clean, authoritative Header */}
      <header className="ks-hero-header reveal">
        <div className="ks-pill-badge">Our Journey</div>
        <h1 className="ks-hero-title">About Us</h1>
        <p className="ks-hero-subtitle">
          Where Tradition Meets Modern Connection.
        </p>
      </header>

      {/* --- CINEMATIC HERO IMAGE --- */}
      <div className="ks-hero-image-fullwidth-wrapper reveal">
        <img 
          src={HERO_IMAGE} 
          alt="Matrimony Discussion" 
          className="ks-hero-img" 
        />
      </div>

      {/* --- OVERLAPPING CONTENT CARD --- */}
      <div className="ks-overlap-card">
        <div className="ks-rich-text-renderer">
          {isLoading ? (
            <div className="ks-skeleton-container">
              <div className="ks-skeleton-pulse ks-skel-title" style={{height: '35px', width: '40%', marginBottom: '1.5rem', background: '#e5e7eb', borderRadius: '6px'}}></div>
              <div className="ks-skeleton-pulse ks-skel-full" style={{height: '16px', width: '100%', marginBottom: '0.8rem', background: '#f3f4f6', borderRadius: '4px'}}></div>
              <div className="ks-skeleton-pulse ks-skel-full" style={{height: '16px', width: '90%', marginBottom: '0.8rem', background: '#f3f4f6', borderRadius: '4px'}}></div>
              <div className="ks-skeleton-pulse ks-skel-full" style={{height: '16px', width: '75%', marginBottom: '2.5rem', background: '#f3f4f6', borderRadius: '4px'}}></div>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: pageContent }} />
          )}
        </div>

        {/* --- BOTTOM OFFSET IMAGE --- */}
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
