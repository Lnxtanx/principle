import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/CompletedClass.module.css';
import containerStyles from '../../styles/PageContainer.module.css';

export default function CompletedClass() {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState({
        teachers: true,
        classes: true,
        responses: false
    });
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    // Professional SVG Icons
    const icons = {
        completedClass: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        teacher: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        ),
        class: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
            </svg>
        ),
        completed: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        ),
        cancelled: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
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
        sort: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
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
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        selectPrompt: (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
            </svg>
        )
    };

    // Fetch teachers
    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await fetch('/api/class-report/teachers');
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch teachers');
                }
                const data = await response.json();
                setTeachers(data);
            } catch (err) {
                setError('Error loading teachers: ' + err.message);
                console.error('Error fetching teachers:', err);
            } finally {
                setLoading(prev => ({ ...prev, teachers: false }));
            }
        };

        fetchTeachers();
    }, [router]);

    // Fetch classes
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setLoading(prev => ({ ...prev, classes: true }));
                const response = await fetch('/api/class-report/classes');
                if (!response.ok) {
                    throw new Error('Failed to fetch classes');
                }
                const data = await response.json();
                setClasses(data);
            } catch (err) {
                setError('Error loading classes: ' + err.message);
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(prev => ({ ...prev, classes: false }));
            }
        };

        fetchClasses();
    }, []);

    // Fetch responses when both teacher and class are selected
    useEffect(() => {
        const fetchResponses = async () => {
            if (!selectedTeacher || !selectedClass) return;

            try {
                setLoading(prev => ({ ...prev, responses: true }));
                const selectedClassName = classes.find(c => c.id.toString() === selectedClass)?.name;
                if (!selectedClassName) {
                    throw new Error('Selected class not found');
                }
                const response = await fetch(`/api/class-report/responses?teacherId=${selectedTeacher}&className=${selectedClassName}`);
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch class responses');
                }
                const data = await response.json();
                const filteredData = data.filter(item => 
                    item.status.toLowerCase() === 'completed' || 
                    item.status.toLowerCase() === 'cancelled'
                );
                setResponses(filteredData);
            } catch (err) {
                setError('Error loading responses: ' + err.message);
            } finally {
                setLoading(prev => ({ ...prev, responses: false }));
            }
        };

        if (selectedTeacher && selectedClass) {
            fetchResponses();
        }
    }, [selectedTeacher, selectedClass, classes, router]);

    const handleTeacherChange = (e) => {
        setSelectedTeacher(e.target.value);
        setResponses([]);
        setError(null);
    };

    const handleClassChange = (e) => {
        setSelectedClass(e.target.value);
        setResponses([]);
        setError(null);
    };

    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return styles.statusCompleted;
            case 'cancelled':
                return styles.statusCancelled;
            default:
                return styles.statusCompleted;
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return icons.completed;
            case 'cancelled':
                return icons.cancelled;
            default:
                return icons.completed;
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

    const filteredAndSortedResponses = responses
        .filter(response => {
            const matchesStatus = filterStatus === 'all' || response.status.toLowerCase() === filterStatus;
            const matchesSearch = !searchTerm || 
                response.lessonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (response.reason && response.reason.toLowerCase().includes(searchTerm.toLowerCase()));
            return matchesStatus && matchesSearch;
        })
        .sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.submittedAt) - new Date(a.submittedAt);
            } else if (sortBy === 'oldest') {
                return new Date(a.submittedAt) - new Date(b.submittedAt);
            } else if (sortBy === 'status') {
                return a.status.localeCompare(b.status);
            } else if (sortBy === 'lesson') {
                return a.lessonName.localeCompare(b.lessonName);
            }
            return 0;
        });

    const getStats = () => {
        const completedCount = responses.filter(r => r.status.toLowerCase() === 'completed').length;
        const cancelledCount = responses.filter(r => r.status.toLowerCase() === 'cancelled').length;
        return { total: responses.length, completed: completedCount, cancelled: cancelledCount };
    };

    const stats = getStats();
    const selectedTeacherName = teachers.find(t => t.id.toString() === selectedTeacher)?.name || '';
    const selectedClassName = classes.find(c => c.id.toString() === selectedClass)?.name || '';

    return (
        <Layout>
            <div className={containerStyles.pageContainer}>
                <div className={containerStyles.contentCard}>
                    {/* Header Section */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.titleSection}>
                                <div className={styles.titleIcon}>
                                    {icons.completedClass}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>Completed Lessons</h1>
                                    <p>Track and review completed and cancelled class sessions</p>
                                </div>
                            </div>
                            <div className={styles.headerActions}>
                                <button
                                    onClick={() => window.location.reload()}
                                    className={styles.refreshButton}
                                >
                                    {icons.refresh}
                                    <span>Refresh</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Selection Section */}
                    <div className={styles.selectionSection}>
                        <div className={styles.selectionCard}>
                            <div className={styles.selectionHeader}>
                                <h3>Filter Lessons</h3>
                                <p>Select teacher and class to view completed lessons</p>
                            </div>
                            <div className={styles.selectionGrid}>
                                <div className={styles.selectGroup}>
                                    <div className={styles.selectHeader}>
                                        <div className={styles.selectIcon}>
                                            {icons.teacher}
                                        </div>
                                        <div className={styles.selectLabel}>
                                            <label htmlFor="teacher">Teacher</label>
                                            <span>Choose from available teachers</span>
                                        </div>
                                    </div>
                                    <div className={styles.selectContainer}>
                                        {loading.teachers ? (
                                            <div className={styles.selectLoading}>
                                                <div className={styles.selectSpinner}></div>
                                                <span>Loading teachers...</span>
                                            </div>
                                        ) : (
                                            <select
                                                id="teacher"
                                                value={selectedTeacher}
                                                onChange={handleTeacherChange}
                                                className={styles.select}
                                            >
                                                <option value="">Select a teacher...</option>
                                                {teachers.map((teacher) => (
                                                    <option key={teacher.id} value={teacher.id}>
                                                        {teacher.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.selectGroup}>
                                    <div className={styles.selectHeader}>
                                        <div className={styles.selectIcon}>
                                            {icons.class}
                                        </div>
                                        <div className={styles.selectLabel}>
                                            <label htmlFor="class">Class</label>
                                            <span>Choose from available classes</span>
                                        </div>
                                    </div>
                                    <div className={styles.selectContainer}>
                                        {loading.classes ? (
                                            <div className={styles.selectLoading}>
                                                <div className={styles.selectSpinner}></div>
                                                <span>Loading classes...</span>
                                            </div>
                                        ) : (
                                            <select
                                                id="class"
                                                value={selectedClass}
                                                onChange={handleClassChange}
                                                className={styles.select}
                                            >
                                                <option value="">Select a class...</option>
                                                {classes.map((cls) => (
                                                    <option key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                </div>
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
                                    onClick={() => setError(null)}
                                    className={styles.errorClose}
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content based on selection */}
                    {selectedTeacher && selectedClass ? (
                        <>
                            {/* Teacher & Class Info */}
                            <div className={styles.infoSection}>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoHeader}>
                                        <div className={styles.infoIcon}>
                                            {icons.teacher}
                                        </div>
                                        <div className={styles.infoText}>
                                            <h4>Teacher</h4>
                                            <p>{selectedTeacherName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.infoCard}>
                                    <div className={styles.infoHeader}>
                                        <div className={styles.infoIcon}>
                                            {icons.class}
                                        </div>
                                        <div className={styles.infoText}>
                                            <h4>Class</h4>
                                            <p>{selectedClassName}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Section */}
                            {responses.length > 0 && (
                                <div className={styles.statsSection}>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.total}</div>
                                        <div className={styles.statLabel}>Total Lessons</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.completed}</div>
                                        <div className={styles.statLabel}>Completed</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>{stats.cancelled}</div>
                                        <div className={styles.statLabel}>Cancelled</div>
                                    </div>
                                    <div className={styles.statCard}>
                                        <div className={styles.statNumber}>
                                            {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                                        </div>
                                        <div className={styles.statLabel}>Success Rate</div>
                                    </div>
                                </div>
                            )}

                            {/* Filters Section */}
                            {responses.length > 0 && (
                                <div className={styles.filtersSection}>
                                    <div className={styles.searchContainer}>
                                        <div className={styles.searchIcon}>
                                            {icons.search}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Search lessons..."
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
                                                value={filterStatus}
                                                onChange={(e) => setFilterStatus(e.target.value)}
                                                className={styles.filterSelect}
                                            >
                                                <option value="all">All Status</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
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
                                                <option value="newest">Newest First</option>
                                                <option value="oldest">Oldest First</option>
                                                <option value="status">By Status</option>
                                                <option value="lesson">By Lesson Name</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Lessons Content */}
                            {loading.responses ? (
                                <div className={styles.loadingContainer}>
                                    <div className={styles.loadingSpinner}></div>
                                    <div className={styles.loadingContent}>
                                        <h3>Loading Lessons</h3>
                                        <p>Fetching lesson data for {selectedTeacherName} - {selectedClassName}...</p>
                                    </div>
                                </div>
                            ) : filteredAndSortedResponses.length === 0 ? (
                                <div className={styles.emptyContainer}>
                                    <div className={styles.emptyIcon}>
                                        {icons.empty}
                                    </div>
                                    <div className={styles.emptyContent}>
                                        <h3>No lessons found</h3>
                                        <p>
                                            {searchTerm || filterStatus !== 'all'
                                                ? 'Try adjusting your search or filter criteria'
                                                : `No completed lessons found for ${selectedTeacherName} in ${selectedClassName}`
                                            }
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.lessonsContainer}>
                                    <div className={styles.lessonsHeader}>
                                        <h3>Lesson History</h3>
                                        <span className={styles.resultCount}>
                                            {filteredAndSortedResponses.length} lesson{filteredAndSortedResponses.length !== 1 ? 's' : ''} found
                                        </span>
                                    </div>
                                    <div className={styles.lessonsGrid}>
                                        {filteredAndSortedResponses.map((response, index) => (
                                            <div 
                                                key={response.id} 
                                                className={styles.lessonCard}
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className={styles.cardHeader}>
                                                    <div className={styles.cardTitle}>
                                                        <h4>{response.lessonName}</h4>
                                                        <span className={getRelativeTime(response.submittedAt)}>
                                                            {getRelativeTime(response.submittedAt)}
                                                        </span>
                                                    </div>
                                                    <span className={`${styles.statusBadge} ${getStatusBadgeClass(response.status)}`}>
                                                        {getStatusIcon(response.status)}
                                                        <span>{response.status}</span>
                                                    </span>
                                                </div>
                                                <div className={styles.cardContent}>
                                                    <div className={styles.dateInfo}>
                                                        <div className={styles.dateIcon}>
                                                            {icons.calendar}
                                                        </div>
                                                        <div className={styles.dateText}>
                                                            <span className={styles.dateLabel}>Submitted</span>
                                                            <span className={styles.dateValue}>
                                                                {formatDate(response.submittedAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {response.reason && (
                                                        <div className={styles.reasonSection}>
                                                            <h5>Reason</h5>
                                                            <p>{response.reason}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={styles.selectPromptContainer}>
                            <div className={styles.selectPromptIcon}>
                                {icons.selectPrompt}
                            </div>
                            <div className={styles.selectPromptContent}>
                                <h3>Select Teacher and Class</h3>
                                <p>Choose both a teacher and class from the dropdowns above to view completed lessons</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
