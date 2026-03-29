import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const UserList = () => {
    const [allRequests, setAllRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState(''); 
    
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 5;

    const API_BASE_URL = 'https://kalyanashobha-back.vercel.app';

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
                setAllRequests(data.data);
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

    const filteredRequests = useMemo(() => {
        if (!searchQuery) return allRequests;
        
        const lowerSearch = searchQuery.toLowerCase();
        return allRequests.filter(req => {
            const user = req.userId;
            if (!user) return false; 
            
            return (
                (user.firstName && user.firstName.toLowerCase().includes(lowerSearch)) ||
                (user.lastName && user.lastName.toLowerCase().includes(lowerSearch)) ||
                (user.email && user.email.toLowerCase().includes(lowerSearch)) ||
                (user.mobileNumber && user.mobileNumber.toLowerCase().includes(lowerSearch)) ||
                (user.uniqueId && user.uniqueId.toLowerCase().includes(lowerSearch))
            );
        });
    }, [allRequests, searchQuery]);

    const totalUsers = filteredRequests.length;
    const totalPages = Math.ceil(totalUsers / LIMIT) || 1;
    
    const currentUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * LIMIT;
        return filteredRequests.slice(startIndex, startIndex + LIMIT);
    }, [filteredRequests, currentPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); 
        setSearchQuery(searchInput);
        if (searchInput) {
            toast.success(`Showing results for "${searchInput}"`);
        }
    };

    const handleClearSearch = () => {
        setSearchInput('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    return (
        <div className="admin-container">
            {/* INTERNAL CSS BLOCK */}
            <style>{`
                .admin-container {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    max-width: 1050px;
                    margin: 40px auto;
                    padding: 30px;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0,0,0,0.02);
                    color: #111827;
                }

                .admin-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 2px solid #fee2e2;
                    padding-bottom: 20px;
                    margin-bottom: 24px;
                }

                .admin-header h2 {
                    margin: 0;
                    color: #b91c1c;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: -0.02em;
                }

                .record-count {
                    background-color: #f3f4f6;
                    color: #4b5563;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: 600;
                }

                .record-count strong {
                    color: #111827;
                }

                .search-form {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                }

                .search-input {
                    flex: 1;
                    padding: 12px 16px;
                    font-size: 15px;
                    color: #374151;
                    background-color: #f9fafb;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    outline: none;
                    transition: all 0.2s ease-in-out;
                }

                .search-input:focus {
                    background-color: #ffffff;
                    border-color: #b91c1c;
                    box-shadow: 0 0 0 4px rgba(185, 28, 28, 0.1);
                }

                .btn {
                    padding: 12px 24px;
                    font-size: 14px;
                    font-weight: 600;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .btn-primary {
                    background-color: #b91c1c;
                    color: #ffffff;
                }

                .btn-primary:hover:not(:disabled) {
                    background-color: #991b1b;
                    transform: translateY(-1px);
                }

                .btn-primary:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn-secondary {
                    background-color: #ffffff;
                    color: #4b5563;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover:not(:disabled) {
                    background-color: #f3f4f6;
                    color: #111827;
                }

                .table-wrapper {
                    overflow-x: auto;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    margin-bottom: 24px;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    white-space: nowrap;
                }

                .admin-table th {
                    background-color: #fef2f2;
                    color: #991b1b;
                    padding: 16px;
                    font-size: 12px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    border-bottom: 2px solid #fca5a5;
                }

                .admin-table td {
                    padding: 16px;
                    font-size: 14px;
                    color: #374151;
                    border-bottom: 1px solid #f3f4f6;
                    vertical-align: middle;
                }

                .admin-table tbody tr {
                    transition: background-color 0.15s ease;
                }

                .admin-table tbody tr:hover {
                    background-color: #f9fafb;
                }

                .admin-table tbody tr:last-child td {
                    border-bottom: none;
                }

                .unique-id {
                    font-family: monospace;
                    background: #f3f4f6;
                    padding: 4px 8px;
                    border-radius: 4px;
                    color: #4b5563;
                    font-weight: 600;
                }

                .contact-subtext {
                    font-size: 12px;
                    color: #6b7280;
                    margin-top: 4px;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    background-color: #dcfce7;
                    color: #166534;
                    padding: 6px 12px;
                    border-radius: 9999px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .empty-state {
                    text-align: center;
                    padding: 48px 20px;
                    color: #6b7280;
                    font-size: 15px;
                }

                .pagination-wrapper {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 10px;
                }

                .page-info {
                    font-size: 14px;
                    color: #6b7280;
                    font-weight: 500;
                }

                @media (max-width: 640px) {
                    .admin-container {
                        margin: 10px;
                        padding: 20px;
                    }
                    .admin-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }
                    .search-form {
                        flex-direction: column;
                    }
                    .search-input, .btn {
                        width: 100%;
                    }
                }
            `}</style>

            <Toaster position="top-right" />
            
            <div className="admin-header">
                <h2>Resolved Premium Users</h2>
                <div className="record-count">
                    Total Records: <strong>{totalUsers}</strong>
                </div>
            </div>

            <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by Name, Email, Mobile, or Profile ID..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
                {searchQuery && (
                    <button type="button" className="btn btn-secondary" onClick={handleClearSearch}>
                        Clear
                    </button>
                )}
            </form>

            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Profile ID</th>
                            <th>Name</th>
                            <th>Contact Info</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    <strong style={{ color: '#b91c1c' }}>Loading records...</strong>
                                </td>
                            </tr>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((req) => {
                                const user = req.userId;
                                if (!user) return null; 

                                return (
                                    <tr key={req._id}>
                                        <td><span className="unique-id">{user.uniqueId}</span></td>
                                        <td style={{ fontWeight: 500 }}>{user.firstName} {user.lastName}</td>
                                        <td>
                                            <div>{user.mobileNumber}</div>
                                            <div className="contact-subtext">{user.email}</div>
                                        </td>
                                        <td>{user.city}, {user.state}</td>
                                        <td>
                                            <span className="status-badge">{req.status}</span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No resolved users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 0 && (
                <div className="pagination-wrapper">
                    <button 
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &laquo; Previous
                    </button>
                    
                    <div className="page-info">
                        Page <strong style={{ color: '#111827' }}>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </div>

                    <button 
                        className="btn btn-secondary"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserList;
