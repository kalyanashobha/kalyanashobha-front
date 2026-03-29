import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IndianRupee, QrCode, Save, Settings } from 'lucide-react';

const AdminFeeSettings = () => {
    // State management
    const [maleFee, setMaleFee] = useState('');
    const [femaleFee, setFemaleFee] = useState('');
    const [upiId, setUpiId] = useState(''); 
    
    // Separate loading states for fetching vs updating
    const [isFetching, setIsFetching] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const GET_API_URL = "https://kalyanashobha-back.vercel.app/api/admin/settings/fees";
    const PUT_API_URL = "https://kalyanashobha-back.vercel.app/api/admin/settings";

    useEffect(() => {
        fetchCurrentSettings();
    }, []);

    const fetchCurrentSettings = async () => {
        setIsFetching(true);
        // 1. Show processing toast while fetching
        const fetchToastId = toast.loading('Fetching current settings...');

        try {
            const token = localStorage.getItem('adminToken');

            const res = await axios.get(GET_API_URL, {
                headers: { Authorization: token }
            });

            if (res.data.success) {
                const settingsData = res.data.data || {};

                setMaleFee(settingsData.maleRegistrationFee || '');
                setFemaleFee(settingsData.femaleRegistrationFee || '');
                setUpiId(settingsData.upiId || ''); 

                // 2. Update toast on success
                toast.success('Settings loaded successfully!', { id: fetchToastId });
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            // 3. Update toast on error
            toast.error('Failed to load current settings.', { id: fetchToastId });
        } finally {
            setIsFetching(false);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsUpdating(true); 

        const updateToastId = toast.loading('Updating settings...');

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
                toast.success('Settings updated successfully!', { id: updateToastId });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update settings.", { id: updateToastId });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="afs-layout-wrapper" id="admin-fee-settings-root">
            <Toaster position="top-right" reverseOrder={false} />

            {/* INTERNAL CSS */}
            <style>{`
                .afs-layout-wrapper {
                    --afs-primary: #dc2626;      /* Thick Red */
                    --afs-primary-hover: #b91c1c; /* Darker Thick Red */
                    --afs-bg: #f8fafc;
                    --afs-card-bg: #ffffff;
                    --afs-text-main: #0f172a;
                    --afs-text-sub: #64748b;
                    --afs-border: #e2e8f0;
                    --afs-input-bg: #f8fafc;
                    --afs-radius: 16px;
                    --afs-radius-sm: 8px;
                    --afs-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
                    --afs-transition: all 0.2s ease-in-out;

                    min-height: 100vh;
                    background-color: var(--afs-bg);
                    padding: 40px 20px;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    font-family: 'Inter', system-ui, -apple-system, sans-serif;
                    box-sizing: border-box;
                }

                .afs-card-container {
                    background: var(--afs-card-bg);
                    width: 100%;
                    max-width: 500px;
                    border-radius: var(--afs-radius);
                    box-shadow: var(--afs-shadow);
                    border: 1px solid var(--afs-border);
                    overflow: hidden;
                    animation: afsFadeIn 0.4s ease-out;
                }

                @keyframes afsFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .afs-header-section {
                    padding: 32px 32px 24px 32px;
                    border-bottom: 1px solid var(--afs-border);
                    text-align: center;
                }

                .afs-icon-wrap {
                    width: 48px;
                    height: 48px;
                    background: #fee2e2; /* Light red background */
                    color: var(--afs-primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 16px auto;
                }

                .afs-header-section h2 {
                    margin: 0 0 8px 0;
                    font-size: 24px;
                    color: var(--afs-text-main);
                    font-weight: 800;
                    letter-spacing: -0.5px;
                }

                .afs-header-section p {
                    margin: 0;
                    color: var(--afs-text-sub);
                    font-size: 14px;
                    line-height: 1.5;
                }

                .afs-form-section {
                    padding: 32px;
                }

                .afs-input-group {
                    margin-bottom: 24px;
                }

                .afs-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: var(--afs-text-main);
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .afs-input-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .afs-input-icon {
                    position: absolute;
                    left: 16px;
                    color: #94a3b8;
                    pointer-events: none;
                }

                .afs-input-field {
                    width: 100%;
                    background: var(--afs-input-bg);
                    border: 1px solid var(--afs-border);
                    padding: 14px 16px 14px 44px;
                    border-radius: var(--afs-radius-sm);
                    font-size: 15px;
                    color: var(--afs-text-main);
                    transition: var(--afs-transition);
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .afs-input-field:focus {
                    outline: none;
                    border-color: var(--afs-primary);
                    background: #ffffff;
                    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1); /* Red shadow */
                }

                .afs-input-field:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .afs-btn-submit {
                    width: 100%;
                    background: var(--afs-primary);
                    color: #ffffff;
                    border: none;
                    padding: 16px;
                    border-radius: var(--afs-radius-sm);
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: var(--afs-transition);
                    margin-top: 8px;
                }

                .afs-btn-submit:hover:not(:disabled) {
                    background: var(--afs-primary-hover);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2); /* Red shadow */
                }

                .afs-btn-submit:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* Skeleton Loading Styles */
                .afs-skeleton-input {
                    width: 100%;
                    height: 50px;
                    border-radius: var(--afs-radius-sm);
                    background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
                    background-size: 200% 100%;
                    animation: afsShimmer 1.5s infinite;
                }

                @keyframes afsShimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }

                /* Mobile Adjustments */
                @media (max-width: 600px) {
                    .afs-layout-wrapper {
                        padding: 20px 16px;
                    }
                    .afs-header-section {
                        padding: 24px 20px 20px 20px;
                    }
                    .afs-form-section {
                        padding: 24px 20px;
                    }
                }
            `}</style>

            <div className="afs-card-container">
                <div className="afs-header-section">
                    <div className="afs-icon-wrap">
                        <Settings size={24} />
                    </div>
                    <h2>Platform Settings</h2>
                    <p>Manage global payment details and membership registration fees.</p>
                </div>

                <div className="afs-form-section">
                    <form onSubmit={handleUpdateSettings}>

                        <div className="afs-input-group">
                            <label className="afs-label" htmlFor="afs-upi-id">Payment UPI ID</label>
                            {isFetching ? (
                                <div className="afs-skeleton-input"></div>
                            ) : (
                                <div className="afs-input-wrapper">
                                    <QrCode size={18} className="afs-input-icon" />
                                    <input 
                                        id="afs-upi-id"
                                        type="text" 
                                        className="afs-input-field" 
                                        placeholder="e.g. 8897714968@axl" 
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)} 
                                        required 
                                        disabled={isUpdating}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="afs-input-group">
                            <label className="afs-label" htmlFor="afs-male-fee">Male Registration Fee</label>
                            {isFetching ? (
                                <div className="afs-skeleton-input"></div>
                            ) : (
                                <div className="afs-input-wrapper">
                                    <IndianRupee size={18} className="afs-input-icon" />
                                    <input 
                                        id="afs-male-fee"
                                        type="number" 
                                        className="afs-input-field" 
                                        placeholder="Enter amount" 
                                        value={maleFee}
                                        onChange={(e) => setMaleFee(e.target.value)} 
                                        required 
                                        min="0"
                                        disabled={isUpdating}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="afs-input-group">
                            <label className="afs-label" htmlFor="afs-female-fee">Female Registration Fee</label>
                            {isFetching ? (
                                <div className="afs-skeleton-input"></div>
                            ) : (
                                <div className="afs-input-wrapper">
                                    <IndianRupee size={18} className="afs-input-icon" />
                                    <input 
                                        id="afs-female-fee"
                                        type="number" 
                                        className="afs-input-field" 
                                        placeholder="Enter amount" 
                                        value={femaleFee}
                                        onChange={(e) => setFemaleFee(e.target.value)} 
                                        required 
                                        min="0"
                                        disabled={isUpdating}
                                    />
                                </div>
                            )}
                        </div>

                        <button 
                            type="submit" 
                            className="afs-btn-submit" 
                            disabled={isFetching || isUpdating}
                        >
                            <Save size={18} />
                            {isUpdating ? 'Saving Changes...' : 'Save Settings'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminFeeSettings;
