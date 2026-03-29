import React, { useState, useEffect, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const UserList = () => {
    const [allRequests, setAllRequests] = useState([]); // Holds all fetched data
    const [loading, setLoading] = useState(false);
    
    // Search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState(''); 
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const LIMIT = 5;

    const API_BASE_URL = 'https://kalyanashobha-back.vercel.app';

    // 1. Fetch data from the new Resolved Premium Requests API
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

    // Fetch on initial mount
    useEffect(() => {
        fetchResolvedUsers();
    }, []);

    // 2. Client-Side Search Filtering
    const filteredRequests = useMemo(() => {
        if (!searchQuery) return allRequests;
        
        const lowerSearch = searchQuery.toLowerCase();
        return allRequests.filter(req => {
            const user = req.userId;
            if (!user) return false; // Safety check in case user was deleted
            
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
    
    const currentUsers = useMemo(() => {
        const startIndex = (currentPage - 1) * LIMIT;
        return filteredRequests.slice(startIndex, startIndex + LIMIT);
    }, [filteredRequests, currentPage]);

    // Handlers
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setCurrentPage(1); // Reset to first page on new search
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

    // --- INTERNAL STYLES ---
    const styles = {
        container: {
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
            maxWidth: '1000px',
            margin: '40px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        },
        header: {
            color: '#b91c1c', // Thick Red
            borderBottom: '3px solid #b91c1c',
            paddingBottom: '10px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        searchForm: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
        },
        input: {
            flex: 1,
            padding: '12px 15px',
            fontSize: '16px',
            border: '2px solid #e5e7eb',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.3s'
        },
        primaryButton: {
            backgroundColor: '#b91c1c', // Thick Red
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
        },
        secondaryButton: {
            backgroundColor: '#f3f4f6',
            color: '#374151',
            border: '1px solid #d1d5db',
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '6px',
            cursor: 'pointer'
        },
        tableWrapper: {
            overflowX: 'auto',
            marginBottom: '20px'
        },
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left'
        },
        th: {
            backgroundColor: '#fef2f2', // Light red header background
            color: '#b91c1c', // Thick red text
            padding: '14px',
            fontWeight: 'bold',
            borderBottom: '2px solid #fca5a5'
        },
        td: {
            padding: '14px',
            borderBottom: '1px solid #f3f4f6',
            color: '#4b5563'
        },
        badge: {
            backgroundColor: '#dcfce7',
            color: '#166534',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold'
        },
        paginationContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
        },
        pageInfo: {
            color: '#6b7280',
            fontWeight: '500'
        },
        emptyState: {
            textAlign: 'center',
            padding: '40px',
            color: '#6b7280'
        }
    };

    return (
        <div style={styles.container}>
            <Toaster position="top-right" />
            
            <div style={styles.header}>
                <h2 style={{ margin: 0 }}>Resolved Premium Users</h2>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    Total Records: <strong>{totalUsers}</strong>
                </span>
            </div>

            <form style={styles.searchForm} onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search by Name, Email, Mobile, or Profile ID..."
                    style={styles.input}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onFocus={(e) => e.target.style.borderColor = '#b91c1c'}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
                <button type="submit" style={styles.primaryButton} disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
                {searchQuery && (
                    <button type="button" style={styles.secondaryButton} onClick={handleClearSearch}>
                        Clear
                    </button>
                )}
            </form>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Profile ID</th>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Contact Info</th>
                            <th style={styles.th}>Location</th>
                            <th style={styles.th}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#b91c1c' }}>
                                    <strong>Loading records...</strong>
                                </td>
                            </tr>
                        ) : currentUsers.length > 0 ? (
                            currentUsers.map((req) => {
                                const user = req.userId;
                                // Failsafe if user was deleted but request remained
                                if (!user) return null; 

                                return (
                                    <tr key={req._id}>
                                        <td style={styles.td}><strong>{user.uniqueId}</strong></td>
                                        <td style={styles.td}>{user.firstName} {user.lastName}</td>
                                        <td style={styles.td}>
                                            <div>{user.mobileNumber}</div>
                                            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{user.email}</div>
                                        </td>
                                        <td style={styles.td}>{user.city}, {user.state}</td>
                                        <td style={styles.td}>
                                            <span style={styles.badge}>{req.status}</span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="5" style={styles.emptyState}>
                                    No resolved users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 0 && (
                <div style={styles.paginationContainer}>
                    <button 
                        style={{...styles.secondaryButton, opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer'}}
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        &laquo; Previous
                    </button>
                    
                    <div style={styles.pageInfo}>
                        Page <strong style={{ color: '#b91c1c' }}>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </div>

                    <button 
                        style={{...styles.primaryButton, opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'}}
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
