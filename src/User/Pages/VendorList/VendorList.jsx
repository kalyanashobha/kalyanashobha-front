import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image as ImageIcon, X, Plus, UploadCloud } from "lucide-react"; 
import "./VendorList.css";
import Navbar from "../../Components/Navbar";

export default function VendorList() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Modal & Form State for User Contacting Vendor ---
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  // --- Modal & Form State for "Join as Vendor" ---
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinFormData, setJoinFormData] = useState({
    businessName: "",
    email: "",
    category: "",
    contactNumber: "",
    priceRange: "",
    description: "",
  });
  const [joinFiles, setJoinFiles] = useState([]);
  const [joinSubmitStatus, setJoinSubmitStatus] = useState({
    loading: false,
    success: false,
    error: "",
  });

  const categories = [
    'Catering', 'Wedding halls', 'Photography', 'Decoration', 
    'Mehendi artists', 'Makeup', 'Event management', 'Travel', 'Pandit'
  ];

  // Fetch Approved Vendors
  const fetchVendors = async () => {
    try {
      const token = localStorage.getItem("token"); 
      const config = {};
      if (token) {
        config.headers = { Authorization: token };
      }
      
      const res = await axios.get("https://kalyanashobha-back.vercel.app/api/user/vendors", config);
      
      if (res.data.success) {
        setVendors(res.data.vendors);
      }
    } catch (err) {
      console.error("Error fetching vendors", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // --- Handlers: User Contacting Vendor ---
  const handleOpenModal = (vendor) => {
    setSelectedVendor(vendor);
    setSubmitStatus({ loading: false, success: false, error: "" });
  };

  const handleCloseModal = () => {
    setSelectedVendor(null);
    setFormData({ name: "", phone: "", email: "", message: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, success: false, error: "" });

    try {
      const res = await axios.post("https://kalyanashobha-back.vercel.app/api/user/vendor-lead", {
        vendorId: selectedVendor._id,
        ...formData
      });

      if (res.data.success) {
        setSubmitStatus({ loading: false, success: true, error: "" });
        setTimeout(() => {
          handleCloseModal();
        }, 2000);
      }
    } catch (err) {
      setSubmitStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Failed to send request. Please try again."
      });
    }
  };

  // --- Handlers: Join as Vendor ---
  const handleOpenJoinModal = () => {
    setShowJoinModal(true);
    setJoinSubmitStatus({ loading: false, success: false, error: "" });
  };

  const handleCloseJoinModal = () => {
    setShowJoinModal(false);
    setJoinFormData({
      businessName: "", email: "", category: "", contactNumber: "", priceRange: "", description: ""
    });
    setJoinFiles([]);
  };

  const handleJoinInputChange = (e) => {
    setJoinFormData({ ...joinFormData, [e.target.name]: e.target.value });
  };

  const handleJoinFileChange = (e) => {
    setJoinFiles(Array.from(e.target.files));
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    setJoinSubmitStatus({ loading: true, success: false, error: "" });

    const data = new FormData();
    data.append("businessName", joinFormData.businessName);
    data.append("email", joinFormData.email);
    data.append("category", joinFormData.category);
    data.append("contactNumber", joinFormData.contactNumber);
    data.append("priceRange", joinFormData.priceRange);
    data.append("description", joinFormData.description);

    for (let i = 0; i < joinFiles.length; i++) {
      data.append("images", joinFiles[i]);
    }

    try {
      const res = await axios.post("https://kalyanashobha-back.vercel.app/api/vendor/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setJoinSubmitStatus({ loading: false, success: true, error: "" });
        setTimeout(() => {
          handleCloseJoinModal();
        }, 3000); 
      }
    } catch (err) {
      setJoinSubmitStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || "Registration failed. Please try again."
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="ks-wrapper">
        
        {/* HEADER SECTION */}
        <div className="ks-header-section">
          <div className="ks-header-content">
            <h1>Premium Vendors</h1>
            <p>Curated services to make your special day perfect.</p>
          </div>
          <button className="ks-btn-primary" onClick={handleOpenJoinModal}>
            <Plus size={18} /> Join as Vendor
          </button>
        </div>

        {/* VENDOR GRID */}
        <div className="ks-vendor-grid">
          {loading ? (
             [1,2,3,4].map(n => <div key={n} className="ks-card ks-skeleton"></div>)
          ) : vendors.length === 0 ? (
            <div className="ks-empty-state">
              <h3>No Vendors Found</h3>
              <p>Check back later for new listings.</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="ks-card">
                
                {/* Image Section */}
                <div className="ks-card-img-wrapper">
                  {vendor.images && vendor.images.length > 0 ? (
                    <img src={vendor.images[0]} alt={vendor.businessName} />
                  ) : (
                    <div className="ks-img-placeholder"><ImageIcon size={40} /></div>
                  )}
                  <span className="ks-badge">{vendor.category}</span>
                </div>

                {/* Content Section */}
                <div className="ks-card-body">
                  <h3 className="ks-card-title">{vendor.businessName}</h3>
                  <p className="ks-card-desc">
                    {vendor.description ? vendor.description.substring(0, 80) + "..." : "No description available."}
                  </p>
                  <button className="ks-btn-primary" onClick={() => handleOpenModal(vendor)}>
                    Contact Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- EXISTING: Contact Vendor Modal --- */}
        {selectedVendor && (
          <div className="ks-modal-backdrop">
            <div className="ks-modal-panel">
              <button className="ks-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
              
              <div className="ks-modal-header">
                <h2>Contact {selectedVendor.businessName}</h2>
                <p>Our concierge team will connect you.</p>
              </div>

              <div className="ks-modal-body">
                {submitStatus.success ? (
                  <div className="ks-alert-success">
                    Request sent successfully! We will be in touch soon.
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="ks-form">
                    <div className="ks-input-group">
                      <input className="ks-input" type="text" name="name" placeholder="Full Name *" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="ks-input-group">
                      <input className="ks-input" type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleInputChange} required />
                    </div>
                    <div className="ks-input-group">
                      <input className="ks-input" type="email" name="email" placeholder="Email Address (Optional)" value={formData.email} onChange={handleInputChange} />
                    </div>
                    <div className="ks-input-group">
                      <textarea className="ks-input" name="message" placeholder="What are your requirements? (e.g., Dates, Venue) *" value={formData.message} onChange={handleInputChange} required></textarea>
                    </div>

                    {submitStatus.error && <div className="ks-alert-error">{submitStatus.error}</div>}

                    <button type="submit" className="ks-btn-primary" disabled={submitStatus.loading}>
                      {submitStatus.loading ? "Sending..." : "Send Request"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- NEW: Join as Vendor Modal --- */}
        {showJoinModal && (
          <div className="ks-modal-backdrop">
            <div className="ks-modal-panel ks-large">
              <button className="ks-close-btn" onClick={handleCloseJoinModal}>
                <X size={20} />
              </button>
              
              <div className="ks-modal-header">
                <h2>Register Your Business</h2>
                <p>Join KalyanaShobha and connect with thousands of couples.</p>
              </div>

              <div className="ks-modal-body">
                {joinSubmitStatus.success ? (
                  <div className="ks-alert-success">
                    <h3 style={{marginTop: 0}}>Registration Submitted!</h3>
                    <p style={{marginBottom: 0}}>Our admin team will review your application. You will receive an email once your profile is approved and live.</p>
                  </div>
                ) : (
                  <form onSubmit={handleJoinSubmit} className="ks-form">
                    
                    {/* Replaced inline styles with a responsive CSS grid row */}
                    <div className="ks-form-row">
                      <div className="ks-input-group">
                        <input className="ks-input" type="text" name="businessName" placeholder="Business Name *" value={joinFormData.businessName} onChange={handleJoinInputChange} required />
                      </div>
                      <div className="ks-input-group">
                        <input className="ks-input" type="email" name="email" placeholder="Business Email *" value={joinFormData.email} onChange={handleJoinInputChange} required />
                      </div>
                    </div>
                    
                    <div className="ks-form-row">
                      <div className="ks-input-group">
                        <input className="ks-input" type="text" name="category" list="vendor-categories" placeholder="Select Category *" value={joinFormData.category} onChange={handleJoinInputChange} required />
                        <datalist id="vendor-categories">
                          {categories.map(cat => <option key={cat} value={cat} />)}
                        </datalist>
                      </div>
                      <div className="ks-input-group">
                        <input className="ks-input" type="tel" name="contactNumber" placeholder="Contact Number *" value={joinFormData.contactNumber} onChange={handleJoinInputChange} required />
                      </div>
                    </div>

                    <div className="ks-input-group">
                      <input className="ks-input" type="text" name="priceRange" placeholder="Price Range (e.g. ₹50,000 - ₹1 Lakh)" value={joinFormData.priceRange} onChange={handleJoinInputChange} />
                    </div>
                    
                    <div className="ks-input-group">
                      <textarea className="ks-input" name="description" placeholder="Describe your services..." value={joinFormData.description} onChange={handleJoinInputChange}></textarea>
                    </div>

                    {/* Styled File Upload */}
                    <div className="ks-input-group">
                      <div className="ks-file-upload-wrapper">
                        <input type="file" multiple accept="image/*" onChange={handleJoinFileChange} className="ks-file-input" />
                        <UploadCloud size={28} color="#6B7280" style={{marginBottom: '8px'}} />
                        <span className="ks-file-label">Click or drag images to upload</span>
                        <span className="ks-file-subtext">Max 5 portfolio images</span>
                        {joinFiles.length > 0 && (
                          <div style={{ marginTop: '12px', color: '#111827', fontWeight: '600' }}>
                            {joinFiles.length} file(s) selected
                          </div>
                        )}
                      </div>
                    </div>

                    {joinSubmitStatus.error && <div className="ks-alert-error">{joinSubmitStatus.error}</div>}

                    <button type="submit" className="ks-btn-primary" disabled={joinSubmitStatus.loading} style={{marginTop: '8px'}}>
                      {joinSubmitStatus.loading ? "Submitting Application..." : "Submit Registration"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
