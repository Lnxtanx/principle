import { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import styles from '../../styles/Teachers.module.css';
import containerStyles from '../../styles/PageContainer.module.css';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Teachers() {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSubject, setFilterSubject] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [viewMode, setViewMode] = useState('grid');
    const router = useRouter();

    // Professional SVG Icons
    const icons = {
        teachers: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
        sort: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
            </svg>
        ),
        grid: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 3v8h8V3H3zm6 6H5V5h4v4zm-6 4v8h8v-8H3zm6 6H5v-4h4v4zm4-16v8h8V3h-8zm6 6h-4V5h4v4zm-6 4v8h8v-8h-8zm6 6h-4v-4h4v4z"/>
            </svg>
        ),
        list: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6h2v2H4zm0 5h2v2H4zm0 5h2v2H4zm16-8V6H8.023v2H18.8zm0 5v-2H8.023v2H18.8zm0 5v-2H8.023v2H18.8z"/>
            </svg>
        ),
        email: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        ),
        view: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
        ),
        clear: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        ),
        qualification: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
            </svg>
        ),
        class: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
            </svg>
        ),
        experience: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
            </svg>
        ),
        status: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        ),
        subject: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
        ),
        retry: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
        ),
        empty: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        )
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const sessionRes = await fetch('/api/auth/session');
                if (!sessionRes.ok) {
                    router.push('/login');
                    return;
                }
                const session = await sessionRes.json();
                if (!session || !session.user) {
                    router.push('/login');
                    return;
                }
                fetchTeachers();
            } catch (err) {
                console.error('Session check failed:', err);
                router.push('/login');
            }
        };

        const fetchTeachers = async () => {
            try {
                const response = await fetch('/api/teachers/list');
                if (!response.ok) {
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                setTeachers(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        window.location.reload();
    };

    // Get unique subjects for filter
    const subjects = [...new Set(teachers.map(t => t.subjectAssigned).filter(Boolean))];

    // Filter and sort teachers
    const filteredAndSortedTeachers = teachers
        .filter(teacher => {
            const matchesSearch = teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSubject = filterSubject === 'all' || teacher.subjectAssigned === filterSubject;
            return matchesSearch && matchesSubject;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.teacherName.localeCompare(b.teacherName);
                case 'subject':
                    return (a.subjectAssigned || '').localeCompare(b.subjectAssigned || '');
                case 'experience':
                    return (b.experienceYears || 0) - (a.experienceYears || 0);
                default:
                    return 0;
            }
        });

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Create mailto link with pre-filled subject
    const createMailtoLink = (email, teacherName) => {
        const subject = encodeURIComponent(`Inquiry about ${teacherName}`);
        const body = encodeURIComponent(`Hello ${teacherName},\n\nI hope this email finds you well. I would like to discuss...\n\nBest regards`);
        return `mailto:${email}?subject=${subject}&body=${body}`;
    };

    if (loading) {
        return (
            <Layout>
                <div className={containerStyles.pageContainer}>
                    <div className={containerStyles.contentCard}>
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h3>Loading Teachers</h3>
                                <p>Fetching teacher directory...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className={containerStyles.pageContainer}>
                    <div className={containerStyles.contentCard}>
                        <div className={styles.errorContainer}>
                            <div className={styles.errorIcon}>
                                {icons.error}
                            </div>
                            <div className={styles.errorContent}>
                                <h2>Something went wrong</h2>
                                <p>{error}</p>
                                <button className={styles.retryButton} onClick={handleRetry}>
                                    {icons.retry}
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className={containerStyles.pageContainer}>
                <div className={containerStyles.contentCard}>
                    {/* Header Section */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.titleSection}>
                                <div className={styles.titleIcon}>
                                    {icons.teachers}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>Teachers Directory</h1>
                                    <p>Manage and view all teaching staff members</p>
                                </div>
                            </div>
                            <div className={styles.headerStats}>
                                <div className={styles.statCard}>
                                    <div className={styles.statNumber}>{teachers.length}</div>
                                    <div className={styles.statLabel}>Total Teachers</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statNumber}>{subjects.length}</div>
                                    <div className={styles.statLabel}>Subjects</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statNumber}>{filteredAndSortedTeachers.length}</div>
                                    <div className={styles.statLabel}>Filtered Results</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Section */}
                    <div className={styles.controlsSection}>
                        <div className={styles.searchAndFilters}>
                            <div className={styles.searchContainer}>
                                <div className={styles.searchIcon}>
                                    {icons.search}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search teachers by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles.searchInput}
                                />
                                {searchTerm && (
                                    <button 
                                        className={styles.clearSearch}
                                        onClick={() => setSearchTerm('')}
                                    >
                                        {icons.clear}
                                    </button>
                                )}
                            </div>

                            <div className={styles.filterGroup}>
                                <div className={styles.filterContainer}>
                                    <div className={styles.filterIcon}>
                                        {icons.filter}
                                    </div>
                                    <select
                                        value={filterSubject}
                                        onChange={(e) => setFilterSubject(e.target.value)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">All Subjects</option>
                                        {subjects.map(subject => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className={styles.filterContainer}>
                                    <div className={styles.filterIcon}>
                                        {icons.sort}
                                    </div>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="name">Sort by Name</option>
                                        <option value="subject">Sort by Subject</option>
                                        <option value="experience">Sort by Experience</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={styles.viewControls}>
                            <button
                                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                                onClick={() => setViewMode('grid')}
                            >
                                {icons.grid}
                                <span>Grid</span>
                            </button>
                            <button
                                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                                onClick={() => setViewMode('list')}
                            >
                                {icons.list}
                                <span>List</span>
                            </button>
                        </div>
                    </div>

                    {/* Content Section */}
                    {filteredAndSortedTeachers.length === 0 ? (
                        <div className={styles.emptyContainer}>
                            <div className={styles.emptyIcon}>
                                {icons.empty}
                            </div>
                            <div className={styles.emptyContent}>
                                <h3>No Teachers Found</h3>
                                <p>
                                    {searchTerm || filterSubject !== 'all' 
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'No teachers have been added to the system yet'
                                    }
                                </p>
                                {(searchTerm || filterSubject !== 'all') && (
                                    <button 
                                        className={styles.clearFiltersButton}
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterSubject('all');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.resultsHeader}>
                                <h2>Teachers Directory ({filteredAndSortedTeachers.length})</h2>
                                <div className={styles.resultsSummary}>
                                    Showing {filteredAndSortedTeachers.length} of {teachers.length} teachers
                                </div>
                            </div>

                            <div className={`${styles.teacherGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                                {filteredAndSortedTeachers.map((teacher, index) => (
                                    <div 
                                        key={teacher.id} 
                                        className={styles.teacherCard}
                                        style={{animationDelay: `${index * 0.1}s`}}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.profileSection}>
                                                <div className={styles.profileImageContainer}>
                                                    {teacher.profileImage ? (
                                                        <Image
                                                            src={teacher.profileImage}
                                                            alt={teacher.teacherName}
                                                            width={80}
                                                            height={80}
                                                            className={styles.profileImage}
                                                        />
                                                    ) : (
                                                        <div className={styles.profileImagePlaceholder}>
                                                            {getInitials(teacher.teacherName)}
                                                        </div>
                                                    )}
                                                    <div className={styles.onlineIndicator}></div>
                                                </div>
                                                
                                                <div className={styles.profileInfo}>
                                                    <h3 className={styles.teacherName}>{teacher.teacherName}</h3>
                                                    <div className={styles.teacherEmail}>
                                                        <div className={styles.emailIcon}>
                                                            {icons.email}
                                                        </div>
                                                        <span>{teacher.email}</span>
                                                    </div>
                                                    {teacher.subjectAssigned && (
                                                        <div className={styles.subjectBadge}>
                                                            <div className={styles.subjectIcon}>
                                                                {icons.subject}
                                                            </div>
                                                            <span>{teacher.subjectAssigned}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.cardContent}>
                                            <div className={styles.infoGrid}>
                                                <div className={styles.infoItem}>
                                                    <div className={styles.infoIcon}>
                                                        {icons.qualification}
                                                    </div>
                                                    <div className={styles.infoContent}>
                                                        <div className={styles.infoLabel}>Qualification</div>
                                                        <div className={styles.infoValue}>
                                                            {teacher.qualification || 'Not specified'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.infoItem}>
                                                    <div className={styles.infoIcon}>
                                                        {icons.class}
                                                    </div>
                                                    <div className={styles.infoContent}>
                                                        <div className={styles.infoLabel}>Class Assigned</div>
                                                        <div className={styles.infoValue}>
                                                            {teacher.classAssigned || 'Not assigned'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.infoItem}>
                                                    <div className={styles.infoIcon}>
                                                        {icons.experience}
                                                    </div>
                                                    <div className={styles.infoContent}>
                                                        <div className={styles.infoLabel}>Experience</div>
                                                        <div className={styles.infoValue}>
                                                            {teacher.experienceYears ? `${teacher.experienceYears} years` : 'Not specified'}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.infoItem}>
                                                    <div className={styles.infoIcon}>
                                                        {icons.status}
                                                    </div>
                                                    <div className={styles.infoContent}>
                                                        <div className={styles.infoLabel}>Status</div>
                                                        <div className={styles.statusActive}>Active</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.cardFooter}>
                                            <div className={styles.cardActions}>
                                                <button className={styles.actionButtonSecondary}>
                                                    {icons.view}
                                                    <span>View Profile</span>
                                                </button>
                                                <a
                                                    href={createMailtoLink(teacher.email, teacher.teacherName)}
                                                    className={styles.actionButtonPrimary}
                                                    title={`Send email to ${teacher.teacherName}`}
                                                >
                                                    {icons.email}
                                                    <span>Contact</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}

