import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import styles from '../../styles/Report.module.css';
import containerStyles from '../../styles/PageContainer.module.css';
import { generatePDF } from '../../utils/pdf';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function Report() {
    const router = useRouter();
    const { teacherId, teacherName } = router.query;
    
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [generatingPDF, setGeneratingPDF] = useState(false);
    const [teacherDetails, setTeacherDetails] = useState(null);

    // Professional SVG Icons
    const icons = {
        report: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
        ),
        teacher: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
        ),
        download: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
        ),
        chart: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
            </svg>
        ),
        class: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6L23 9l-11-6zm6.5 12.5L12 18.15 5.5 15.5v-3.79L12 15l6.5-3.29v3.79z"/>
            </svg>
        ),
        completed: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
            </svg>
        ),
        pending: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
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
        )
    };

    useEffect(() => {
        if (teacherId) {
            Promise.all([
                fetchReportData(),
                fetchTeacherDetails()
            ]);
        }
    }, [teacherId]);

    const fetchTeacherDetails = async () => {
        try {
            const response = await fetch(`/api/teachers/details?teacherId=${teacherId}`);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to fetch teacher details');
            }

            if (result.success && result.data) {
                setTeacherDetails(result.data);
            }
        } catch (err) {
            console.error('Error fetching teacher details:', err);
        }
    };

    const fetchReportData = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch(`/api/record-generation/lesson-status?teacherId=${teacherId}`);
            
            if (!response.ok) {
                if (response.status === 401) {
                    router.push('/login');
                    return;
                }
                const error = await response.json();
                throw new Error(error.message || 'Failed to fetch report data');
            }

            const result = await response.json();
            const data = result.data || result;
            
            if (!data || (Array.isArray(data) && data.length === 0)) {
                setReportData(null);
                setError('No data available for this teacher');
                return;
            }

            setReportData(data);
        } catch (err) {
            console.error('Error loading report:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // UPDATED PDF DOWNLOAD FUNCTION
    const handleDownloadPDF = async () => {
        try {
            setGeneratingPDF(true);
            setError('');

            console.log('Starting PDF generation...');
            console.log('Report data:', reportData);
            console.log('Teacher details:', teacherDetails);

            // Wait for all content to be fully rendered, especially charts
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Ensure charts are fully rendered
            const charts = document.querySelectorAll('canvas');
            console.log('Found charts:', charts.length);
            
            if (charts.length > 0) {
                // Wait extra time for Chart.js to complete rendering
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const container = document.getElementById('report-content');
            if (!container) {
                throw new Error('Report container not found');
            }

            console.log('Report container found:', container);
            console.log('Container has content:', container.children.length > 0);

            // Make sure the container is visible
            const originalDisplay = container.style.display;
            container.style.display = 'block';

            // Format the report data properly for PDF generation
            const formattedData = reportData?.map(classData => {
                const total = classData?.lessons?.length || 0;
                const completed = classData?.lessons?.filter(l => l?.status === 'Completed')?.length || 0;
                
                return {
                    className: classData?.className || 'Unknown Class',
                    totalLessons: total,
                    completedLessons: completed,
                    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
                    lessons: classData?.lessons?.map(lesson => ({
                        lessonName: lesson?.lessonName || 'Untitled Lesson',
                        status: lesson?.status || 'Not Started',
                        completed: lesson?.status === 'Completed',
                        submittedAt: lesson?.submittedAt || null
                    })) || []
                };
            }) || [];

            console.log('Formatted data:', formattedData);

            // Generate and download PDF directly
            await generatePDF({
                teacherDetails: teacherDetails || { 
                    name: teacherName || 'Unknown Teacher',
                    teacherName: teacherName || 'Unknown Teacher',
                    schools: { name: 'School Report' }
                },
                reportData: formattedData,
                containerId: 'report-content'
            });

            // Restore original display
            container.style.display = originalDisplay;

            console.log('PDF generated successfully');

        } catch (err) {
            console.error('Error generating PDF:', err);
            setError(`Failed to generate PDF: ${err.message}. Please try again.`);
        } finally {
            setGeneratingPDF(false);
        }
    };

    // Enhanced chart configuration with better visibility
    const getChartData = () => {
        if (!reportData) return null;

        const labels = reportData.map(item => item.className);
        const lessonsData = reportData.map(item => {
            const completed = item.lessons.filter(l => l.status === 'Completed').length;
            return completed;
        });
        const totalLessonsData = reportData.map(item => item.lessons.length);
        const completionData = reportData.map(item => {
            const completed = item.lessons.filter(l => l.status === 'Completed').length;
            const total = item.lessons.length;
            return total > 0 ? Math.round((completed / total) * 100) : 0;
        });

        // High-contrast colors for better visibility
        const chartColors = {
            primary: '#3B82F6',      // Bright Blue
            success: '#10B981',      // Bright Green
            warning: '#F59E0B',      // Bright Orange
            purple: '#8B5CF6',       // Bright Purple
        };

        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#ffffff',
                        font: {
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                            size: 14,
                            weight: '600'
                        },
                        padding: 20,
                        boxWidth: 15,
                        boxHeight: 15,
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#3B82F6',
                    borderWidth: 1,
                    cornerRadius: 8,
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                            size: 12,
                            weight: '500'
                        },
                        padding: 10
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        lineWidth: 1
                    },
                    ticks: {
                        color: '#ffffff',
                        font: {
                            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                            size: 12,
                            weight: '500'
                        },
                        padding: 10,
                        maxRotation: 45
                    }
                }
            }
        };

        return {
            completion: {
                labels,
                datasets: [{
                    label: 'Completion Percentage',
                    data: completionData,
                    backgroundColor: chartColors.primary,
                    borderColor: chartColors.primary,
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                    hoverBackgroundColor: '#2563EB',
                    hoverBorderColor: '#2563EB',
                }],
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Class Completion Percentages',
                            color: '#ffffff',
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                                size: 18,
                                weight: '700'
                            },
                            padding: 20
                        }
                    },
                    scales: {
                        ...commonOptions.scales,
                        y: {
                            ...commonOptions.scales.y,
                            max: 100,
                            ticks: {
                                ...commonOptions.scales.y.ticks,
                                callback: value => `${value}%`
                            }
                        }
                    }
                }
            },
            lessons: {
                labels,
                datasets: [
                    {
                        label: 'Completed Lessons',
                        data: lessonsData,
                        backgroundColor: chartColors.success,
                        borderColor: chartColors.success,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: '#059669',
                        hoverBorderColor: '#059669',
                    },
                    {
                        label: 'Total Lessons',
                        data: totalLessonsData,
                        backgroundColor: chartColors.purple,
                        borderColor: chartColors.purple,
                        borderWidth: 2,
                        borderRadius: 8,
                        borderSkipped: false,
                        hoverBackgroundColor: '#7C3AED',
                        hoverBorderColor: '#7C3AED',
                    }
                ],
                options: {
                    ...commonOptions,
                    plugins: {
                        ...commonOptions.plugins,
                        title: {
                            display: true,
                            text: 'Lessons Completed vs Total',
                            color: '#ffffff',
                            font: {
                                family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
                                size: 18,
                                weight: '700'
                            },
                            padding: 20
                        }
                    }
                }
            }
        };
    };

    const getReportStats = () => {
        if (!reportData) return { totalClasses: 0, totalLessons: 0, completedLessons: 0, avgCompletion: 0 };
        
        const totalClasses = reportData.length;
        const totalLessons = reportData.reduce((sum, classData) => sum + classData.lessons.length, 0);
        const completedLessons = reportData.reduce((sum, classData) => 
            sum + classData.lessons.filter(l => l.status === 'Completed').length, 0
        );
        const avgCompletion = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
        
        return { totalClasses, totalLessons, completedLessons, avgCompletion };
    };

    const chartData = getChartData();
    const stats = getReportStats();

    if (loading) {
        return (
            <Layout>
                <div className={containerStyles.pageContainer}>
                    <div className={containerStyles.contentCard}>
                        <div className={styles.loadingContainer}>
                            <div className={styles.loadingSpinner}></div>
                            <div className={styles.loadingContent}>
                                <h3>Generating Report</h3>
                                <p>Analyzing lesson completion data for {teacherName}...</p>
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
                                <h2>Error Loading Report</h2>
                                <p>{error}</p>
                                <button onClick={fetchReportData} className={styles.retryButton}>
                                    {icons.retry}
                                    <span>Retry</span>
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
            <div className={containerStyles.container}>
                <div className={styles.container}>
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.titleSection}>
                            <div className={styles.titleIcon}>
                                {icons.report}
                            </div>
                            <div className={styles.titleText}>
                                <h1>Lesson Completion Report</h1>
                            </div>
                        </div>
                        <div className={styles.teacherInfo}>
                            <div className={styles.teacherIcon}>
                                {icons.teacher}
                            </div>
                            <span>{teacherName}</span>
                        </div>
                    </div>

                    <div id="report-content">
                        {/* Stats Section */}
                        <div className={styles.statsSection}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    {icons.class}
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.totalClasses}</div>
                                    <div className={styles.statLabel}>Total Classes</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    {icons.chart}
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.totalLessons}</div>
                                    <div className={styles.statLabel}>Total Lessons</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    {icons.completed}
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.completedLessons}</div>
                                    <div className={styles.statLabel}>Completed</div>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>
                                    {icons.pending}
                                </div>
                                <div className={styles.statContent}>
                                    <div className={styles.statNumber}>{stats.avgCompletion}%</div>
                                    <div className={styles.statLabel}>Completion Rate</div>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        {chartData && (
                            <div className={styles.chartsSection}>
                                <div className={styles.sectionHeader}>
                                    <h2>Visual Analytics</h2>
                                    <p>Comprehensive data visualization of lesson completion metrics</p>
                                </div>
                                <div className={styles.chartsGrid}>
                                    <div className={styles.chartCard}>
                                        <div className={styles.chartHeader}>
                                            <h3>Completion Percentages</h3>
                                        </div>
                                        <div className={styles.chartWrapper}>
                                            <Bar 
                                                data={chartData.completion} 
                                                options={chartData.completion.options}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.chartCard}>
                                        <div className={styles.chartHeader}>
                                            <h3>Lessons Overview</h3>
                                        </div>
                                        <div className={styles.chartWrapper}>
                                            <Bar 
                                                data={chartData.lessons} 
                                                options={chartData.lessons.options}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Detailed Report Section */}
                        <div className={styles.reportSection}>
                            <div className={styles.sectionHeader}>
                                <h2>Detailed Class Reports</h2>
                                <p>Individual class progress and lesson completion status</p>
                            </div>
                            
                            <div className={styles.classReportsGrid}>
                                {reportData && reportData.map((classData, index) => {
                                    const completedLessons = classData.lessons.filter(l => l.status === 'Completed').length;
                                    const totalLessons = classData.lessons.length;
                                    const completionPercentage = Math.round((completedLessons / totalLessons) * 100) || 0;

                                    return (
                                        <div 
                                            key={classData.classId} 
                                            className={styles.classCard}
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <div className={styles.classHeader}>
                                                <div className={styles.classInfo}>
                                                    <div className={styles.classIcon}>
                                                        {icons.class}
                                                    </div>
                                                    <div className={styles.classDetails}>
                                                        <h3>{classData.className}</h3>
                                                        <span className={styles.lessonCount}>
                                                            {completedLessons} of {totalLessons} lessons completed
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className={styles.completionBadge}>
                                                    {completionPercentage}%
                                                </div>
                                            </div>

                                            <div className={styles.progressSection}>
                                                <div className={styles.progressBar}>
                                                    <div 
                                                        className={styles.progressFill}
                                                        style={{ width: `${completionPercentage}%` }}
                                                    />
                                                </div>
                                                <div className={styles.progressText}>
                                                    <span>Progress: {completionPercentage}%</span>
                                                </div>
                                            </div>

                                            <div className={styles.lessonsSection}>
                                                <div className={styles.lessonsHeader}>
                                                    <h4>Lesson Details</h4>
                                                </div>
                                                <div className={styles.lessonsList}>
                                                    {classData.lessons.map((lesson, lessonIndex) => (
                                                        <div 
                                                            key={lesson.lessonId}
                                                            className={`${styles.lessonItem} ${
                                                                lesson.status === 'Completed' ? styles.completed : styles.pending
                                                            }`}
                                                            style={{ animationDelay: `${(index * 0.1) + (lessonIndex * 0.05)}s` }}
                                                        >
                                                            <div className={styles.lessonIcon}>
                                                                {lesson.status === 'Completed' ? icons.completed : icons.pending}
                                                            </div>
                                                            <div className={styles.lessonContent}>
                                                                <span className={styles.lessonName}>
                                                                    {lesson.lessonName}
                                                                </span>
                                                                {lesson.status === 'Completed' && lesson.submittedAt && (
                                                                    <span className={styles.completionDate}>
                                                                        Completed on {new Date(lesson.submittedAt).toLocaleDateString('en-US', {
                                                                            year: 'numeric',
                                                                            month: 'short',
                                                                            day: 'numeric'
                                                                        })}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className={styles.lessonStatus}>
                                                                <span className={`${styles.statusBadge} ${
                                                                    lesson.status === 'Completed' ? styles.statusCompleted : styles.statusPending
                                                                }`}>
                                                                    {lesson.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Download Button */}
                    <button 
                        className={styles.exportButton} 
                        onClick={handleDownloadPDF}
                        disabled={generatingPDF || loading || !reportData}
                    >
                        {generatingPDF ? (
                            <>
                                <div className={styles.buttonSpinner} />
                                <span>Generating PDF...</span>
                            </>
                        ) : (
                            <>
                                {icons.download}
                                <span>Download Report</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Layout>
    );
}
