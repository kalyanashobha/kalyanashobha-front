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
      <div className="wd-directory-wrapper">
        
        {/* HEADER SECTION */}
        <div className="wd-header-section">
          <div className="wd-header-text">
            <h1>Premium Wedding Vendors</h1>
            <p>Curated services to make your special day perfect.</p>
          </div>
          
          <button className="wd-action-btn" onClick={handleOpenJoinModal}>
            <Plus size={18} /> Join as Vendor
          </button>
        </div>

        {/* VENDOR GRID */}
        <div className="wd-vendor-grid">
          {loading ? (
             [1,2,3,4,5,6].map(n => <div key={n} className="wd-skeleton-card"></div>)
          ) : vendors.length === 0 ? (
            <div className="wd-empty-state">
              <h3>No Vendors Found</h3>
              <p>Check back later for new listings.</p>
            </div>
          ) : (
            vendors.map((vendor) => (
              <div key={vendor._id} className="wd-vendor-card">
                
                {/* Image Section */}
                <div className="wd-card-hero">
                  {vendor.images && vendor.images.length > 0 ? (
                    <img src={vendor.images[0]} alt={vendor.businessName} />
                  ) : (
                    <div className="wd-img-placeholder"><ImageIcon size={40} /></div>
                  )}
                  <span className="wd-category-tag">{vendor.category}</span>
                </div>

                {/* Content Section */}
                <div className="wd-card-body">
                  <h3>{vendor.businessName}</h3>
                  <p>
                    {vendor.description ? vendor.description.substring(0, 80) + "..." : "No description available."}
                  </p>
                  
                  {/* Contact Button */}
                  <button 
                    className="wd-card-btn" 
                    onClick={() => handleOpenModal(vendor)}
                  >
                    Contact Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* --- EXISTING: Contact Vendor Modal --- */}
        {selectedVendor && (
          <div className="wd-modal-backdrop">
            <div className="wd-modal-box">
              <button className="wd-btn-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
              
              <h2>Contact {selectedVendor.businessName}</h2>
              <p className="wd-modal-subtitle">Our concierge team will connect you.</p>

              {submitStatus.success ? (
                <div className="wd-msg-success">
                  Request sent successfully! We will be in touch soon.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="wd-form-container">
                  <div className="wd-input-group">
                    <input 
                      type="text" name="name" placeholder="Full Name" 
                      value={formData.name} onChange={handleInputChange} required 
                    />
                  </div>
                  <div className="wd-input-group">
                    <input 
                      type="tel" name="phone" placeholder="Phone Number" 
                      value={formData.phone} onChange={handleInputChange} required 
                    />
                  </div>
                  <div className="wd-input-group">
                    <input 
                      type="email" name="email" placeholder="Email Address" 
                      value={formData.email} onChange={handleInputChange} 
                    />
                  </div>
                  <div className="wd-input-group">
                    <textarea 
                      name="message" placeholder="What are your requirements? (e.g., Dates, Venue)" 
                      value={formData.message} onChange={handleInputChange} required rows="3"
                    ></textarea>
                  </div>

                  {submitStatus.error && <div className="wd-msg-error">{submitStatus.error}</div>}

                  <button type="submit" className="wd-submit-btn" disabled={submitStatus.loading}>
                    {submitStatus.loading ? "Sending..." : "Send Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* --- NEW: Join as Vendor Modal --- */}
        {showJoinModal && (
          <div className="wd-modal-backdrop">
            <div className="wd-modal-box wd-large-modal">
              <button className="wd-btn-close" onClick={handleCloseJoinModal}>
                <X size={20} />
              </button>
              
              <h2>Register Your Business</h2>
              <p className="wd-modal-subtitle">Join KalyanaShobha and connect with thousands of couples.</p>

              {joinSubmitStatus.success ? (
                <div className="wd-msg-success">
                  <h3>Registration Submitted!</h3>
                  <p>Our admin team will review your application. You will receive an email once your profile is approved and live.</p>
                </div>
              ) : (
                <form onSubmit={handleJoinSubmit} className="wd-form-container">
                  
                  {/* Row 1 */}
                  <div className="wd-form-row">
                    <div className="wd-input-group">
                      <input 
                        type="text" name="businessName" placeholder="Business Name *" 
                        value={joinFormData.businessName} onChange={handleJoinInputChange} required 
                      />
                    </div>
                    <div className="wd-input-group">
                      <input 
                        type="email" name="email" placeholder="Business Email *" 
                        value={joinFormData.email} onChange={handleJoinInputChange} required 
                      />
                    </div>
                  </div>
                  
                  {/* Row 2 */}
                  <div className="wd-form-row">
                    <div className="wd-input-group">
                      <input 
                        type="text" name="category" list="vendor-categories" placeholder="Select Category *" 
                        value={joinFormData.category} onChange={handleJoinInputChange} required 
                      />
                      <datalist id="vendor-categories">
                        {categories.map(cat => <option key={cat} value={cat} />)}
                      </datalist>
                    </div>
                    <div className="wd-input-group">
                      <input 
                        type="tel" name="contactNumber" placeholder="Contact Number *" 
                        value={joinFormData.contactNumber} onChange={handleJoinInputChange} required 
                      />
                    </div>
                  </div>

                  {/* Row 3 */}
                  <div className="wd-input-group">
                    <input 
                      type="text" name="priceRange" placeholder="Price Range (e.g. ₹50,000 - ₹1 Lakh)" 
                      value={joinFormData.priceRange} onChange={handleJoinInputChange} 
                    />
                  </div>
                  
                  {/* Row 4 */}
                  <div className="wd-input-group">
                    <textarea 
                      name="description" placeholder="Describe your services..." 
                      value={joinFormData.description} onChange={handleJoinInputChange} rows="3"
                    ></textarea>
                  </div>

                  {/* File Upload */}
                  <div className="wd-input-group">
                    <label>Upload Portfolio Images (Max 5)</label>
                    <div className="wd-file-upload">
                      <input 
                        type="file" multiple accept="image/*" 
                        onChange={handleJoinFileChange} 
                      />
                    </div>
                    {joinFiles.length > 0 && (
                      <span className="wd-file-hint">{joinFiles.length} file(s) selected</span>
                    )}
                  </div>

                  {joinSubmitStatus.error && <div className="wd-msg-error">{joinSubmitStatus.error}</div>}

                  <button type="submit" className="wd-submit-btn" disabled={joinSubmitStatus.loading}>
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
