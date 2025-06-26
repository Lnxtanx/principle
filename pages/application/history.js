import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/ApplicationHistory.module.css';
import containerStyles from '../../styles/PageContainer.module.css';

export default function ApplicationHistory() {
    const router = useRouter();
    const [applications, setApplications] = useState({ leaveApplications: [], eventApplications: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    const [teachersLoading, setTeachersLoading] = useState(true);

    // Professional SVG Icons
    const icons = {
        history: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
        ),
        teacher: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        ),
        leave: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        ),
        event: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        calendar: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
        ),
        search: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        ),
        filter: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 6h10l-5.01 6.3L7 6zm-2.75-.39C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.73-4.8 5.75-7.39c.51-.66.04-1.61-.79-1.61H4.04c-.83 0-1.3.95-.79 1.61z"/>
            </svg>
        ),
        dropdown: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
        ),
        empty: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
        ),
        selectTeacher: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        )
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            setTeachersLoading(true);
            const response = await fetch('/api/teachers/list');
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch teachers');
            }
            const data = await response.json();
            setTeachers(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load teachers');
        } finally {
            setTeachersLoading(false);
        }
    };

    const fetchTeacherApplications = async (teacherId) => {
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`/api/application/teacher-history?teacherId=${teacherId}`);
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch applications');
            }
            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleTeacherChange = (e) => {
        const teacherId = e.target.value;
        setSelectedTeacher(teacherId);
        if (teacherId) {
            fetchTeacherApplications(teacherId);
        } else {
            setApplications({ leaveApplications: [], eventApplications: [] });
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

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved':
                return styles.statusApproved;
            case 'Rejected':
                return styles.statusRejected;
            default:
                return styles.statusPending;
        }
    };

    const getFilteredApplications = () => {
        let allApplications = [];

        if (filterType === 'all' || filterType === 'leave') {
            allApplications = [...allApplications, ...applications.leaveApplications.map(app => ({
                ...app,
                type: 'leave',
                displayDate: app.fromDate,
                searchText: `${app.reason} leave application`
            }))];
        }

        if (filterType === 'all' || filterType === 'event') {
            allApplications = [...allApplications, ...applications.eventApplications.map(app => ({
                ...app,
                type: 'event',
                displayDate: app.eventDate,
                searchText: `${app.eventName} ${app.description} event application`
            }))];
        }

        if (filterStatus !== 'all') {
            allApplications = allApplications.filter(app => app.status === filterStatus);
        }

        if (searchTerm) {
            allApplications = allApplications.filter(app =>
                app.searchText.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return allApplications.sort((a, b) => new Date(b.displayDate) - new Date(a.displayDate));
    };

    const getApplicationStats = () => {
        const filtered = getFilteredApplications();
        const leaveCount = filtered.filter(app => app.type === 'leave').length;
        const eventCount = filtered.filter(app => app.type === 'event').length;
        const pendingCount = filtered.filter(app => app.status === 'Pending').length;
        const approvedCount = filtered.filter(app => app.status === 'Approved').length;
        const rejectedCount = filtered.filter(app => app.status === 'Rejected').length;
        
        return { total: filtered.length, leave: leaveCount, event: eventCount, pending: pendingCount, approved: approvedCount, rejected: rejectedCount };
    };

    const stats = selectedTeacher ? getApplicationStats() : { total: 0, leave: 0, event: 0, pending: 0, approved: 0, rejected: 0 };
    const selectedTeacherName = teachers.find(t => t.id.toString() === selectedTeacher)?.name || '';

    return (
        <Layout>
            <div className={containerStyles.pageContainer}>
                <div className={containerStyles.contentCard}>
                    {/* Header Section */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.titleSection}>
                                <div className={styles.titleIcon}>
                                    {icons.history}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>Application History</h1>
                                    <p>View comprehensive application records for all teachers</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Selection Section */}
                    <div className={styles.selectionSection}>
                        <div className={styles.teacherSelector}>
                            <div className={styles.selectorHeader}>
                                <div className={styles.selectorIcon}>
                                    {icons.teacher}
                                </div>
                                <div className={styles.selectorText}>
                                    <h3>Select Teacher</h3>
                                    <p>Choose a teacher to view their application history</p>
                                </div>
                            </div>
                            <div className={styles.selectContainer}>
                                {teachersLoading ? (
                                    <div className={styles.selectLoading}>
                                        <div className={styles.selectSpinner}></div>
                                        <span>Loading teachers...</span>
                                    </div>
                                ) : (
                                    <select
                                        value={selectedTeacher}
                                        onChange={handleTeacherChange}
                                        className={styles.teacherSelect}
                                    >
                                        <option value="">Choose a teacher...</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Teacher Selected Content */}
                    {selectedTeacher && (
                        <>
                            {/* Teacher Info & Stats */}
                            <div className={styles.teacherInfoSection}>
                                <div className={styles.teacherInfo}>
                                    <div className={styles.teacherCard}>
                                        <div className={styles.teacherAvatar}>
                                            {icons.teacher}
                                        </div>
                                        <div className={styles.teacherDetails}>
                                            <h3>{selectedTeacherName}</h3>
                                            <p>Application History Overview</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.total}</div>
                                        <div className={styles.statLabel}>Total Applications</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.leave}</div>
                                        <div className={styles.statLabel}>Leave Requests</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.event}</div>
                                        <div className={styles.statLabel}>Event Applications</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.approved}</div>
                                        <div className={styles.statLabel}>Approved</div>
                                    </div>
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
                                        placeholder="Search applications..."
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
                                            value={filterType}
                                            onChange={(e) => setFilterType(e.target.value)}
                                            className={styles.filterSelect}
                                        >
                                            <option value="all">All Types</option>
                                            <option value="leave">Leave Applications</option>
                                            <option value="event">Event Applications</option>
                                        </select>
                                    </div>
                                    <div className={styles.filterContainer}>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
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
                                        <h3>Loading Application History</h3>
                                        <p>Fetching {selectedTeacherName}'s application records...</p>
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
                                            {searchTerm || filterType !== 'all' || filterStatus !== 'all'
                                                ? 'Try adjusting your search or filter criteria'
                                                : `${selectedTeacherName} hasn't submitted any applications yet`
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.timelineContainer}>
                                    <div className={styles.timelineHeader}>
                                        <h3>Application Timeline</h3>
                                        <span className={styles.resultCount}>
                                            {getFilteredApplications().length} application{getFilteredApplications().length !== 1 ? 's' : ''} found
                                        </span>
                                    </div>
                                    <div className={styles.timeline}>
                                        {getFilteredApplications().map((application, index) => (
                                            <div 
                                                key={`${application.type}-${application.id}`} 
                                                className={styles.timelineItem}
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className={styles.timelineMarker}>
                                                    <div className={`${styles.markerIcon} ${styles[application.type]}`}>
                                                        {application.type === 'leave' ? icons.leave : icons.event}
                                                    </div>
                                                </div>
                                                <div className={styles.timelineContent}>
                                                    <div className={styles.applicationCard}>
                                                        <div className={styles.cardHeader}>
                                                            <div className={styles.cardTitle}>
                                                                <span className={`${styles.typeBadge} ${styles[application.type]}`}>
                                                                    {application.type === 'leave' ? 'Leave Request' : 'Event Application'}
                                                                </span>
                                                                <span className={`${styles.statusBadge} ${getStatusClass(application.status)}`}>
                                                                    {application.status}
                                                                </span>
                                                            </div>
                                                            <div className={styles.dateInfo}>
                                                                <div className={styles.fullDate}>
                                                                    {formatDate(application.displayDate)}
                                                                </div>
                                                                <div className={styles.relativeDate}>
                                                                    {getRelativeTime(application.displayDate)}
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
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* No Teacher Selected */}
                    {!selectedTeacher && !teachersLoading && (
                        <div className={styles.selectPromptContainer}>
                            <div className={styles.selectPromptIcon}>
                                {icons.selectTeacher}
                            </div>
                            <div className={styles.selectPromptContent}>
                                <h3>Select a Teacher</h3>
                                <p>Choose a teacher from the dropdown above to view their complete application history</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
