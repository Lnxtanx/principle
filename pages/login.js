import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });      const data = await res.json();
      if (res.ok) {
        const returnUrl = router.query.returnUrl || '/';
        // Set the token in a cookie for middleware access
        document.cookie = `token=${data.token}; path=/`;
        // Redirect to the page user was trying to access, or index if none
        const redirectTo = router.query.callbackUrl || '/';
        router.push(redirectTo);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login | School Portal</title>
        <meta name="description" content="Secure login to School Portal" />
      </Head>

      <div className="login-container">
        <div className="login-background">
          <div className="background-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="login-card">
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">🎓</div>
              <h1>School Portal</h1>
            </div>
            <p className="subtitle">Welcome back! Please sign in to your account</p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                📧 Email Address
              </label>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                🔒 Password
              </label>
              <div className="input-wrapper password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="button-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="divider">
              <span>Secure Login</span>
            </div>
            <p className="footer-text">
              Protected by advanced encryption • School Portal 2025
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .login-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
          z-index: -2;
        }

        .background-shapes {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          top: 60%;
          right: 15%;
          animation-delay: 2s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          bottom: 20%;
          left: 60%;
          animation-delay: 4s;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }

        .login-card {
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(148, 163, 184, 0.2);
          border-radius: 24px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 1;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .logo-icon {
          font-size: 3rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3));
        }

        .logo h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #f1f5f9;
          margin: 0;
          background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 1rem;
          margin: 0;
          line-height: 1.5;
        }

        .error-message {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-icon {
          font-size: 1.2rem;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .input-wrapper {
          position: relative;
        }

        .password-wrapper {
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(51, 65, 85, 0.5);
          border: 2px solid rgba(148, 163, 184, 0.2);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 1rem;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          background: rgba(51, 65, 85, 0.8);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          color: #e2e8f0;
          background: rgba(148, 163, 184, 0.1);
        }

        .password-toggle:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .login-button {
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 1.25rem 2rem;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-top: 1rem;
          box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.8;
          cursor: not-allowed;
          transform: none;
        }

        .login-button.loading {
          background: linear-gradient(135deg, #6b7280, #4b5563);
        }

        .button-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .login-button:hover .button-arrow {
          transform: translateX(4px);
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .login-footer {
          margin-top: 2.5rem;
          text-align: center;
        }

        .divider {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.3), transparent);
        }

        .divider span {
          background: rgba(30, 41, 59, 0.95);
          color: #64748b;
          padding: 0 1rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .footer-text {
          color: #64748b;
          font-size: 0.8rem;
          margin: 0;
          line-height: 1.4;
        }

        @media (max-width: 640px) {
          .login-container {
            padding: 1rem;
          }

          .login-card {
            padding: 2rem;
            border-radius: 16px;
          }

          .logo h1 {
            font-size: 1.75rem;
          }

          .logo-icon {
            font-size: 2.5rem;
          }

          .form-input {
            padding: 0.875rem 1rem;
          }

          .login-button {
            padding: 1rem 1.5rem;
            font-size: 1rem;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 1.5rem;
          }

          .logo h1 {
            font-size: 1.5rem;
          }

          .subtitle {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </>
  );
}
