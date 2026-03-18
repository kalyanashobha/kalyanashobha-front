import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Refund.css';
import Navbar from "./Navbar.jsx"; // Adjust path if needed

const Refund = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('March 2026');

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    // Fetch dynamic content from the API (Updated to /refund)
    const fetchRefundContent = async () => {
      try {
        const response = await axios.get('https://kalyanashobha-back.vercel.app/api/pages/refund');
        
        if (response.data.success) {
          
          let rawText = response.data.content;

          // --- AGGRESSIVE MAGIC FIXES FOR PLAIN TEXT ---
          
          // 0. Normalize invisible line breaks from the database
          rawText = rawText.replace(/\r\n/g, '\n');

          // 1. Clean up massive gaps: Reduces 3+ empty lines down to just 2.
          rawText = rawText.replace(/\n{3,}/g, '\n\n');

          // 2. Bold Key Terms: Automatically finds "Cancellation:", "Refunds:", etc., and makes them bold.
          rawText = rawText.replace(/(^|\n)([A-Z][a-zA-Z\s]+):/g, '$1<strong>$2:</strong>');

          // 3. Ultra-Aggressive Heading Scanner: 
          // Forces ANY line starting with a number and a dot to be an <h2>.
          const formattedText = rawText.replace(/^(\s*\d+\.\s*.*)$/gm, '<h2 class="pro-refund-h2">$1</h2>');
          
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
        console.error("Failed to fetch Refund Policy:", error);
        setContent("Unable to load the Refund Policy at this time. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRefundContent();
  }, []);

  return (
    <>
      <Navbar />

      <main className="pro-refund-wrapper">
        {/* Premium Header Banner */}
        <div className="pro-refund-header-banner">
          <div className="pro-refund-header-content">
            <h1 className="pro-refund-main-title">Refund Policy</h1>
            <p className="pro-refund-last-updated">Last updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Document Content */}
        <div className="pro-refund-body-container">
          <div className="pro-refund-paper-card">
            
            {loading ? (
              // Sleek loading state
              <div className="pro-refund-loader">
                <div className="pro-refund-skeleton skel-title"></div>
                <div className="pro-refund-skeleton"></div>
                <div className="pro-refund-skeleton"></div>
                <div className="pro-refund-skeleton skel-short"></div>
                <div className="pro-refund-skeleton" style={{marginTop: '2rem'}}></div>
                <div className="pro-refund-skeleton"></div>
              </div>
            ) : (
              // Dynamic HTML rendering wrapper
              <div 
                className="pro-refund-rich-text" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}

          </div>
        </div>
      </main>
    </>
  );
};

export default Refund;
