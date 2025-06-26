import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/Application.module.css';
import containerStyles from '../../styles/PageContainer.module.css';

export default function ApplicationManagement() {
    const router = useRouter();
    const [applications, setApplications] = useState({ leaveApplications: [], eventApplications: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [retryCount, setRetryCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState({});

    // Professional SVG Icons
    const icons = {
        applications: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
        ),
        leave: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        ),
        event: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        calendar: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
        ),
        teacher: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        ),
        approve: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        ),
        reject: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        ),
        filter: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 6h10l-5.01 6.3L7 6zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.73-4.8 5.75-7.39c.51-.66.04-1.61-.79-1.61H4.04c-.83 0-1.3.95-.79 1.61z"/>
            </svg>
        ),
        search: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
        ),
        refresh: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
        ),
        empty: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
        )
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (!response.ok) {
                    throw new Error('Session check failed');
                }
                const data = await response.json();
                if (!data.user) {
                    router.push('/login');
                    return false;
                }
                return true;
            } catch (error) {
                console.error('Session check error:', error);
                router.push('/login');
                return false;
            }
        };

        const initializePage = async () => {
            const sessionValid = await checkSession();
            if (sessionValid) {
                fetchApplications();
            }
        };

        initializePage();
    }, [retryCount]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError('');
            
            const response = await fetch('/api/application/fetch', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                
                let errorMessage = 'Failed to fetch applications';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || `Server responded with status ${response.status}`;
                } catch (e) {
                    errorMessage = `Network error: ${response.statusText || 'Could not connect to server'}`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();
            
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format from server');
            }

            if (!Array.isArray(data.leaveApplications) || !Array.isArray(data.eventApplications)) {
                throw new Error('Invalid data format: Expected arrays for leave and event applications');
            }

            setApplications(data);
            setError('');
        } catch (error) {
            console.error('Error fetching applications:', error);
            setError(error.message);
            
            if (error.message.includes('Network error') && retryCount < 3) {
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                }, 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, type, newStatus) => {
        try {
            setError('');
            setActionLoading(prev => ({ ...prev, [`${type}-${id}`]: true }));
            
            const response = await fetch('/api/application/update-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    id,
                    type: type === 'leave' ? 'leave' : 'event',
                    status: newStatus,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update status');
            }

            await fetchApplications();
        } catch (error) {
            console.error('Error:', error);
            setError(error.message || 'Failed to update application status');
        } finally {
            setActionLoading(prev => ({ ...prev, [`${type}-${id}`]: false }));
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    const getFilteredApplications = () => {
        let filtered = [];

        if (filter === 'all' || filter === 'leave') {
            filtered = [...filtered, ...applications.leaveApplications.map(app => ({
                ...app,
                type: 'leave',
                displayDate: app.fromDate,
            }))];
        }

        if (filter === 'all' || filter === 'event') {
            filtered = [...filtered, ...applications.eventApplications.map(app => ({
                ...app,
                type: 'event',
                displayDate: app.eventDate,
            }))];
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.teachers.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (app.reason && app.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.eventName && app.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (app.description && app.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        return filtered.sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate));
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'Approved':
                return styles.statusApproved;
            case 'Rejected':
                return styles.statusRejected;
            default:
                return styles.statusPending;
        }
    };

    const getApplicationStats = () => {
        const filtered = getFilteredApplications();
        const pending = filtered.filter(app => app.status === 'Pending').length;
        const approved = filtered.filter(app => app.status === 'Approved').length;
        const rejected = filtered.filter(app => app.status === 'Rejected').length;
        
        return { total: filtered.length, pending, approved, rejected };
    };

    const stats = getApplicationStats();

    return (
        <Layout>
            <div className={containerStyles.pageContainer}>
                <div className={containerStyles.contentCard}>
                    {/* Header Section */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.titleSection}>
                                <div className={styles.titleIcon}>
                                    {icons.applications}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>Application Management</h1>
                                    <p>Review and manage leave and event applications</p>
                                </div>
                            </div>
                            <div className={styles.headerActions}>
                                <button
                                    onClick={fetchApplications}
                                    className={styles.refreshButton}
                                    disabled={loading}
                                >
                                    {icons.refresh}
                                    <span>Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className={styles.statsSection}>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{stats.total}</div>
                            <div className={styles.statLabel}>Total Applications</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{stats.pending}</div>
                            <div className={styles.statLabel}>Pending</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{stats.approved}</div>
                            <div className={styles.statLabel}>Approved</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{stats.rejected}</div>
                            <div className={styles.statLabel}>Rejected</div>
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className={styles.filtersSection}>
                        <div className={styles.searchContainer}>
                            <div className={styles.searchIcon}>
                                {icons.search}
                            </div>
                            <input
                                type="text"
                                placeholder="Search by teacher name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <div className={styles.filterContainer}>
                                <div className={styles.filterIcon}>
                                    {icons.filter}
                                </div>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="all">All Applications</option>
                                    <option value="leave">Leave Applications</option>
                                    <option value="event">Event Applications</option>
                                </select>
                            </div>
                            <div className={styles.filterContainer}>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className={styles.filterSelect}
                                >
                                    <option value="all">All Status</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className={styles.errorContainer}>
                            <div className={styles.errorIcon}>
                                {icons.error}
                            </div>
                            <div className={styles.errorContent}>
                                <span>{error}</span>
                                <button 
                                    onClick={() => setError('')}
                                    className={styles.errorClose}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h3>Loading Applications</h3>
                                <p>Fetching the latest application data...</p>
                            </div>
                        </div>
                    ) : getFilteredApplications().length === 0 ? (
                        <div className={styles.emptyContainer}>
                            <div className={styles.emptyIcon}>
                                {icons.empty}
                            </div>
                            <div className={styles.emptyContent}>
                                <h3>No applications found</h3>
                                <p>
                                    {searchTerm || filter !== 'all' || statusFilter !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'No applications have been submitted yet'
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.applicationGrid}>
                            {getFilteredApplications().map((application, index) => (
                                <div 
                                    key={`${application.type}-${application.id}`} 
                                    className={styles.applicationCard}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>
                                            <div className={styles.teacherInfo}>
                                                <div className={styles.teacherIcon}>
                                                    {icons.teacher}
                                                </div>
                                                <div className={styles.teacherDetails}>
                                                    <h3>{application.teachers.teacherName}</h3>
                                                    <span className={styles.applicationDate}>
                                                        {getRelativeTime(application.displayDate)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.badges}>
                                                <span className={`${styles.typeBadge} ${styles[application.type]}`}>
                                                    {application.type === 'leave' ? icons.leave : icons.event}
                                                    <span>{application.type === 'leave' ? 'Leave' : 'Event'}</span>
                                                </span>
                                                <span className={`${styles.statusBadge} ${getStatusBadgeClass(application.status)}`}>
                                                    {application.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.cardContent}>
                                        {application.type === 'leave' ? (
                                            <div className={styles.leaveDetails}>
                                                <div className={styles.dateRange}>
                                                    <div className={styles.dateItem}>
                                                        <div className={styles.dateIcon}>
                                                            {icons.calendar}
                                                        </div>
                                                        <div className={styles.dateInfo}>
                                                            <span className={styles.dateLabel}>From</span>
                                                            <span className={styles.dateValue}>{formatDate(application.fromDate)}</span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.dateItem}>
                                                        <div className={styles.dateIcon}>
                                                            {icons.calendar}
                                                        </div>
                                                        <div className={styles.dateInfo}>
                                                            <span className={styles.dateLabel}>To</span>
                                                            <span className={styles.dateValue}>{formatDate(application.toDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.reasonSection}>
                                                    <h4>Reason</h4>
                                                    <p>{application.reason}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={styles.eventDetails}>
                                                <div className={styles.eventInfo}>
                                                    <h4>{application.eventName}</h4>
                                                    <div className={styles.eventDate}>
                                                        <div className={styles.dateIcon}>
                                                            {icons.calendar}
                                                        </div>
                                                        <span>{formatDate(application.eventDate)}</span>
                                                    </div>
                                                </div>
                                                <div className={styles.descriptionSection}>
                                                    <h4>Description</h4>
                                                    <p>{application.description}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {application.status === 'Pending' && (
                                        <div className={styles.cardFooter}>
                                            <div className={styles.actionButtons}>
                                                <button
                                                    onClick={() => handleStatusUpdate(application.id, application.type, 'Approved')}
                                                    className={styles.approveButton}
                                                    disabled={actionLoading[`${application.type}-${application.id}`]}
                                                >
                                                    {actionLoading[`${application.type}-${application.id}`] ? (
                                                        <div className={styles.buttonSpinner}></div>
                                                    ) : (
                                                        icons.approve
                                                    )}
                                                    <span>Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(application.id, application.type, 'Rejected')}
                                                    className={styles.rejectButton}
                                                    disabled={actionLoading[`${application.type}-${application.id}`]}
                                                >
                                                    {actionLoading[`${application.type}-${application.id}`] ? (
                                                        <div className={styles.buttonSpinner}></div>
                                                    ) : (
                                                        icons.reject
                                                    )}
                                                    <span>Reject</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

