import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import './Login/AdminLogin.css'; 

const AdminFeeSettings = () => {
    // State management
    const [maleFee, setMaleFee] = useState(0);
    const [femaleFee, setFemaleFee] = useState(0);
    const [upiId, setUpiId] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);

    // Separate URLs to perfectly match your backend routes
    const GET_API_URL = "https://kalyanashobha-back.vercel.app/api/admin/settings/fees";
    const PUT_API_URL = "https://kalyanashobha-back.vercel.app/api/admin/settings";

    // Fetch the current settings when the component loads
    useEffect(() => {
        fetchCurrentSettings();
    }, []);

    const fetchCurrentSettings = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            
            // Using the correct GET route
            const res = await axios.get(GET_API_URL, {
                headers: { Authorization: token }
            });
            
            if (res.data.success) {
                const settingsData = res.data.data || {};
                
                setMaleFee(settingsData.maleRegistrationFee || 0);
                setFemaleFee(settingsData.femaleRegistrationFee || 0);
                setUpiId(settingsData.upiId || '8897714968@axl'); // Provide fallback if empty
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            toast.error('Failed to load current settings.');
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        
        // Trigger the loading toast
        const toastId = toast.loading('Updating settings...');

        try {
            const token = localStorage.getItem('adminToken');
            
            // Using the correct PUT route
            const res = await axios.put(PUT_API_URL, { 
                maleRegistrationFee: Number(maleFee), 
                femaleRegistrationFee: Number(femaleFee),
                upiId: upiId 
            }, {
                headers: { Authorization: token }
            });

            if (res.data.success) {
                // Replace the loading toast with a success toast
                toast.success('Settings updated successfully!', { id: toastId });
            }
        } catch (err) {
            // Replace the loading toast with an error toast
            toast.error(err.response?.data?.message || "Failed to update settings.", { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Toaster component renders the actual toast popups */}
            <Toaster position="top-center" reverseOrder={false} />

            <div className="admin-login-container">
                <div className="login-card">
                    
                    <div className="login-header">
                        <h2>Platform Settings</h2>
                        <p>Set global registration fees and payment details</p>
                    </div>

                    <form onSubmit={handleUpdateSettings}>
                        
                        <div className="form-group">
                            <label>Payment UPI ID</label>
                            <input 
                                type="text" 
                                className="form-control" 
                                placeholder="e.g. 8897714968@axl" 
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Male Registration Fee (₹)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Enter amount" 
                                value={maleFee}
                                onChange={(e) => setMaleFee(e.target.value)} 
                                required 
                                min="0"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label>Female Registration Fee (₹)</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Enter amount" 
                                value={femaleFee}
                                onChange={(e) => setFemaleFee(e.target.value)} 
                                required 
                                min="0"
                            />
                        </div>

                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </form>

                </div>
            </div>
        </>
    );
};

export default AdminFeeSettings;
