import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Search, ChevronLeft, ChevronRight, ChevronDown, CheckCircle, UserCheck } from 'lucide-react';
import './UserList.css'; 

const UserList = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 6; // Fixed 6 items to match other components

    // Scroll Indicator State
    const [showMainScroll, setShowMainScroll] = useState(false);

    const API_BASE_URL = 'https://kalyanashobha-back.vercel.app';

    // 1. Fetch data
    const fetchResolvedUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken'); 

        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/premium-requests/resolved`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token 
                }
            });

            const data = await response.json();

            if (data.success) {
                // BUG FIX: Filter out any "orphaned" requests where the user was deleted (req.userId is null)
                // This ensures the Total Count perfectly matches the Rendered Items.
                const validRequests = (data.data || []).filter(req => req.userId);
                setAllRequests(validRequests);
            } else {
                toast.error(data.message || 'Failed to fetch premium users');
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error('Server error while fetching premium users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResolvedUsers();
    }, []);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // 2. Client-Side Search Filtering
    const filteredRequests = useMemo(() => {
        if (!searchQuery) return allRequests;

        const lowerSearch = searchQuery.toLowerCase();
        return allRequests.filter(req => {
            const user = req.userId;
            return (
                (user.firstName && user.firstName.toLowerCase().includes(lowerSearch)) ||
                (user.lastName && user.lastName.toLowerCase().includes(lowerSearch)) ||
                (user.email && user.email.toLowerCase().includes(lowerSearch)) ||
                (user.mobileNumber && user.mobileNumber.toLowerCase().includes(lowerSearch)) ||
                (user.uniqueId && user.uniqueId.toLowerCase().includes(lowerSearch))
            );
        });
    }, [allRequests, searchQuery]);

    // 3. Client-Side Pagination Calculations
    const totalUsers = filteredRequests.length;
    const totalPages = Math.ceil(totalUsers / LIMIT) || 1;
    const startIndex = (currentPage - 1) * LIMIT;
    const currentUsers = filteredRequests.slice(startIndex, startIndex + LIMIT);

    // Universal Scroll Indicator Logic
    useEffect(() => {
        const checkMainScroll = () => {
            if (filteredRequests.length === 0) {
                setShowMainScroll(false);
                return;
            }
            const scrollY = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            setShowMainScroll(documentHeight > windowHeight + 20 && scrollY + windowHeight < documentHeight - 30);
        };

        const timer = setTimeout(checkMainScroll, 500); 
        window.addEventListener('scroll', checkMainScroll);
        window.addEventListener('resize', checkMainScroll);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', checkMainScroll);
            window.removeEventListener('resize', checkMainScroll);
        };
    }, [filteredRequests, currentPage]);

    return (
        <div className="ul-layout">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="ul-header">
                <div className="ul-title-group">
                    <h2>Resolved Premium Users</h2>
                    <p>View users who have successfully received premium assistance.</p>
                </div>
                <div className="ul-header-actions">
                    <span className="ul-count-badge">
                        Total Records: <strong>{totalUsers}</strong>
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="ul-controls-group">
                <div className="ul-search-group">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name, Email, Mobile, or Profile ID..."
                        className="ul-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Data Table / Cards */}
            <div className="ul-data-card">
                {loading ? (
                    <div className="ul-skeleton-stack">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="ul-skeleton-row">
                                <div className="ul-skel-box ul-skel-id"></div>
                                <div className="ul-skel-box ul-skel-name"></div>
                                <div className="ul-skel-box ul-skel-contact"></div>
                                <div className="ul-skel-box ul-skel-loc"></div>
                                <div className="ul-skel-box ul-skel-status"></div>
                            </div>
                        ))}
                    </div>
                ) : currentUsers.length === 0 ? (
                    <div className="ul-state-view empty">
                        <UserCheck size={48} />
                        <h3>No resolved users found</h3>
                        <p>{searchQuery ? `No users match "${searchQuery}".` : "There are no resolved premium requests yet."}</p>
                    </div>
                ) : (
                    <>
                        <div className="ul-table-wrapper">
                            <table className="ul-data-table">
                                <thead>
                                    <tr>
                                        <th>Profile ID</th>
                                        <th>User Name</th>
                                        <th>Contact Info</th>
                                        <th>Location</th>
                                        <th className="ul-text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((req) => {
                                        const user = req.userId;
                                        return (
                                            <tr key={req._id}>
                                                <td data-label="Profile ID">
                                                    <span className="ul-id-badge">{user.uniqueId || 'N/A'}</span>
                                                </td>
                                                <td data-label="User Name">
                                                    <strong>{user.firstName} {user.lastName}</strong>
                                                </td>
                                                <td data-label="Contact Info">
                                                    <div className="ul-info-stack">
                                                        <span className="ul-primary-text">{user.mobileNumber || 'N/A'}</span>
                                                        <span className="ul-text-muted">{user.email || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td data-label="Location">
                                                    <div className="ul-info-stack">
                                                        <span className="ul-primary-text">{user.city || 'N/A'}</span>
                                                        <span className="ul-text-muted">{user.state || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td data-label="Status" className="ul-text-right">
                                                    <span className="ul-status-badge">
                                                        <CheckCircle size={14} /> {req.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* CIRCULAR PAGINATION DESIGN */}
                        {totalPages > 1 && (
                            <div className="ul-pagination-container">
                                <button 
                                    className="ul-page-btn-circle" 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                
                                <span className="ul-page-text">
                                    Page {currentPage} of {totalPages}
                                </span>

                                <button 
                                    className="ul-page-btn-circle" 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* SCROLL INDICATOR */}
            {showMainScroll && (
                <div className="ul-scroll-indicator">
                    <ChevronDown size={18} />
                    <span>Scroll for more</span>
                </div>
            )}
        </div>
    );
};

export default UserList;
