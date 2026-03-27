import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ChevronDown, CreditCard, User, Settings } from 'lucide-react';

const AdminFeeSettings = () => {
    // State management
    const [maleFee, setMaleFee] = useState(0);
    const [femaleFee, setFemaleFee] = useState(0);
    const [upiId, setUpiId] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    // Mobile Scroll Indicator State
    const [showMainScroll, setShowMainScroll] = useState(false);

    const GET_API_URL = "https://kalyanashobha-back.vercel.app/api/admin/settings/fees";
    const PUT_API_URL = "https://kalyanashobha-back.vercel.app/api/admin/settings";

    useEffect(() => {
        fetchCurrentSettings();
    }, []);

    // Scroll Indicator Logic
    useEffect(() => {
        const checkMainScroll = () => {
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            setShowMainScroll(documentHeight > windowHeight + 10 && scrollY + windowHeight < documentHeight - 60);
        };

        const timer = setTimeout(checkMainScroll, 500); 
        window.addEventListener('scroll', checkMainScroll);
        window.addEventListener('resize', checkMainScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', checkMainScroll);
            window.removeEventListener('resize', checkMainScroll);
        };
    }, []);

    const fetchCurrentSettings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            
            const res = await axios.get(GET_API_URL, {
                headers: { Authorization: token }
            });
            
            if (res.data.success) {
                const settingsData = res.data.data || {};
                setMaleFee(settingsData.maleRegistrationFee || 0);
                setFemaleFee(settingsData.femaleRegistrationFee || 0);
                setUpiId(settingsData.upiId || '8897714968@axl'); 
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            toast.error("Failed to load current settings.");
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        
        // Trigger the loading toast
        const toastId = toast.loading("Updating platform settings...");

        try {
            const token = localStorage.getItem('adminToken');
            
            const res = await axios.put(PUT_API_URL, { 
                maleRegistrationFee: Number(maleFee), 
                femaleRegistrationFee: Number(femaleFee),
                upiId: upiId 
            }, {
                headers: { Authorization: token }
            });

            if (res.data.success) {
                // Update toast to success state
                toast.update(toastId, { 
                    render: "Settings updated successfully!", 
                    type: "success", 
                    isLoading: false, 
                    autoClose: 3000 
                });
            }
        } catch (err) {
            // Update toast to error state
            toast.update(toastId, { 
                render: err.response?.data?.message || "Failed to update settings.", 
                type: "error", 
                isLoading: false, 
                autoClose: 3000 
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="afs-layout">
            <ToastContainer position="top-right" theme="colored" />
            
            <style>{`
                :root {
                    --afs-primary: #8E1B1B;
                    --afs-primary-hover: #7a1717;
                    --afs-bg: #f8fafc;
                    --afs-card-bg: #ffffff;
                    --afs-text-main: #0f172a;
                    --afs-text-sub: #64748b;
                    --afs-border: #e2e8f0;
                    --afs-border-focus: #cbd5e1;
                    --afs-radius: 12px;
                    --afs-radius-sm: 8px;
                    --afs-shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.05);
                    --afs-shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
                    --afs-anim: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                }

                * { box-sizing: border-box; }

                .afs-layout {
                    padding: 32px;
                    background-color: var(--afs-bg);
                    min-height: 100vh;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    color: var(--afs-text-main);
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                }

                .afs-card {
                    background: var(--afs-card-bg);
                    border: 1px solid var(--afs-border);
                    border-radius: var(--afs-radius);
                    box-shadow: var(--afs-shadow-md);
                    padding: 32px;
                    width: 100%;
                    max-width: 550px;
                    margin-top: 20px;
                }

                .afs-header {
                    margin-bottom: 32px;
                    text-align: center;
                }

                .afs-header-icon {
                    background: #fdf2f2;
                    color: var(--afs-primary);
                    width: 56px;
                    height: 56px;
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                    border: 1px solid #fecaca;
                }

                .afs-header h2 {
                    font-size: 24px;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    margin: 0 0 8px 0;
                    color: var(--afs-text-main);
                }

                .afs-header p {
                    margin: 0;
                    color: var(--afs-text-sub);
                    font-size: 15px;
                }

                .afs-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .afs-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .afs-label {
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: var(--afs-text-sub);
                }

                .afs-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .afs-input-icon {
                    position: absolute;
                    left: 14px;
                    color: #94a3b8;
                    pointer-events: none;
                }

                .afs-input {
                    width: 100%;
                    padding: 14px 16px 14px 44px;
                    border: 1px solid var(--afs-border);
                    border-radius: var(--afs-radius-sm);
                    font-size: 15px;
                    color: var(--afs-text-main);
                    background-color: #fff;
                    transition: var(--afs-anim);
                    outline: none;
                }

                .afs-input:focus {
                    border-color: var(--afs-primary);
                    box-shadow: 0 0 0 4px rgba(142, 27, 27, 0.1);
                }

                .afs-submit-btn {
                    background-color: var(--afs-primary);
                    color: white;
                    border: none;
                    padding: 16px;
                    border-radius: var(--afs-radius-sm);
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--afs-anim);
                    margin-top: 12px;
                    box-shadow: 0 4px 6px rgba(142, 27, 27, 0.2);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                }

                .afs-submit-btn:hover:not(:disabled) {
                    background-color: var(--afs-primary-hover);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 12px rgba(142, 27, 27, 0.3);
                }

                .afs-submit-btn:disabled {
                    background-color: #cbd5e1;
                    cursor: not-allowed;
                    box-shadow: none;
                    transform: none;
                }

                /* --- SCROLL INDICATOR UI --- */
                .afs-scroll-indicator {
                    display: none; 
                    position: fixed;
                    bottom: 24px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(15, 23, 42, 0.9);
                    color: white;
                    padding: 8px 16px;
                    border-radius: 30px;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    pointer-events: none; 
                    z-index: 50;
                    animation: bounceSubtle 2s infinite ease-in-out;
                    backdrop-filter: blur(4px);
                }

                @keyframes bounceSubtle {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, 6px); }
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    .afs-layout {
                        padding: 16px;
                    }
                    
                    .afs-card {
                        padding: 24px 20px;
                        border-radius: 16px;
                        margin-top: 10px;
                    }

                    .afs-header h2 {
                        font-size: 22px;
                    }

                    .afs-header p {
                        font-size: 14px;
                    }

                    .afs-scroll-indicator {
                        display: flex;
                    }
                }
            `}</style>

            <div className="afs-card">
                <div className="afs-header">
                    <div className="afs-header-icon">
                        <Settings size={28} />
                    </div>
                    <h2>Platform Settings</h2>
                    <p>Configure global registration fees and payment UPI details.</p>
                </div>

                <form onSubmit={handleUpdateSettings} className="afs-form">
                    
                    <div className="afs-form-group">
                        <label className="afs-label">Payment UPI ID</label>
                        <div className="afs-input-wrapper">
                            <CreditCard size={18} className="afs-input-icon" />
                            <input 
                                type="text" 
                                className="afs-input" 
                                placeholder="e.g. 8897714968@axl" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="afs-form-group">
                        <label className="afs-label">Male Registration Fee (₹)</label>
                        <div className="afs-input-wrapper">
                            <User size={18} className="afs-input-icon" />
                            <input 
                                type="number" 
                                className="afs-input" 
                                placeholder="Enter amount" 
                                value={maleFee}
                                onChange={(e) => setMaleFee(e.target.value)} 
                                required 
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="afs-form-group">
                        <label className="afs-label">Female Registration Fee (₹)</label>
                        <div className="afs-input-wrapper">
                            <User size={18} className="afs-input-icon" />
                            <input 
                                type="number" 
                                className="afs-input" 
                                placeholder="Enter amount" 
                                value={femaleFee}
                                onChange={(e) => setFemaleFee(e.target.value)} 
                                required 
                                min="0"
                            />
                        </div>
                    </div>

                    <button type="submit" className="afs-submit-btn" disabled={isLoading}>
                        {isLoading ? 'Processing Update...' : 'Save Configuration'}
                    </button>
                </form>
            </div>

            {/* UNIVERSAL SCROLL INDICATOR */}
            {showMainScroll && (
                <div className="afs-scroll-indicator">
                    <ChevronDown size={18} />
                    <span>Scroll for more</span>
                </div>
            )}
        </div>
    );
};

export default AdminFeeSettings;
