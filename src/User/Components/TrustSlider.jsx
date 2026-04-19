import React from 'react';
import { 
  FiShield, FiMail, FiLock, FiUserCheck, FiUsers, 
  FiSearch, FiSlash, FiImage, FiHeadphones, FiAlertCircle, 
  FiMessageSquare, FiUserMinus, FiBookOpen, FiHeart, FiKey, 
  FiFileText, FiXOctagon, FiAward, FiActivity, FiInbox, 
  FiMonitor, FiCheckCircle 
} from 'react-icons/fi';

const TrustSlider = () => {
  // 22 Unique trust and security features, focusing on Email & Privacy
  const trustFeatures = [
    { text: "100% Verified Profiles", icon: <FiUserCheck /> },
    { text: "Email Authenticated", icon: <FiMail /> },
    { text: "Strict Privacy Controls", icon: <FiLock /> },
    { text: "Secure Data Encryption", icon: <FiShield /> },
    { text: "Dedicated RM Support", icon: <FiUsers /> },
    { text: "Manual Profile Screening", icon: <FiSearch /> },
    { text: "Anti-Spam Protection", icon: <FiSlash /> },
    { text: "Photo Privacy Options", icon: <FiImage /> },
    { text: "24/7 Customer Support", icon: <FiHeadphones /> },
    { text: "Fraud Detection System", icon: <FiAlertCircle /> },
    { text: "Secure Messaging", icon: <FiMessageSquare /> },
    { text: "Identity Protection", icon: <FiUserMinus /> },
    { text: "Community Guidelines", icon: <FiBookOpen /> },
    { text: "Confidential Matchmaking", icon: <FiHeart /> },
    { text: "SSL Certified Platform", icon: <FiKey /> },
    { text: "Transparent Policies", icon: <FiFileText /> },
    { text: "Block & Report Features", icon: <FiXOctagon /> },
    { text: "Trusted by Thousands", icon: <FiAward /> },
    { text: "Regular Security Audits", icon: <FiActivity /> },
    { text: "Secure Email OTPs", icon: <FiInbox /> },
    { text: "Ad-Free Experience", icon: <FiMonitor /> },
    { text: "Safe Browsing Assured", icon: <FiCheckCircle /> },
  ];

  return (
    <section className="trust-slider-section">
      {/* Internal CSS embedded directly in the component */}
      <style>{`
        .trust-slider-section {
          padding: 60px 20px;
          background-color: #fffafb; /* Very light pink/warm background */
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .trust-slider-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .trust-slider-header h2 {
          font-size: 2rem;
          color: #1a1a1a;
          margin: 0 0 10px 0;
          font-weight: 700;
        }

        .trust-slider-header p {
          color: #666;
          font-size: 1.1rem;
          margin: 0;
        }

        .slider-container {
          width: 100%;
          max-width: 1200px;
          overflow: hidden;
          position: relative;
        }

        /* Fade effect on the left and right edges */
        .slider-container::before,
        .slider-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 120px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .slider-container::before {
          left: 0;
          background: linear-gradient(to right, #fffafb 0%, rgba(255, 250, 251, 0) 100%);
        }

        .slider-container::after {
          right: 0;
          background: linear-gradient(to left, #fffafb 0%, rgba(255, 250, 251, 0) 100%);
        }

        .slide-track {
          display: flex;
          gap: 30px;
          /* Width is calc(item width + gap) * number of items */
          width: max-content;
          animation: scrollTrack 40s linear infinite;
        }

        /* Pause animation on hover for better UX */
        .slide-track:hover {
          animation-play-state: paused;
        }

        .slide-item {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          padding: 16px 24px;
          border-radius: 50px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          border: 1px solid #f0f0f0;
          white-space: nowrap;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .slide-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(216, 27, 96, 0.1);
          border-color: #f8bbd0;
        }

        .slide-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d81b60; /* Matrimony theme pink/red */
          font-size: 1.25rem;
        }

        .slide-text {
          font-size: 1rem;
          color: #333;
          font-weight: 500;
        }

        @keyframes scrollTrack {
          0% { transform: translateX(0); }
          /* Scroll exactly halfway (since we duplicate the array) */
          100% { transform: translateX(calc(-50% - 15px)); }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .trust-slider-header h2 {
            font-size: 1.5rem;
          }
          .trust-slider-header p {
            font-size: 0.95rem;
          }
          .slide-item {
            padding: 12px 18px;
          }
          .slide-text {
            font-size: 0.9rem;
          }
          .slide-icon {
            font-size: 1.1rem;
          }
        }
      `}</style>

      <div className="trust-slider-header">
        <h2>Meet KalyanaShobha</h2>
        <p>Your trusted platform for secure, email-verified matchmaking</p>
      </div>

      <div className="slider-container">
        <div className="slide-track">
          {/* Map through the items TWICE to create the seamless infinite scroll effect */}
          {[...trustFeatures, ...trustFeatures].map((feature, index) => (
            <div className="slide-item" key={index}>
              <div className="slide-icon">{feature.icon}</div>
              <span className="slide-text">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSlider;
