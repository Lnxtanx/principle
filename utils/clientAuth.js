export const checkAuth = async () => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return false;
    
    try {
        const response = await fetch('/api/auth/session');
        const session = await response.json();
        return !!session?.user?.schoolId;
    } catch (error) {
        return false;
    }
};

export const redirectToLogin = () => {
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};
