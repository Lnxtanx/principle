import { useState, useEffect } from 'react';
import Layout from '../components/layout';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import { getSession } from '../utils/auth';

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [schoolData, setSchoolData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (!sessionRes.ok || !sessionData.user) {
          router.push('/login');
          return;
        }
        
        setSchoolData(sessionData.user);

        const announcementRes = await fetch('/api/announcement');
        if (announcementRes.ok) {
          const announcementData = await announcementRes.json();
          setAnnouncements(announcementData);
        } else {
          console.error('Failed to fetch announcements');
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoadingAnnouncements(false);
      }
    };

    fetchData();
    setCurrentDateTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  // Professional SVG Icons
  const icons = {
    announcements: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    reports: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    lessons: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    teachers: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.34-1.02-1.3-1.74-2.39-1.74-.34 0-.68.07-1 .2L15 8.1V23h5z"/>
      </svg>
    ),
    clock: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
      </svg>
    ),
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
      </svg>
    )
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!schoolData) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading dashboard...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.welcomeSection}>
            <div className={styles.welcomeText}>
              <h1>Welcome back, <span className={styles.schoolName}>{schoolData.name}</span></h1>
              <p className={styles.subtitle}>Manage your school efficiently with our comprehensive portal</p>
            </div>
            {currentDateTime && (
              <div className={styles.dateTimeWidget}>
                <div className={styles.dateTimeCard}>
                  <div className={styles.dateSection}>
                    {icons.calendar}
                    <span>{formatDate(currentDateTime)}</span>
                  </div>
                  <div className={styles.timeSection}>
                    {icons.clock}
                    <span className={styles.liveTime}>{formatTime(currentDateTime)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.announcements}>
            <div className={styles.sectionHeader}>
              <h2>
                <span className={styles.sectionIcon}>{icons.announcements}</span>
                Recent Announcements
              </h2>
              <Link href="/announcement" className={styles.viewAllLink}>
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </Link>
            </div>
            <div className={styles.announcementList}>
              {loadingAnnouncements ? (
                <div className={styles.loadingAnnouncements}>
                  <div className={styles.loadingSpinner}></div>
                  <span>Loading announcements...</span>
                </div>
              ) : announcements.length > 0 ? (
                announcements.slice(0, 5).map((announcement) => (
                  <div key={announcement.id} className={styles.announcementCard}>
                    <div className={styles.announcementHeader}>
                      <h3>{announcement.title}</h3>
                      <span className={styles.announcementBadge}>New</span>
                    </div>
                    <p className={styles.announcementContent}>{announcement.content}</p>
                    <div className={styles.announcementFooter}>
                      <span className={styles.date}>
                        {new Date(announcement.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noAnnouncements}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" opacity="0.5">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <h3>No announcements yet</h3>
                  <p>Create your first announcement to keep everyone informed</p>
                </div>
              )}
            </div>
          </section>

          <section className={styles.quickActions}>
            <div className={styles.sectionHeader}>
              <h2>Quick Actions</h2>
              <p>Access frequently used features</p>
            </div>
            <div className={styles.quickActionsGrid}>
              <Link href="/announcement" className={styles.quickActionCard}>
                <div className={styles.cardIcon}>
                  {icons.announcements}
                </div>
                <div className={styles.cardContent}>
                  <h3>Announcements</h3>
                  <p>Create and manage school announcements</p>
                </div>
                <div className={styles.cardArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </Link>

              <Link href="/record-generation/records" className={styles.quickActionCard}>
                <div className={styles.cardIcon}>
                  {icons.reports}
                </div>
                <div className={styles.cardContent}>
                  <h3>Report Generation</h3>
                  <p>Generate and view academic reports</p>
                </div>
                <div className={styles.cardArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </Link>

              <Link href="/class-report/class-completed" className={styles.quickActionCard}>
                <div className={styles.cardIcon}>
                  {icons.lessons}
                </div>
                <div className={styles.cardContent}>
                  <h3>Completed Lessons</h3>
                  <p>View completed class lessons</p>
                </div>
                <div className={styles.cardArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </Link>

              <Link href="/teachers/teacher" className={styles.quickActionCard}>
                <div className={styles.cardIcon}>
                  {icons.teachers}
                </div>
                <div className={styles.cardContent}>
                  <h3>Teacher Details</h3>
                  <p>Manage teacher information</p>
                </div>
                <div className={styles.cardArrow}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                  </svg>
                </div>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession(req);
  
  if (!session?.user?.schoolId) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      schoolId: session.user.schoolId,
      schoolName: session.user.name || '',
      schoolEmail: session.user.email || '',
    },
  };
}

