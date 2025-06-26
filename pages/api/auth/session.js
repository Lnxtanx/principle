import { getSession } from '../../../utils/auth';

export default async function handler(req, res) {
  try {
    const session = await getSession(req);
    if (!session) {
      return res.status(401).json({ error: 'No active session' });
    }

    return res.status(200).json({ 
      user: {
        schoolId: session.schoolId,
        email: session.email,
        name: session.name
      }
    });
  } catch (error) {
    console.error('Session error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
