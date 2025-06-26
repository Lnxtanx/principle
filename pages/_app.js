import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();
  
  useEffect(() => {
    // Set initial dark theme by default except for login page
    const isLoginPage = router.pathname === '/login';
    document.documentElement.setAttribute('data-theme', isLoginPage ? 'light' : 'dark');
  }, [router.pathname]);

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
