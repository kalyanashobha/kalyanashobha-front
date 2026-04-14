import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ProcessFlow.css';

// --- PREMIUM ICONS ---
const IconRegister = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);
const IconBrowse = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const IconConnect = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);
const IconInteract = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
);

const ProcessFlow = () => {
  const steps = [
    { id: "01", tag: "REGISTER", title: "Create Account", desc: "Begin your journey by verifying your identity.", icon: <IconRegister /> },
    { id: "02", tag: "DISCOVER", title: "Browse Profiles", desc: "Use precision filters to find your perfect match.", icon: <IconBrowse /> },
    { id: "03", tag: "CONNECT", title: "Send Interest", desc: "Express your interest with a single secure click.", icon: <IconConnect /> },
    { id: "04", tag: "INTERACT", title: "Connect", desc: "Connect instantly once your request is approved.", icon: <IconInteract /> }
  ];

  const [activeStep, setActiveStep] = useState(0);
  
  // Faster moving time: 2000ms (2 seconds) per step
  const stepDuration = 2000; 

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, stepDuration);
    return () => clearInterval(timer);
  }, [stepDuration, steps.length]);

  // Calculate progress percentage for the connecting lines
  const progressPercentage = (activeStep / (steps.length - 1)) * 100;

  return (
    <section className="auto-process-section">
      <div className="auto-container">

        <div className="auto-header">
          <h2 className="auto-title">
            Streamlined <span className="gradient-text">Connection.</span>
          </h2>
        </div>

        <div className="timeline-layout">
          
          {/* --- MOBILE VERTICAL LINE --- */}
          <div className="mobile-line-container">
            <div className="line-track"></div>
            <motion.div 
              className="line-progress-fill"
              initial={{ height: 0 }}
              animate={{ height: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }} /* Faster transition to match step duration */
            />
          </div>

          <div className="steps-column">
            
            {/* --- DESKTOP HORIZONTAL LINE --- */}
            <div className="desktop-line-container">
              <div className="desktop-line-track"></div>
              <motion.div 
                className="desktop-line-progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.4, ease: "easeInOut" }} /* Faster transition */
              />
            </div>

            {/* --- THE STEPS --- */}
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              return (
                <div key={step.id} className={`step-row ${isActive ? 'active' : ''}`}>
                  <div className="step-icon-wrapper">
                    <motion.div 
                      className="step-icon-box"
                      animate={isActive ? { scale: 1.08, y: -4 } : { scale: 1, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }} /* Snappier spring */
                    >
                      {step.icon}
                    </motion.div>
                  </div>
                  <div className="step-content">
                    <span className="step-tag">{step.id} / {step.tag}</span>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-desc">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
