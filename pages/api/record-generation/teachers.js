import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const schoolId = req.schoolId;

        if (!schoolId) {
            return res.status(401).json({ error: 'Unauthorized - School ID not found' });
        }

        const teachers = await prisma.teachers.findMany({
            where: {
                schoolId: schoolId,
                status: 'active'
            },
            select: {
                id: true,
                teacherName: true,
                email: true,
                subjectAssigned: true,
                classAssigned: true
            },
            orderBy: {
                teacherName: 'asc'
            },
            take: 100 // Limit records for performance
        });

        // Add cache headers
        res.setHeader('Cache-Control', 's-maxage=300');
        return res.status(200).json(teachers);

    } catch (error) {
        console.error('Error fetching teachers:', error);
        
        // Detailed error in development, generic in production
        return res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default withAuth(allowedMethods(['GET'])(handler));
