import React from 'react';
import { 
  FiShield, FiMail, FiLock, FiUserCheck, FiUsers, 
  FiSearch, FiSlash, FiImage, FiHeadphones, FiAlertCircle, 
  FiMessageSquare, FiUserMinus, FiBookOpen, FiHeart, FiKey, 
  FiFileText, FiXOctagon, FiAward, FiActivity, FiInbox, 
  FiMonitor, FiCheckCircle 
} from 'react-icons/fi';

const TrustSlider = () => {
  // 22 Unique trust and security features with individual icon colors
  const trustFeatures = [
    { text: "100% Verified", icon: <FiUserCheck />, color: "#4285F4" }, // Blue
    { text: "Email Auth", icon: <FiMail />, color: "#EA4335" }, // Red
    { text: "Strict Privacy", icon: <FiLock />, color: "#FBBC04" }, // Yellow
    { text: "Data Encryption", icon: <FiShield />, color: "#34A853" }, // Green
    { text: "RM Support", icon: <FiUsers />, color: "#8E24AA" }, // Purple
    { text: "Manual Screening", icon: <FiSearch />, color: "#FF6D00" }, // Orange
    { text: "Anti-Spam", icon: <FiSlash />, color: "#E91E63" }, // Pink
    { text: "Photo Privacy", icon: <FiImage />, color: "#00ACC1" }, // Cyan
    { text: "24/7 Support", icon: <FiHeadphones />, color: "#3949AB" }, // Indigo
    { text: "Fraud Detection", icon: <FiAlertCircle />, color: "#D81B60" }, // Deep Pink
    { text: "Secure Messaging", icon: <FiMessageSquare />, color: "#00897B" }, // Teal
    { text: "Identity Protection", icon: <FiUserMinus />, color: "#5E35B1" }, // Deep Purple
    { text: "Guidelines", icon: <FiBookOpen />, color: "#F4511E" }, // Deep Orange
    { text: "Confidential", icon: <FiHeart />, color: "#E53935" }, // Red
    { text: "SSL Certified", icon: <FiKey />, color: "#FDD835" }, // Yellow
    { text: "Transparent", icon: <FiFileText />, color: "#43A047" }, // Green
    { text: "Block & Report", icon: <FiXOctagon />, color: "#D32F2F" }, // Dark Red
    { text: "Trusted Platform", icon: <FiAward />, color: "#1E88E5" }, // Blue
    { text: "Security Audits", icon: <FiActivity />, color: "#8E24AA" }, // Purple
    { text: "Secure OTPs", icon: <FiInbox />, color: "#00ACC1" }, // Cyan
    { text: "Ad-Free", icon: <FiMonitor />, color: "#7CB342" }, // Light Green
    { text: "Safe Browsing", icon: <FiCheckCircle />, color: "#039BE5" }, // Light Blue
  ];

  return (
    <section className="trust-slider-section">
      <style>{`
        .trust-slider-section {
          padding: 80px 20px;
          background-color: #fdfdfd;
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
          gap: 60px;
          width: max-content;
          /* Increased time from 35s to 80s for slower movement */
          animation: scrollTrack 80s linear infinite;
          /* Force hardware acceleration for smoother scrolling */
          will-change: transform;
        }

        .slide-item {
          display: flex;
          align-items: center;
          gap: 12px;
          white-space: nowrap;
          opacity: 0.65;
          transition: opacity 0.3s ease, transform 0.3s ease;
          cursor: default;
        }

        .slide-item:hover {
          opacity: 1;
          transform: scale(1.02);
        }

        .slide-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          /* Color is now applied via inline styles in the map function */
        }

        .slide-text {
          font-size: 1.4rem;
          color: #111111;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        /* Used translate3d instead of translateX to prevent jittering */
        @keyframes scrollTrack {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(calc(-50% - 30px), 0, 0); }
        }

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
          {[...trustFeatures, ...trustFeatures].map((feature, index) => (
            <div className="slide-item" key={index}>
              {/* Added the inline style for color here */}
              <div className="slide-icon" style={{ color: feature.color }}>
                {feature.icon}
              </div>
              <span className="slide-text">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSlider;
