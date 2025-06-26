import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    console.log('Request received for /api/application/fetch');
    console.log('SchoolId:', req.schoolId);
    
    if (!req.schoolId) {
        console.log('No schoolId found in request');
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        console.log('Attempting to fetch applications for schoolId:', req.schoolId);
        const [leaveApplications, eventApplications] = await Promise.all([
            prisma.leaveApplication.findMany({
                where: { 
                    schoolId: req.schoolId
                },
                select: {
                    id: true,
                    reason: true,
                    fromDate: true,
                    toDate: true,
                    status: true,
                    createdAt: true,
                    teacherId: true,
                    teachers: {
                        select: {
                            id: true,
                            teacherName: true,
                            email: true
                        }
                    }
                },
                orderBy: [
                    { status: 'asc' },
                    { createdAt: 'desc' }
                ]
            }),
            prisma.eventApplication.findMany({
                where: { 
                    schoolId: req.schoolId
                },
                select: {
                    id: true,
                    eventName: true,
                    eventDate: true,
                    description: true,
                    status: true,
                    teacherId: true,
                    teachers: {
                        select: {
                            id: true,
                            teacherName: true,
                            email: true
                        }
                    }
                },
                orderBy: [
                    { status: 'asc' },
                    { eventDate: 'desc' }
                ]
            })
        ]);

        console.log('Successfully fetched applications');
        return res.status(200).json({
            leaveApplications,
            eventApplications
        });
    } catch (error) {
        console.error('Error in /api/application/fetch:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch applications',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Apply middlewares
export default withAuth(
    allowedMethods(['GET'])(handler)
);
