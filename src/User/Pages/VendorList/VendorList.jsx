import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image as ImageIcon, X, Plus } from "lucide-react"; 
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
      <div className="ks-vendor-page">
        
        {/* HEADER SECTION */}
        <div className="ks-vendor-header">
          <div className="ks-header-text">
            <h1>Premium Wedding Vendors</h1>
            <p>Curated services to make your special day perfect.</p>
          </div>
          
          <button className="ks-btn-primary" onClick={handleOpenJoinModal}>
            <Plus size={18} /> Join as Vendor
          </button>
        </div>

        {/* VENDOR GRID */}
        <div className="ks-vendor-grid">
          {loading ? (
            .map(n => <div key={n} className="ks-skeleton-card"></div>)
          ) : vendors.length === 0 ? (
            <div className="ks-empty-state">
              <h3>No Vendors Found</h3>
              <p>Check back later for new listings.</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="ks-vendor-card">
                
                {/* Image Section */}
                <div className="ks-card-img-wrapper">
                  {vendor.images && vendor.images.length > 0 ? (
                    <img src={vendor.images} alt={vendor.businessName} />
                  ) : (
                    <ImageIcon className="ks-img-placeholder" size={48} />
                  )}
                  <span className="ks-badge">{vendor.category}</span>
                </div>

                {/* Content Section */}
                <div className="ks-card-body">
                  <h3 className="ks-card-title">{vendor.businessName}</h3>
                  <p className="ks-card-desc">
                    {vendor.description ? vendor.description.substring(0, 80) + "..." : "No description available."}
                  </p>
                  
                  {/* Contact Button */}
                  <button 
                    className="ks-btn-outline" 
                    onClick={() => handleOpenModal(vendor)}
                  >
                    Contact Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- Contact Vendor Modal --- */}
        {selectedVendor && (
          <div className="ks-modal-overlay">
            <div className="ks-modal-box">
              <button className="ks-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
              
              <h2>Contact {selectedVendor.businessName}</h2>
              <p>Our concierge team will connect you.</p>

              {submitStatus.success ? (
                <div className="ks-msg-success">
                  Request sent successfully! We will be in touch soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="ks-form">
                  <input 
                    type="text" name="name" placeholder="Full Name" 
                    value={formData.name} onChange={handleInputChange} required 
                  />
                  <input 
                    type="tel" name="phone" placeholder="Phone Number" 
                    value={formData.phone} onChange={handleInputChange} required 
                  />
                  <input 
                    type="email" name="email" placeholder="Email Address" 
                    value={formData.email} onChange={handleInputChange} 
                  />
                  <textarea 
                    name="message" placeholder="What are your requirements? (e.g., Dates, Venue)" 
                    value={formData.message} onChange={handleInputChange} required rows="4"
                  ></textarea>

                  {submitStatus.error && <div className="ks-msg-error">{submitStatus.error}</div>}

                  <button type="submit" className="ks-btn-primary ks-btn-submit" disabled={submitStatus.loading}>
                    {submitStatus.loading ? "Sending..." : "Send Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* --- Join as Vendor Modal --- */}
        {showJoinModal && (
          <div className="ks-modal-overlay">
            <div className="ks-modal-box large">
              <button className="ks-modal-close" onClick={handleCloseJoinModal}>
                <X size={24} />
              </button>
              
              <h2>Register Your Business</h2>
              <p>Join KalyanaShobha and connect with thousands of couples.</p>

              {joinSubmitStatus.success ? (
                <div className="ks-msg-success">
                  <h3>Registration Submitted!</h3>
                  <p style={{margin: '10px 0 0', color: 'inherit'}}>Our admin team will review your application. You will receive an email once your profile is approved and live.</p>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="ks-form">
                  
                  <div className="ks-form-row">
                    <div className="ks-form-group">
                      <input type="text" name="businessName" placeholder="Business Name *" value={joinFormData.businessName} onChange={handleJoinInputChange} required />
                    </div>
                    <div className="ks-form-group">
                      <input type="email" name="email" placeholder="Business Email *" value={joinFormData.email} onChange={handleJoinInputChange} required />
                    </div>
                  </div>
                  
                  <div className="ks-form-row">
                    <div className="ks-form-group">
                      <input type="text" name="category" list="vendor-categories" placeholder="Select Category *" value={joinFormData.category} onChange={handleJoinInputChange} required />
                      <datalist id="vendor-categories">
                        {categories.map(cat => <option key={cat} value={cat} />)}
                      </datalist>
                    </div>
                    <div className="ks-form-group">
                      <input type="tel" name="contactNumber" placeholder="Contact Number *" value={joinFormData.contactNumber} onChange={handleJoinInputChange} required />
                    </div>
                  </div>

                  <div className="ks-form-group">
                    <input type="text" name="priceRange" placeholder="Price Range (e.g. ₹50,000 - ₹1 Lakh)" value={joinFormData.priceRange} onChange={handleJoinInputChange} />
                  </div>
                  
                  <div className="ks-form-group">
                    <textarea name="description" placeholder="Describe your services..." value={joinFormData.description} onChange={handleJoinInputChange} rows="3"></textarea>
                  </div>

                  <div className="ks-form-group">
                    <label>Upload Portfolio Images (Max 5)</label>
                    <div className="ks-file-upload">
                      <label htmlFor="file-upload" className="ks-file-label">
                        Click here to browse files
                      </label>
                      <input id="file-upload" type="file" multiple accept="image/*" onChange={handleJoinFileChange} />
                      {joinFiles.length > 0 && (
                        <span className="ks-file-count">{joinFiles.length} file(s) selected</span>
                      )}
                    </div>
                  </div>

                  {joinSubmitStatus.error && <div className="ks-msg-error">{joinSubmitStatus.error}</div>}

                  <button type="submit" className="ks-btn-primary ks-btn-submit" disabled={joinSubmitStatus.loading}>
                    {joinSubmitStatus.loading ? "Submitting Application..." : "Submit Registration"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
