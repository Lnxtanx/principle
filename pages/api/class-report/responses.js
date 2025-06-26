import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const { teacherId, className } = req.query;
        const schoolId = req.schoolId;

        if (!teacherId || !className) {
            return res.status(400).json({ error: 'Teacher ID and Class Name are required' });
        }

        if (!schoolId) {
            return res.status(401).json({ error: 'Unauthorized - School ID not found' });
        }

        // Get class responses for the specific teacher and class
        const responses = await prisma.classResponse.findMany({
            where: {
                teacherId: parseInt(teacherId),
                classLevel: className,
                schoolId: schoolId
            },
            select: {
                id: true,
                lessonName: true,
                status: true,
                reason: true,
                submittedAt: true,
                imageUrl: true,
                teachers: {
                    select: {
                        teacherName: true
                    }
                }
            },
            orderBy: {
                submittedAt: 'desc'
            }
        });

        return res.status(200).json(responses);

    } catch (error) {
        console.error('Error fetching class responses:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default withAuth(allowedMethods(['GET'])(handler));
