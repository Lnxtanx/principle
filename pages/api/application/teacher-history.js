import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

export default withAuth(allowedMethods(async function handler(req, res) {
    const { teacherId } = req.query;
    if (!teacherId) {
        return res.status(400).json({ error: 'Teacher ID is required' });
    }

    try {
        const [leaveApplications, eventApplications] = await Promise.all([
            prisma.leaveApplication.findMany({
                where: { 
                    teacherId: parseInt(teacherId),
                    schoolId: req.schoolId
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            prisma.eventApplication.findMany({
                where: { 
                    teacherId: parseInt(teacherId),
                    schoolId: req.schoolId
                },
                orderBy: {
                    eventDate: 'desc'
                }
            })
        ]);

        return res.status(200).json({
            leaveApplications,
            eventApplications
        });
    } catch (error) {
        console.error('Error fetching teacher history:', error);
        return res.status(500).json({ error: 'Failed to fetch teacher history' });
    }
}, ['GET']));
