import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Quote, Star, CheckCircle } from 'lucide-react';
import './Testimonials.css'; 

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const API_URL = "https://kalyanashobha-back.vercel.app/api/testimonials";

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await axios.get(API_URL);
                if (res.data.success) {
                    setTestimonials(res.data.data);
                }
            } catch (err) {
                console.error("Error fetching testimonials:", err);
                setError("Failed to load happy stories. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTestimonials();
    }, []);

    // Premium Borderless Skeleton Loader
    const SkeletonItem = () => (
        <div className="premium-story-item premium-skeleton-item">
            <div className="premium-media-wrapper skeleton-shimmer"></div>
            <div className="premium-story-content">
                <div className="skeleton-line skeleton-shimmer" style={{ width: '40px', marginBottom: '16px' }}></div>
                <div className="skeleton-line skeleton-shimmer" style={{ width: '100%' }}></div>
                <div className="skeleton-line skeleton-shimmer" style={{ width: '90%' }}></div>
                <div className="skeleton-line skeleton-shimmer" style={{ width: '60%' }}></div>
                <div className="premium-story-footer">
                    <div className="skeleton-avatar skeleton-shimmer"></div>
                    <div className="skeleton-author-details">
                        <div className="skeleton-line skeleton-shimmer" style={{ width: '120px', height: '14px' }}></div>
                        <div className="skeleton-line skeleton-shimmer" style={{ width: '80px', height: '10px' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (error) {
        return <div className="premium-error-msg">{error}</div>;
    }

    if (!isLoading && testimonials.length === 0) {
        return null; 
    }

    return (
        <section className="premium-testimonials-section">
            {/* Minimalist Ambient Background */}
            <div className="premium-ambient-glow glow-left"></div>
            <div className="premium-ambient-glow glow-right"></div>

            <div className="premium-test-container">
                {/* High-End Typography Header */}
                <div className="premium-header">
                    <span className="premium-eyebrow">Success Stories</span>
                    <h2 className="premium-title">
                        Matches Made in <span className="premium-gradient-text">Heaven</span>
                    </h2>
                    <p className="premium-subtitle">
                        Discover the beautiful journeys of couples who found their forever on KalyanaShobha.
                    </p>
                </div>

                {/* Borderless Infinite Slider */}
                <div className="premium-slider-viewport">
                    <div className={`premium-slider-track ${isLoading ? 'is-loading' : ''}`}>
                        {isLoading ? (
                            <>
                                <SkeletonItem />
                                <SkeletonItem />
                                <SkeletonItem />
                                <SkeletonItem />
                            </>
                        ) : (
                            /* Duplicate array for seamless infinite scroll */
                            [...testimonials, ...testimonials].map((item, index) => (
                                <div className="premium-story-item" key={`${item._id}-${index}`}>
                                    
                                    {/* Elevated Media Display (No Cards) */}
                                    <div className="premium-media-wrapper">
                                        {item.mediaUrl && item.mediaType === 'video' ? (
                                            <video 
                                                className="premium-media" 
                                                src={item.mediaUrl} 
                                                controls 
                                                preload="metadata"
                                            />
                                        ) : item.mediaUrl ? (
                                            <img 
                                                className="premium-media" 
                                                src={item.mediaUrl} 
                                                alt={`Story of ${item.authorName}`} 
                                            />
                                        ) : (
                                            <div className="premium-media placeholder">
                                                <span>{item.authorName.charAt(0)}</span>
                                            </div>
                                        )}
                                        {/* Floating Quote Icon on Image */}
                                        <div className="premium-quote-badge">
                                            <Quote size={20} strokeWidth={2} fill="currentColor" />
                                        </div>
                                    </div>

                                    {/* Clean, Unboxed Content Area */}
                                    <div className="premium-story-content">
                                        <div className="premium-stars">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                                            ))}
                                        </div>

                                        <p className="premium-quote-text">
                                            "{item.content}"
                                        </p>

                                        <div className="premium-story-footer">
                                            <div className="premium-author-avatar">
                                                {item.authorName.charAt(0)}
                                            </div>
                                            <div className="premium-author-info">
                                                <h4 className="premium-author-name">{item.authorName}</h4>
                                                <span className="premium-verified">
                                                    <CheckCircle size={12} />
                                                    Verified Match
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
