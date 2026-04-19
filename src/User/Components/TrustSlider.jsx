import React from 'react';
import { 
  FiShield, FiMail, FiLock, FiUserCheck, FiUsers, 
  FiSearch, FiSlash, FiImage, FiHeadphones, FiAlertCircle, 
  FiMessageSquare, FiUserMinus, FiBookOpen, FiHeart, FiKey, 
  FiFileText, FiXOctagon, FiAward, FiActivity, FiInbox, 
  FiMonitor, FiCheckCircle 
} from 'react-icons/fi';

const TrustSlider = () => {
  // 22 Unique trust and security features
  const trustFeatures = [
    { text: "100% Verified", icon: <FiUserCheck /> },
    { text: "Email Auth", icon: <FiMail /> },
    { text: "Strict Privacy", icon: <FiLock /> },
    { text: "Data Encryption", icon: <FiShield /> },
    { text: "RM Support", icon: <FiUsers /> },
    { text: "Manual Screening", icon: <FiSearch /> },
    { text: "Anti-Spam", icon: <FiSlash /> },
    { text: "Photo Privacy", icon: <FiImage /> },
    { text: "24/7 Support", icon: <FiHeadphones /> },
    { text: "Fraud Detection", icon: <FiAlertCircle /> },
    { text: "Secure Messaging", icon: <FiMessageSquare /> },
    { text: "Identity Protection", icon: <FiUserMinus /> },
    { text: "Guidelines", icon: <FiBookOpen /> },
    { text: "Confidential", icon: <FiHeart /> },
    { text: "SSL Certified", icon: <FiKey /> },
    { text: "Transparent", icon: <FiFileText /> },
    { text: "Block & Report", icon: <FiXOctagon /> },
    { text: "Trusted Platform", icon: <FiAward /> },
    { text: "Security Audits", icon: <FiActivity /> },
    { text: "Secure OTPs", icon: <FiInbox /> },
    { text: "Ad-Free", icon: <FiMonitor /> },
    { text: "Safe Browsing", icon: <FiCheckCircle /> },
  ];

  return (
    <section className="trust-slider-section">
      <style>{`
        .trust-slider-section {
          padding: 80px 20px;
          background-color: #fdfdfd; /* Very subtle off-white to match the screenshot */
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .trust-slider-header {
          text-align: center;
          margin-bottom: 50px;
        }

        .trust-slider-header p {
          color: #333333;
          font-size: 1.1rem;
          margin: 0;
          font-weight: 500;
        }

        .slider-container {
          width: 100%;
          max-width: 1400px;
          overflow: hidden;
          position: relative;
        }

        /* Stronger fade effect on the left and right edges */
        .slider-container::before,
        .slider-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 150px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .slider-container::before {
          left: 0;
          background: linear-gradient(to right, #fdfdfd 0%, rgba(253, 253, 253, 0) 100%);
        }

        .slider-container::after {
          right: 0;
          background: linear-gradient(to left, #fdfdfd 0%, rgba(253, 253, 253, 0) 100%);
        }

        .slide-track {
          display: flex;
          gap: 60px; /* Wider gap to look like distinct logos */
          width: max-content;
          animation: scrollTrack 35s linear infinite;
        }

        /* Minimalist "logo" style items without boxes */
        .slide-item {
          display: flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
          opacity: 0.65; /* Slightly faded to look like inactive logos */
          transition: opacity 0.3s ease, transform 0.3s ease;
          cursor: default;
        }

        .slide-item:hover {
          opacity: 1; /* Highlights when hovered */
          transform: scale(1.02);
        }

        .slide-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #111111; /* Dark icon */
          font-size: 1.6rem;
        }

        .slide-text {
          font-size: 1.4rem;
          color: #111111; /* Dark bold text */
          font-weight: 800; /* Extra bold to look like a brand mark */
          letter-spacing: -0.5px;
        }

        @keyframes scrollTrack {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 30px)); }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .trust-slider-section {
            padding: 50px 15px;
          }
          .trust-slider-header p {
            font-size: 0.95rem;
          }
          .slide-track {
            gap: 40px;
          }
          .slide-text {
            font-size: 1.1rem;
          }
          .slide-icon {
            font-size: 1.3rem;
          }
        }
      `}</style>

      <div className="trust-slider-header">
        <p>Security and privacy features built directly into KalyanaShobha</p>
      </div>

      <div className="slider-container">
        <div className="slide-track">
          {/* Duplicated array for seamless infinite scrolling */}
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
