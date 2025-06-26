import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/Records.module.css';
import containerStyles from '../../styles/PageContainer.module.css';

export default function Records() {
    const router = useRouter();
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);    
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);
    const [error, setError] = useState('');
    const [selectedTeacherName, setSelectedTeacherName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    
    // Professional SVG Icons
    const icons = {
        records: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
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
        lesson: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
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
        view: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
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
        clear: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        ),
        empty: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
        )
    };
    
    useEffect(() => {
        fetchTeachers();
        fetchClasses();
    }, []);

    const fetchTeachers = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('/api/record-generation/teachers');
            
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch teachers');
            }
            
            const data = await response.json();
            setTeachers(data);
            
        } catch (err) {
            console.error('Error fetching teachers:', err);
            setError(err.message || 'Failed to load teachers. Please try again.');
            setTeachers([]);
        } finally {
            setLoading(false);
        }
    }, [router]);

    const fetchClasses = useCallback(async () => {
        try {
            setLoadingClasses(true);
            setError('');
            const response = await fetch('/api/record-generation/class-lessons');
            
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch classes');
            }
            
            const data = await response.json();
            setClasses(data);
            
        } catch (err) {
            console.error('Error fetching classes:', err);
            setError(err.message || 'Failed to load classes. Please try again.');
            setClasses([]);
        } finally {
            setLoadingClasses(false);
        }
    }, [router]);

    const handleTeacherChange = useCallback((e) => {
        const teacherId = e.target.value;
        setSelectedTeacher(teacherId);
        const teacher = teachers.find(t => t.id.toString() === teacherId);
        setSelectedTeacherName(teacher ? teacher.teacherName : '');
    }, [teachers]);

    const goToReport = useCallback(() => {
        if (selectedTeacher) {
            router.push(`/record-generation/report?teacherId=${selectedTeacher}&teacherName=${encodeURIComponent(selectedTeacherName)}`);
        }
    }, [selectedTeacher, selectedTeacherName, router]);

    const retryFetch = useCallback(() => {
        fetchTeachers();
        fetchClasses();
    }, [fetchTeachers, fetchClasses]);

    // Filter and search classes
    const filteredClasses = classes.filter(classInfo => {
        const matchesSearch = classInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            classInfo.LessonPdf.some(lesson => 
                                lesson.lessonName.toLowerCase().includes(searchTerm.toLowerCase())
                            );
        const matchesFilter = filterClass === 'all' || classInfo.name === filterClass;
        return matchesSearch && matchesFilter;
    });

    // Get unique class names for filter
    const classNames = [...new Set(classes.map(c => c.name))];

    // Calculate stats
    const totalClasses = classes.length;
    const totalLessons = classes.reduce((sum, classInfo) => sum + classInfo._count.LessonPdf, 0);
    const avgLessonsPerClass = totalClasses > 0 ? Math.round(totalLessons / totalClasses) : 0;

    if (loading && !classes.length) {
        return (
            <Layout>
                <div className={containerStyles.pageContainer}>
                    <div className={containerStyles.contentCard}>
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h3>Loading Records</h3>
                                <p>Fetching class and teacher data...</p>
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
                                <button onClick={retryFetch} className={styles.retryButton}>
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
                                    {icons.records}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>Class Records</h1>
                                    <p>Generate reports and manage class lesson records</p>
                                </div>
                            </div>
                            <div className={styles.headerStats}>
                                <div className={styles.statCard}>
                                    <div className={styles.statNumber}>{totalClasses}</div>
                                    <div className={styles.statLabel}>Total Classes</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statNumber}>{totalLessons}</div>
                                    <div className={styles.statLabel}>Total Lessons</div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statNumber}>{avgLessonsPerClass}</div>
                                    <div className={styles.statLabel}>Avg per Class</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teacher Selection Section */}
                    <div className={styles.selectionSection}>
                        <div className={styles.selectionCard}>
                            <div className={styles.selectionHeader}>
                                <div className={styles.selectionIcon}>
                                    {icons.teacher}
                                </div>
                                <div className={styles.selectionText}>
                                    <h3>Generate Teacher Report</h3>
                                    <p>Select a teacher to generate their detailed class report</p>
                                </div>
                            </div>
                            <div className={styles.selectionControls}>
                                <div className={styles.selectContainer}>
                                    <select 
                                        value={selectedTeacher} 
                                        onChange={handleTeacherChange}
                                        className={styles.teacherSelect}
                                        disabled={loading}
                                    >
                                        <option value="">Choose a teacher...</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher.id} value={teacher.id}>
                                                {teacher.teacherName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                
                                {selectedTeacher && (
                                    <button 
                                        onClick={goToReport}
                                        className={styles.reportButton}
                                        disabled={loading}
                                    >
                                        {icons.view}
                                        <span>View Report</span>
                                    </button>
                                )}
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
                                    placeholder="Search classes or lessons..."
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
                                        value={filterClass}
                                        onChange={(e) => setFilterClass(e.target.value)}
                                        className={styles.filterSelect}
                                    >
                                        <option value="all">All Classes</option>
                                        {classNames.map(className => (
                                            <option key={className} value={className}>{className}</option>
                                        ))}
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

                    {/* Classes Content */}
                    {loadingClasses ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h3>Loading Classes</h3>
                                <p>Fetching class and lesson information...</p>
                            </div>
                        </div>
                    ) : filteredClasses.length > 0 ? (
                        <>
                            <div className={styles.resultsHeader}>
                                <h2>Class Records ({filteredClasses.length})</h2>
                                <div className={styles.resultsSummary}>
                                    Showing {filteredClasses.length} of {classes.length} classes
                                </div>
                            </div>

                            <div className={`${styles.classGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
                                {filteredClasses.map((classInfo, index) => (
                                    <div 
                                        key={classInfo.id} 
                                        className={styles.classCard}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className={styles.cardHeader}>
                                            <div className={styles.classInfo}>
                                                <div className={styles.classIcon}>
                                                    {icons.class}
                                                </div>
                                                <div className={styles.classDetails}>
                                                    <h3>Class {classInfo.name}</h3>
                                                    <span className={styles.lessonCount}>
                                                        {classInfo._count.LessonPdf} lesson{classInfo._count.LessonPdf !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={styles.cardContent}>
                                            <div className={styles.lessonHeader}>
                                                <h4>Available Lessons</h4>
                                            </div>
                                            <div className={styles.lessonList}>
                                                {classInfo.LessonPdf.map((lesson, lessonIndex) => (
                                                    <div 
                                                        key={lesson.id} 
                                                        className={styles.lesson}
                                                        style={{ animationDelay: `${(index * 0.1) + (lessonIndex * 0.05)}s` }}
                                                    >
                                                        <div className={styles.lessonIcon}>
                                                            {icons.lesson}
                                                        </div>
                                                        <span className={styles.lessonName}>
                                                            {lesson.lessonName}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyContainer}>
                            <div className={styles.emptyIcon}>
                                {icons.empty}
                            </div>
                            <div className={styles.emptyContent}>
                                <h3>No Classes Found</h3>
                                <p>
                                    {searchTerm || filterClass !== 'all'
                                        ? 'Try adjusting your search or filter criteria'
                                        : 'No class records are available in the system'
                                    }
                                </p>
                                {(searchTerm || filterClass !== 'all') && (
                                    <button 
                                        className={styles.clearFiltersButton}
                                        onClick={() => {
                                            setSearchTerm('');
                                            setFilterClass('all');
                                        }}
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
