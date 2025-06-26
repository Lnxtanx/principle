import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function getSchoolFromToken(token) {
  try {
    const decoded = verify(token, JWT_SECRET);
    return {
      user: {
        schoolId: decoded.schoolId,
        email: decoded.email,
        name: decoded.name
      }
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export async function getSession(req) {
  try {
    const token = req.cookies.token;
    if (!token) return null;
    return getSchoolFromToken(token);
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

// Helper function to check if path requires auth
export function requiresAuth(path) {
  const publicPaths = ['/login', '/api/auth/login'];
  return !publicPaths.includes(path);
}

export function checkAuth(handler) {
  return async (req, res) => {
    try {
      const session = await getSession(req);
      if (!session || !session.schoolId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      return handler(req, res, session);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}
