import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Terms.css';
import Navbar from "./Navbar.jsx"; 

const Terms = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('March 2026');

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchTermsContent = async () => {
      try {
        const response = await axios.get('https://kalyanashobha-back.vercel.app/api/pages/terms');

        if (response.data.success) {
          // DIRECTLY set the HTML content provided by the admin. 
          // Do not use regex to strip or replace tags!
          setContent(response.data.content || "<p>No content available.</p>");

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
        setContent("<p>Unable to load Terms and Conditions at this time. Please try again later.</p>");
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
        <div className="pro-terms-header-banner">
          <div className="pro-terms-header-content">
            <h1 className="pro-terms-main-title">Terms and Conditions</h1>
            <p className="pro-terms-last-updated">Last updated: {lastUpdated}</p>
          </div>
        </div>

        <div className="pro-terms-body-container">
          <div className="pro-terms-paper-card">

            {loading ? (
              <div className="pro-terms-loader">
                <div className="pro-terms-skeleton skel-title"></div>
                <div className="pro-terms-skeleton"></div>
                <div className="pro-terms-skeleton"></div>
                <div className="pro-terms-skeleton skel-short"></div>
                <div className="pro-terms-skeleton" style={{marginTop: '2rem'}}></div>
                <div className="pro-terms-skeleton"></div>
              </div>
            ) : (
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
