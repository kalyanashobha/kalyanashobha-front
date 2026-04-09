import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { RefreshCw, Paperclip, X, CheckCircle, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import './AdminHelpCenter.css'; 

const AdminHelpCenter = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [adminReply, setAdminReply] = useState('');
  const [resolving, setResolving] = useState(false);
  const [showImage, setShowImage] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; 
  const [showMainScroll, setShowMainScroll] = useState(false);

  useEffect(() => {
    fetchIssues();
  }, []);

  const totalPages = Math.ceil(issues.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = issues.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    const checkMainScroll = () => {
        if (window.innerWidth > 768) {
            setShowMainScroll(false);
            return;
        }
        if (currentItems.length <= 1 || selectedIssue) {
            setShowMainScroll(false);
            return;
        }

        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const isScrollable = documentHeight > windowHeight + 80;
        const isNotAtBottom = scrollY + windowHeight < documentHeight - 30;

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
  }, [currentItems, currentPage, selectedIssue]);

  const fetchIssues = async () => {
    setLoading(true);
    const token = localStorage.getItem('adminToken'); 

    try {
      const response = await fetch('https://kalyanashobha-back.vercel.app/api/admin/help-center/issues', {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();

      if (data.success) {
        setIssues(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch issues.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      toast.error('A network error occurred while fetching issues.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!adminReply.trim()) return;

    setResolving(true);
    const toastId = toast.loading("Submitting resolution...");
    const token = localStorage.getItem('adminToken');

    try {
      const response = await fetch('https://kalyanashobha-back.vercel.app/api/admin/help-center/resolve', {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          issueId: selectedIssue._id,
          adminReply: adminReply
        })
      });

      const data = await response.json();

      if (data.success) {
        setIssues(issues.map(issue => 
          issue._id === selectedIssue._id ? { ...issue, status: 'Resolved' } : issue
        ));
        toast.update(toastId, { render: "Issue resolved successfully!", type: "success", isLoading: false, autoClose: 3000 });
        closeModal();
      } else {
        toast.update(toastId, { render: data.message || 'Failed to resolve the issue.', type: "error", isLoading: false, autoClose: 3000 });
      }
    } catch (err) {
      console.error('Resolve error:', err);
      toast.update(toastId, { render: 'An error occurred while submitting the resolution.', type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setResolving(false);
    }
  };

  const openModal = (issue) => {
    setSelectedIssue(issue);
    setAdminReply('');
    setShowImage(false); 
  };

  const closeModal = () => {
    setSelectedIssue(null);
    setAdminReply('');
    setShowImage(false); 
  };

  return (
    <div className="kah-layout">
      <ToastContainer position="top-right" theme="colored" />

      <div className="kah-header">
        <div className="kah-title-group">
          <h2>Help Center Management</h2>
          <p>Review and resolve user support tickets.</p>
        </div>
        <button onClick={fetchIssues} className="kah-refresh-btn">
          <RefreshCw size={14} /> Refresh List
        </button>
      </div>

      <div className="kah-data-card">
        <div className="kah-table-wrapper">
          <table className="kah-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>User Details</th>
                <th>Subject</th>
                <th>Status</th>
                <th className="kah-text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                /* CORRECTED SKELETON: Rendered exactly like real data rows */
                [1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td data-label="Date">
                      <div className="kah-date-cell">
                          <div className="kah-sk-box" style={{ width: '14px', height: '14px', borderRadius: '50%' }}></div>
                          <div className="kah-sk-box" style={{ width: '70px' }}></div>
                      </div>
                    </td>
                    <td data-label="User Details">
                      <div className="kah-info-stack">
                          <div className="kah-sk-box" style={{ width: '120px', height: '14px' }}></div>
                          <div className="kah-sk-box" style={{ width: '80px', height: '12px' }}></div>
                      </div>
                    </td>
                    <td data-label="Subject">
                      <div className="kah-info-stack">
                        <div className="kah-sk-box" style={{ width: '160px', height: '14px' }}></div>
                        <div className="kah-sk-box" style={{ width: '220px', height: '12px' }}></div>
                      </div>
                    </td>
                    <td data-label="Status">
                      <div className="kah-sk-box" style={{ width: '70px', height: '24px', borderRadius: '20px' }}></div>
                    </td>
                    <td data-label="Action" className="kah-text-right">
                      <div className="kah-action-group">
                        <div className="kah-sk-box" style={{ width: '110px', height: '34px', borderRadius: '8px' }}></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan="5" className="kah-empty-cell">
                    <div className="kah-state-view empty">
                        <CheckCircle size={48} className="kah-empty-icon" />
                        <h3>No active support tickets</h3>
                        <p>All user inquiries have been successfully addressed. There are no pending issues at this time.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((issue) => (
                  <tr key={issue._id}>
                    <td data-label="Date">
                        <div className="kah-date-cell">
                            <Clock size={14} className="kah-icon-sub"/>
                            <span className="kah-date-text">
                                {new Date(issue.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </td>
                    <td data-label="User Details">
                      <div className="kah-info-stack">
                        <strong className="kah-user-name">
                            {issue.userId?.firstName} {issue.userId?.lastName}
                        </strong>
                        <span className="kah-text-muted">ID: {issue.userId?.uniqueId || "N/A"}</span>
                      </div>
                    </td>
                    <td data-label="Subject">
                      <div className="kah-info-stack">
                        <strong className="kah-subject-text">{issue.subject}</strong>
                        <span className="kah-summary-text" title={issue.summary}>
                          {issue.summary}
                        </span>
                      </div>
                    </td>
                    <td data-label="Status">
                      <span className={`kah-status-badge ${issue.status === 'Resolved' ? 'Resolved' : 'Pending'}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td data-label="Action" className="kah-text-right">
                      <div className="kah-action-group">
                        <button onClick={() => openModal(issue)} className="kah-btn-outline-primary">
                          View & Reply
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalPages >= 1 && (
            <div className="kah-pagination-container">
                <button 
                    className="kah-page-btn-circle" 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                >
                    <ChevronLeft size={20} />
                </button>

                <span className="kah-page-text">
                    Page {currentPage} of {totalPages}
                </span>

                <button 
                    className="kah-page-btn-circle" 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        )}

      </div>

      {showMainScroll && (
          <div className="kah-scroll-indicator">
              <ChevronDown size={18} />
              <span>Scroll for more</span>
          </div>
      )}

      {selectedIssue && (
        <div className="kah-modal-overlay" onClick={closeModal}>
          <div className="kah-modal-content" onClick={e => e.stopPropagation()}>

            <div className="kah-modal-header">
              <h3>Ticket Details</h3>
              <button onClick={closeModal} className="kah-modal-close"><X size={20} /></button>
            </div>

            <div className="kah-modal-body">
              <div className="kah-info-grid">
                <div className="kah-info-block">
                  <span className="kah-info-label">Reported By</span>
                  <div className="kah-info-value">{selectedIssue.userId?.firstName} {selectedIssue.userId?.lastName}</div>
                  <div className="kah-info-sub">{selectedIssue.userId?.email}</div>
                  <div className="kah-info-sub">{selectedIssue.userId?.mobileNumber}</div>
                </div>
                <div className="kah-info-block">
                  <span className="kah-info-label">Current Status</span>
                  <span className={`kah-status-badge ${selectedIssue.status === 'Resolved' ? 'Resolved' : 'Pending'}`} style={{ marginTop: '4px' }}>
                    {selectedIssue.status}
                  </span>
                </div>
              </div>

              <div className="kah-issue-details-box">
                <h4 className="kah-issue-title">{selectedIssue.subject}</h4>
                <p className="kah-issue-summary-full">{selectedIssue.summary}</p>

                {selectedIssue.screenshotUrl && (
                  <div className="kah-attachment-wrap">
                    <button 
                      type="button"
                      onClick={() => setShowImage(!showImage)}
                      className="kah-attachment-toggle"
                    >
                      <Paperclip size={14} /> {showImage ? 'Hide Attached Screenshot' : 'View Attached Screenshot'}
                    </button>

                    {showImage && (
                      <div className="kah-image-preview-box">
                        <img 
                          src={selectedIssue.screenshotUrl} 
                          alt="User attached screenshot" 
                          className="kah-attached-image"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {selectedIssue.status !== 'Resolved' && (
                <form onSubmit={handleResolveSubmit} className="kah-reply-form">
                  <div className="kah-form-group">
                    <label htmlFor="reply" className="kah-label">
                      Admin Reply & Resolution <span className="kah-required">*</span>
                    </label>
                    <textarea
                      id="reply"
                      rows="4"
                      value={adminReply}
                      onChange={(e) => setAdminReply(e.target.value)}
                      className="kah-input"
                      placeholder="Type your resolution message here. This will be emailed directly to the user..."
                      required
                    ></textarea>
                  </div>

                  <div className="kah-modal-footer">
                    <button type="button" onClick={closeModal} className="kah-btn-cancel">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={resolving || !adminReply.trim()}
                      className="kah-btn-approve"
                    >
                      {resolving ? 'Sending...' : 'Mark as Resolved & Send'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelpCenter;
