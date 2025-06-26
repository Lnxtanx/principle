import { useState, useEffect } from 'react';
import Layout from '../../components/layout';
import styles from '../../styles/SchoolProfile.module.css';
import containerStyles from '../../styles/PageContainer.module.css';
import { useRouter } from 'next/router';

export default function SchoolProfile() {
    const [school, setSchool] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    // Professional SVG Icons
    const icons = {
        school: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
            </svg>
        ),
        email: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
        ),
        calendar: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
        ),
        update: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
            </svg>
        ),
        edit: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
        ),
        info: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
        ),
        success: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
        )
    };

    useEffect(() => {
        const fetchSchoolProfile = async () => {
            try {
                const response = await fetch('/api/school/profile');
                if (!response.ok) {
                    if (response.status === 401) {
                        router.push('/login');
                        return;
                    }
                    throw new Error('Failed to fetch school profile');
                }
                const data = await response.json();
                setSchool(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolProfile();
    }, [router]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeSince = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return "1 day ago";
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    };

    if (loading) {
        return (
            <Layout>
                <div className={containerStyles.pageContainer}>
                    <div className={containerStyles.contentCard}>
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h2>Loading School Profile</h2>
                                <p>Fetching your school information...</p>
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
                                <h2>Error Loading Profile</h2>
                                <p>{error}</p>
                                <button 
                                    onClick={() => window.location.reload()} 
                                    className={styles.retryButton}
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!school) {
        return (
            <Layout>
                <div className={containerStyles.pageContainer}>
                    <div className={containerStyles.contentCard}>
                        <div className={styles.noDataContainer}>
                            <div className={styles.noDataIcon}>
                                {icons.info}
                            </div>
                            <div className={styles.noDataContent}>
                                <h2>No School Data Found</h2>
                                <p>Unable to retrieve school profile information</p>
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
                    {/* Profile Header */}
                    <div className={styles.profileHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.titleSection}>
                                <div className={styles.schoolIcon}>
                                    {icons.school}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>School Profile</h1>
                                    <p>Manage and view your institution's information</p>
                                </div>
                            </div>
                            <div className={styles.headerActions}>
                                <button 
                                    className={styles.editButton}
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {icons.edit}
                                    <span>Edit Profile</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* School Information Cards */}
                    <div className={styles.profileContent}>
                        {/* Main Info Card */}
                        <div className={styles.infoCard}>
                            <div className={styles.cardHeader}>
                                <h3>School Information</h3>
                                <div className={styles.statusBadge}>
                                    {icons.success}
                                    <span>Active</span>
                                </div>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.infoGrid}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIcon}>
                                            {icons.school}
                                        </div>
                                        <div className={styles.infoDetails}>
                                            <span className={styles.label}>School Name</span>
                                            <span className={styles.value}>{school.name}</span>
                                        </div>
                                    </div>

                                    <div className={styles.infoItem}>
                                        <div className={styles.infoIcon}>
                                            {icons.email}
                                        </div>
                                        <div className={styles.infoDetails}>
                                            <span className={styles.label}>Contact Email</span>
                                            <span className={styles.value}>{school.email}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline Card */}
                        <div className={styles.timelineCard}>
                            <div className={styles.cardHeader}>
                                <h3>Account Timeline</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.timelineGrid}>
                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}>
                                            {icons.calendar}
                                        </div>
                                        <div className={styles.timelineDetails}>
                                            <span className={styles.label}>Member Since</span>
                                            <span className={styles.value}>{formatDate(school.createdAt)}</span>
                                            <span className={styles.timeAgo}>{getTimeSince(school.createdAt)}</span>
                                        </div>
                                    </div>

                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}>
                                            {icons.update}
                                        </div>
                                        <div className={styles.timelineDetails}>
                                            <span className={styles.label}>Last Updated</span>
                                            <span className={styles.value}>{formatDate(school.updatedAt)}</span>
                                            <span className={styles.timeAgo}>{getTimeSince(school.updatedAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Statistics Card */}
                        <div className={styles.statsCard}>
                            <div className={styles.cardHeader}>
                                <h3>Quick Statistics</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statNumber}>
                                            {Math.floor(Math.random() * 500) + 100}
                                        </div>
                                        <div className={styles.statLabel}>Total Students</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statNumber}>
                                            {Math.floor(Math.random() * 50) + 20}
                                        </div>
                                        <div className={styles.statLabel}>Teachers</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statNumber}>
                                            {Math.floor(Math.random() * 20) + 5}
                                        </div>
                                        <div className={styles.statLabel}>Classes</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statNumber}>
                                            {new Date().getFullYear() - new Date(school.createdAt).getFullYear()}
                                        </div>
                                        <div className={styles.statLabel}>Years Active</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
