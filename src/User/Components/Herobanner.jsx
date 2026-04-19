import React from 'react';
import './Herobanner.css';
import { Link } from "react-router-dom";

const HeroBanner = () => {
  // Array of top communities for the slider
  const communities = [
    "Reddy", "Kamma", "Brahmin", "Kapu", "Vysya", "Velama", 
    "Padmashali", "Yadav", "Goud", "Mudiraj", "Munnuru Kapu", 
    "Rajus", "Balija", "Naidu", "Gowda"
  ];

  return (
    <div className="premium-hero-container">

      {/* 1. TEXTURE & BACKGROUND */}
      <div className="premium-hero-texture-grain"></div>

      {/* 2. MOVING STAR FIELD (Opacity reduced for elegance) */}
      <div className="premium-hero-star-layer">
        <div className="premium-hero-stars-sm"></div>
        <div className="premium-hero-stars-md"></div>
      </div>

      {/* 3. BACKGROUND IMAGE (Cinematic Zoom Added) */}
      <div className="premium-hero-image-wrapper">
        <picture>
          <source media="(max-width: 900px)" srcSet="/kalayanashobha11.png" />
          <img 
            src="/kalyanashobha0.png" 
            alt="Happy Telugu Couple" 
            className="premium-hero-background-img" 
          />
        </picture>
        <div className="premium-hero-overlay-gradient"></div>
      </div>

      {/* 4. CONTENT LAYER */}
      <div className="premium-hero-content">

        {/* Main Title */}
        <h1 className="premium-hero-title">
          <div className="premium-hero-text-mask">
            <span className="premium-hero-reveal premium-hero-delay-1">Where Souls</span>
          </div>
          <div className="premium-hero-text-mask">
            <span className="premium-hero-reveal premium-hero-delay-2 premium-hero-gold-text">Meet Eternity</span>
          </div>
        </h1>

        {/* Subtitle */}
        <div className="premium-hero-text-mask">
          <p className="premium-hero-subtitle premium-hero-reveal premium-hero-delay-3">
            An exclusive journey for those seeking meaningful connections.<br className="premium-hero-desktop-break" />
            Discover a love that transcends time and tradition.
          </p>
        </div>

        {/* Action Button */}
        <div className="premium-hero-action-wrapper premium-hero-fade-in premium-hero-delay-4">
          <Link to="/registration" style={{ textDecoration: 'none' }}>
            <button className="premium-hero-glass-btn">
              <span className="premium-hero-btn-label">Register Now</span>
              <span className="premium-hero-btn-arrow">→</span>
            </button>
          </Link>
        </div>

      </div>

      {/* 5. TRUSTED COMMUNITIES SLIDER (Bottom Banner) */}
      <div className="premium-hero-community-slider premium-hero-fade-in premium-hero-delay-4">
        <div className="community-slider-track">
          {/* Duplicated array for seamless infinite scrolling */}
          {[...communities, ...communities].map((community, index) => (
            <div className="community-slide-item" key={index}>
              <span className="community-name">{community}</span>
              <span className="community-separator">✦</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HeroBanner;
