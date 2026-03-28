import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import html2pdf from "html2pdf.js"; 
import { Search, ChevronLeft, ChevronRight, ChevronDown, Download, FileText } from "lucide-react";
import './AdminCertificates.css'; 

const AdminCertificates = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Fixed Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4; // Changed to 4 items for both Desktop and Mobile

  // Scroll Indicator State
  const [showMainScroll, setShowMainScroll] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        "https://kalyanashobha-back.vercel.app/api/admin/users",
        { headers: { Authorization: token } }
      );
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING & PAGINATION LOGIC ---
  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const uniqueId = (user.uniqueId || "").toLowerCase();

    return fullName.includes(searchLower) || uniqueId.includes(searchLower);
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage) || 1;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // --- MOBILE ONLY SCROLL INDICATOR LOGIC ---
  useEffect(() => {
    const checkMainScroll = () => {
        // 1. Hide on desktop entirely
        if (window.innerWidth > 768) {
            setShowMainScroll(false);
            return;
        }

        // 2. Hide if there is 1 or fewer items
        if (currentUsers.length <= 1) {
            setShowMainScroll(false);
            return;
        }

        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 3. Check if the document is taller than the viewport.
        const isScrollable = documentHeight > windowHeight + 80;

        // 4. Check if we haven't scrolled to the very bottom yet
        const isNotAtBottom = scrollY + windowHeight < documentHeight - 30;

        // 5. Only show the indicator if it's scrollable AND we aren't at the bottom
        setShowMainScroll(isScrollable && isNotAtBottom);
    };

    const timer = setTimeout(checkMainScroll, 50); 
    window.addEventListener('scroll', checkMainScroll);
    window.addEventListener('resize', checkMainScroll);

    return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', checkMainScroll);
        window.removeEventListener('resize', checkMainScroll);
    };
  }, [currentUsers, currentPage]);

  const downloadCertificate = async (userId, userName) => {
    setProcessingId(userId);
    const loadToast = toast.loading("Downloading Certificate...");

    try {
      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `https://kalyanashobha-back.vercel.app/api/admin/user-certificate/${userId}`,
        {
          headers: { Authorization: token },
          responseType: "text", 
        }
      );

      const element = document.createElement('div');
      element.innerHTML = response.data;
      element.style.width = '100%'; 

      const options = {
        margin:       [10, 10],
        filename:     `${userName.replace(/\s+/g, '_')}_Certificate.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(options).from(element).save();
      toast.success("Download started!");

    } catch (error) {
      console.error(error);
      toast.error("Error generating PDF");
    } finally {
      toast.dismiss(loadToast);
      setProcessingId(null);
    }
  };

  return (
    <div className="ac-layout">
      <Toaster position="top-right" />

      <div className="ac-header">
        <div className="ac-title-group">
          <h2>User Certificates</h2>
          <p>Generate and manage digital signature certificates for users.</p>
        </div>

        <div className="ac-search-group">
          <Search size={16} className="ac-search-icon" />
          <input
            type="text"
            className="ac-search-input"
            placeholder="Search by Name or Profile ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ac-data-card">
        {loading ? (
          <div className="ac-skeleton-stack">
            {/* Reduced to 4 skeleton rows */}
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="ac-skeleton-row">
                <div className="ac-sk-box ac-sk-id"></div>
                <div className="ac-sk-box ac-sk-name"></div>
                <div className="ac-sk-box ac-sk-email"></div>
                <div className="ac-sk-box ac-sk-status"></div>
                <div className="ac-sk-box ac-sk-action"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="ac-table-wrapper">
              <table className="ac-data-table">
                <thead>
                  <tr>
                    <th>Profile ID</th>
                    <th>User Name</th>
                    <th>Email Address</th>
                    <th>Legal Status</th>
                    <th className="ac-text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user._id}>
                        <td data-label="Profile ID">
                          <span className="ac-id-badge">{user.uniqueId || "N/A"}</span>
                        </td>
                        <td data-label="User Name">
                          <strong>{user.firstName} {user.lastName}</strong>
                        </td>
                        <td data-label="Email Address">
                          <span className="ac-text-muted">{user.email}</span>
                        </td>

                        <td data-label="Legal Status">
                          {user.digitalSignature ? (
                            <span className="ac-status-badge ac-signed">✓ Signed</span>
                          ) : (
                            <span className="ac-status-badge ac-pending">Pending</span>
                          )}
                        </td>

                        <td data-label="Action" className="ac-text-right">
                          <div className="ac-action-group">
                            {user.digitalSignature ? (
                              <button
                                className="ac-btn-download"
                                onClick={() => downloadCertificate(user._id, user.firstName)}
                                disabled={processingId === user._id}
                              >
                                {processingId === user._id ? (
                                  <span className="ac-spinner-small"></span>
                                ) : (
                                  <Download size={14} />
                                )}
                                {processingId === user._id ? "Generating..." : "Download PDF"}
                              </button>
                            ) : (
                              <button className="ac-btn-disabled" disabled>
                                Not Available
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="ac-empty-cell">
                        <div className="ac-state-view empty">
                          <FileText size={48} />
                          <h3>No users found</h3>
                          <p>No users match "{searchTerm}".</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ALWAYS VISIBLE CIRCULAR PAGINATION DESIGN */}
            {!loading && totalPages >= 1 && (
              <div className="ac-pagination-container">
                  <button 
                      className="ac-page-btn-circle" 
                      onClick={handlePrevPage} 
                      disabled={currentPage === 1}
                  >
                      <ChevronLeft size={20} />
                  </button>

                  <span className="ac-page-text">
                      Page {currentPage} of {totalPages}
                  </span>

                  <button 
                      className="ac-page-btn-circle" 
                      onClick={handleNextPage} 
                      disabled={currentPage === totalPages}
                  >
                      <ChevronRight size={20} />
                  </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* MOBILE ONLY SCROLL INDICATOR */}
      {showMainScroll && (
          <div className="ac-scroll-indicator">
              <ChevronDown size={18} />
              <span>Scroll for more</span>
          </div>
      )}
    </div>
  );
};

export default AdminCertificates;
