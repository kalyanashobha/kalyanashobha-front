import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login/AdminLogin.css'; 

const AdminFeeSettings = () => {
    // State management
    const [maleFee, setMaleFee] = useState(0);
    const [femaleFee, setFemaleFee] = useState(0);
    const [upiId, setUpiId] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

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
                // Your backend returns the settings inside 'res.data.data' for the GET route
                const settingsData = res.data.data || {};
                
                setMaleFee(settingsData.maleRegistrationFee || 0);
                setFemaleFee(settingsData.femaleRegistrationFee || 0);
                setUpiId(settingsData.upiId || '8897714968@axl'); // Provide fallback if empty
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
            setMessage({ type: 'error', text: 'Failed to load current settings.' });
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        setIsLoading(true); 
        setMessage({ type: '', text: '' });

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
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
                
                // Clear the success message after 3 seconds
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || "Failed to update settings." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="admin-login-container">
                <div className="login-card">
                    
                    <div className="login-header">
                        <h2>Platform Settings</h2>
                        <p>Set global registration fees and payment details</p>
                    </div>

                    {message.text && (
                        <div className={`alert alert-${message.type}`} style={{ marginBottom: '15px', padding: '10px', borderRadius: '5px', backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                            {message.text}
                        </div>
                    )}

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
