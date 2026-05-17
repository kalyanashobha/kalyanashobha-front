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

    const fetchRefundContent = async () => {
      try {
        const response = await axios.get('https://kalyanashobha-back.vercel.app/api/pages/refund');

        if (response.data.success) {
          // DIRECTLY set the HTML content provided by the admin. 
          // Do not use regex to strip or replace tags!
          setContent(response.data.content || "<p>No content available.</p>");

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
        setContent("<p>Unable to load the Refund Policy at this time. Please try again later.</p>");
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
