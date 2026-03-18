import React, { useState } from 'react';
import Navbar from "../../Components/Navbar.jsx";
import toast, { Toaster } from 'react-hot-toast'; // Imported toast
import './HelpCenter.css';

const HelpCenter = () => {
  const [formData, setFormData] = useState({
    subject: '',
    summary: '',
    screenshot: null
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, screenshot: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.summary.trim()) {
      toast.error('Subject and Summary are required.');
      return;
    }

    const token = localStorage.getItem('token'); 

    if (!token) {
      toast.error('Authentication required. Please log in again.');
      return;
    }

    setLoading(true);
    // Create a loading toast that we will update once the API responds
    const toastId = toast.loading('Submitting your issue...');

    const payload = new FormData();
    payload.append('subject', formData.subject);
    payload.append('summary', formData.summary);
    if (formData.screenshot) {
      payload.append('screenshot', formData.screenshot);
    }

    try {
      const response = await fetch('https://kalyanashobha-back.vercel.app/api/user/help-center/submit', {
        method: 'POST',
        headers: {
          'Authorization': token 
        },
        body: payload
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Your issue has been submitted successfully.', { id: toastId });
        setFormData({ subject: '', summary: '', screenshot: null });
        document.getElementById('screenshot-upload').value = '';
      } else {
        toast.error(data.message || 'Failed to submit the issue.', { id: toastId });
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('An error occurred while connecting to the server.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      {/* Configure the Toaster placement and styling */}
      <Toaster position="top-center" containerStyle={{ zIndex: 999999, top: 80 }} />
      
      <div className="ks-main-wrapper">
        <div className="ks-auth-card ks-help-card">
          
          <div className="ks-help-header">
            <h1 className="ks-group-title">Help Center</h1>
            <p className="ks-step-sub" style={{ display: 'block' }}>
              Submit an issue or query. Our administrative team will review it and notify you via email.
            </p>
          </div>

          <div className="ks-form-content">
            <form onSubmit={handleSubmit}>
              
              <div className="ks-input-block">
                <label htmlFor="subject" className="ks-label">
                  Subject <span className="ks-highlight-red">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="ks-control"
                  placeholder="Briefly describe the issue"
                />
              </div>

              <div className="ks-input-block">
                <label htmlFor="summary" className="ks-label">
                  Summary <span className="ks-highlight-red">*</span>
                </label>
                <textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  rows="5"
                  className="ks-control ks-textarea"
                  placeholder="Provide detailed information about the problem you are facing..."
                ></textarea>
              </div>

              <div className="ks-input-block">
                <label className="ks-label">Screenshot (Optional)</label>
                <div className="ks-file-upload-zone">
                  <div className="ks-file-upload-content">
                    <label htmlFor="screenshot-upload" className="ks-file-btn">
                      <span>Upload a file</span>
                      <input 
                        id="screenshot-upload" 
                        name="screenshot" 
                        type="file" 
                        accept="image/jpeg, image/png, image/jpg"
                        className="ks-sr-only" 
                        onChange={handleFileChange}
                      />
                    </label>
                    <span className="ks-file-text">or drag and drop</span>
                  </div>
                  <p className="ks-file-hint">
                    {formData.screenshot ? formData.screenshot.name : 'PNG, JPG, JPEG up to 5MB'}
                  </p>
                </div>
              </div>

              <div className="ks-action-footer" style={{ marginTop: '24px' }}>
                <div className="ks-spacer"></div>
                <button
                  type="submit"
                  disabled={loading}
                  className="ks-btn ks-btn-primary"
                >
                  {loading ? 'Submitting...' : 'Submit Issue'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenter;
