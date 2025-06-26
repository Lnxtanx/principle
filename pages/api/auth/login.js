import { PrismaClient } from '../../../generated/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // In production, always use environment variable

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Find the school by email
    const school = await prisma.schools.findUnique({
      where: { email },
    });

    if (!school) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isValid = await bcrypt.compare(password, school.password);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        schoolId: school.id,
        email: school.email,
        name: school.name
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );    // Set token as a cookie and return it in response
    res.setHeader(
      'Set-Cookie',
      `token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${60 * 60 * 24}`
    );
    res.status(200).json({ 
      success: true,
      token,
      user: {
        id: school.id,
        email: school.email,
        name: school.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
