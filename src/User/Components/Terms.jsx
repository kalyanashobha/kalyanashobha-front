import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Terms.css';
import Navbar from "./Navbar.jsx"; // Adjust path if needed

const Terms = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('March 2026');

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    // Fetch dynamic content from the API
    const fetchTermsContent = async () => {
      try {
        const response = await axios.get('https://kalyanashobha-back.vercel.app/api/pages/terms');
        
        if (response.data.success) {
          
          let rawText = response.data.content;

          // 0. DESTROY HIDDEN HTML
          rawText = rawText.replace(/<br\s*\/?>/gi, '\n');
          rawText = rawText.replace(/<\/?p>/gi, '\n\n');
          rawText = rawText.replace(/<[^>]+>/g, ''); // Strips any other leftover tags
          rawText = rawText.replace(/&nbsp;/gi, ' ');

          // 1. Normalize line breaks and clean up massive gaps
          rawText = rawText.replace(/\r\n/g, '\n');
          rawText = rawText.replace(/\n{3,}/g, '\n\n');

          // 2. Bold Key Terms
          rawText = rawText.replace(/(^|\n|\s)([A-Z][a-zA-Z\s]+):/g, '$1<strong>$2:</strong>');

          // 3. Bulletproof Heading Scanner: Uses the new CSS class
          const formattedText = rawText.replace(/^\s*(\d+\.\s+[^\n]+)/gm, '<h2 class="pro-terms-h2">$1</h2>');
          
          setContent(formattedText);
          
          // Format the date if it exists
          if (response.data.lastUpdated) {
            const dateObj = new Date(response.data.lastUpdated);
            setLastUpdated(dateObj.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch Terms and Conditions:", error);
        setContent("Unable to load Terms and Conditions at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTermsContent();
  }, []);

  return (
    <>
      <Navbar />

      <main className="pro-terms-wrapper">
        {/* Premium Header Banner */}
        <div className="pro-terms-header-banner">
          <div className="pro-terms-header-content">
            <h1 className="pro-terms-main-title">Terms and Conditions</h1>
            <p className="pro-terms-last-updated">Last updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Document Content */}
        <div className="pro-terms-body-container">
          <div className="pro-terms-paper-card">
            
            {loading ? (
              // Sleek loading state
              <div className="pro-terms-loader">
                <div className="pro-terms-skeleton skel-title"></div>
                <div className="pro-terms-skeleton"></div>
                <div className="pro-terms-skeleton"></div>
                <div className="pro-terms-skeleton skel-short"></div>
                <div className="pro-terms-skeleton" style={{marginTop: '2rem'}}></div>
                <div className="pro-terms-skeleton"></div>
              </div>
            ) : (
              // Dynamic HTML rendering wrapper
              <div 
                className="pro-terms-rich-text" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}

          </div>
        </div>
      </main>
    </>
  );
};

export default Terms;
