import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Faq.css';
import Navbar from "./Navbar.jsx"; // Adjust the path if necessary

const Faq = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('March 2026');

  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);

    // Fetch dynamic content from the API
    const fetchFaqContent = async () => {
      try {
        const response = await axios.get('https://kalyanashobha-back.vercel.app/api/pages/faq');

        if (response.data.success) {
          // DIRECTLY set the HTML content provided by the admin. 
          // Do not use regex to strip or replace tags!
          setContent(response.data.content || "<p>No FAQs available.</p>");

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
        console.error("Failed to fetch FAQ:", error);
        setContent("<p>Unable to load the FAQs at this time. Please try again later.</p>");
      } finally {
        setLoading(false);
      }
    };

    fetchFaqContent();
  }, []);

  return (
    <>
      <Navbar />

      <main className="pro-faq-wrapper">
        {/* Premium Header Banner */}
        <div className="pro-faq-header-banner">
          <div className="pro-faq-header-content">
            <h1 className="pro-faq-main-title">Frequently Asked Questions</h1>
            <p className="pro-faq-subtitle">Find answers to common questions about KalyanaShobha.</p>
            <p className="pro-faq-last-updated">Last updated: {lastUpdated}</p>
          </div>
        </div>

        {/* Document Content */}
        <div className="pro-faq-body-container">
          <div className="pro-faq-paper-card">

            {loading ? (
              // Sleek loading state
              <div className="pro-faq-loader">
                <div className="pro-faq-skeleton skel-title"></div>
                <div className="pro-faq-skeleton"></div>
                <div className="pro-faq-skeleton"></div>
                <div className="pro-faq-skeleton skel-short"></div>

                <div className="pro-faq-skeleton skel-title" style={{marginTop: '2.5rem'}}></div>
                <div className="pro-faq-skeleton"></div>
                <div className="pro-faq-skeleton"></div>
              </div>
            ) : (
              // Dynamic HTML rendering wrapper
              <div 
                className="pro-faq-rich-text" 
                dangerouslySetInnerHTML={{ __html: content }} 
              />
            )}

          </div>
        </div>
      </main>
    </>
  );
};

export default Faq;
