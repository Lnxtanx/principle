import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import styles from '../../styles/Announcement.module.css';
import containerStyles from '../../styles/PageContainer.module.css';

export default function Announcements() {
    const router = useRouter();
    const [announcements, setAnnouncements] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Professional SVG Icons
    const icons = {
        announcement: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        ),
        add: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
        ),
        delete: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
            </svg>
        ),
        close: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
        ),
        search: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
        ),
        calendar: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
            </svg>
        ),
        error: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
        ),
        empty: (
            <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        )
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/announcement');
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch announcements');
            }
            const data = await response.json();
            setAnnouncements(data);
        } catch (error) {
            console.error('Error fetching announcements:', error);
            setError('Failed to load announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (!formData.title.trim() || !formData.content.trim()) {
            setError('Please fill in all fields');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch('/api/announcement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create announcement');
            }

            const newAnnouncement = await response.json();
            setAnnouncements(prevAnnouncements => [newAnnouncement, ...prevAnnouncements]);
            setIsModalOpen(false);
            setFormData({ title: '', content: '' });

        } catch (error) {
            console.error('Error creating announcement:', error);
            setError(error.message || 'Failed to create announcement');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this announcement?')) {
            return;
        }

        try {
            const response = await fetch(`/api/announcement?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete announcement');
            }

            setAnnouncements(prevAnnouncements => 
                prevAnnouncements.filter(announcement => announcement.id !== id)
            );

        } catch (error) {
            console.error('Error deleting announcement:', error);
            setError('Failed to delete announcement');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    return (
        <Layout>
            <div className={containerStyles.pageContainer}>
                <div className={containerStyles.contentCard}>
                    {/* Header Section */}
                    <div className={styles.header}>
                        <div className={styles.headerContent}>
                            <div className={styles.titleSection}>
                                <div className={styles.titleIcon}>
                                    {icons.announcement}
                                </div>
                                <div className={styles.titleText}>
                                    <h1>Announcements</h1>
                                    <p>Manage and share important updates with your community</p>
                                </div>
                            </div>
                            <div className={styles.headerActions}>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className={styles.createButton}
                                >
                                    {icons.add}
                                    <span>Create Announcement</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className={styles.searchSection}>
                        <div className={styles.searchContainer}>
                            <div className={styles.searchIcon}>
                                {icons.search}
                            </div>
                            <input
                                type="text"
                                placeholder="Search announcements..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        {announcements.length > 0 && (
                            <div className={styles.statsInfo}>
                                <span>{filteredAnnouncements.length} of {announcements.length} announcements</span>
                            </div>
                        )}
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
                                    {icons.close}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    {loading ? (
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h3>Loading Announcements</h3>
                                <p>Fetching the latest updates...</p>
                            </div>
                        </div>
                    ) : filteredAnnouncements.length === 0 ? (
                        <div className={styles.emptyContainer}>
                            <div className={styles.emptyIcon}>
                                {icons.empty}
                            </div>
                            <div className={styles.emptyContent}>
                                <h3>{searchTerm ? 'No matching announcements' : 'No announcements yet'}</h3>
                                <p>
                                    {searchTerm 
                                        ? 'Try adjusting your search terms'
                                        : 'Create your first announcement to keep everyone informed'
                                    }
                                </p>
                                {!searchTerm && (
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className={styles.emptyCreateButton}
                                    >
                                        {icons.add}
                                        <span>Create First Announcement</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.announcementGrid}>
                            {filteredAnnouncements.map((announcement, index) => (
                                <div 
                                    key={announcement.id} 
                                    className={styles.announcementCard}
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className={styles.cardHeader}>
                                        <div className={styles.cardTitle}>
                                            <h3>{announcement.title}</h3>
                                            <div className={styles.cardBadge}>
                                                New
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(announcement.id)}
                                            className={styles.deleteButton}
                                            aria-label="Delete announcement"
                                        >
                                            {icons.delete}
                                        </button>
                                    </div>
                                    <div className={styles.cardContent}>
                                        <p>{announcement.content}</p>
                                    </div>
                                    <div className={styles.cardFooter}>
                                        <div className={styles.dateInfo}>
                                            <div className={styles.dateIcon}>
                                                {icons.calendar}
                                            </div>
                                            <div className={styles.dateText}>
                                                <span className={styles.fullDate}>
                                                    {formatDate(announcement.date)}
                                                </span>
                                                <span className={styles.relativeDate}>
                                                    {getRelativeTime(announcement.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Modal */}
                    {isModalOpen && (
                        <div className={styles.modal} onClick={() => setIsModalOpen(false)}>
                            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                                <div className={styles.modalHeader}>
                                    <div className={styles.modalTitle}>
                                        <div className={styles.modalIcon}>
                                            {icons.announcement}
                                        </div>
                                        <h2>Create New Announcement</h2>
                                    </div>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className={styles.closeButton}
                                    >
                                        {icons.close}
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className={styles.modalForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="title">Announcement Title</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            placeholder="Enter a compelling title..."
                                            required
                                            className={styles.formInput}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label htmlFor="content">Content</label>
                                        <textarea
                                            id="content"
                                            name="content"
                                            value={formData.content}
                                            onChange={handleInputChange}
                                            placeholder="Write your announcement content here..."
                                            required
                                            rows={6}
                                            className={styles.formTextarea}
                                        />
                                    </div>

                                    <div className={styles.modalFooter}>
                                        <button 
                                            type="button" 
                                            onClick={() => setIsModalOpen(false)}
                                            className={styles.cancelButton}
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit" 
                                            className={styles.submitButton}
                                            disabled={submitting}
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className={styles.buttonSpinner}></div>
                                                    <span>Creating...</span>
                                                </>
                                            ) : (
                                                <>
                                                    {icons.add}
                                                    <span>Create Announcement</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
