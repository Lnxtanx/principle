import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id, type, status } = req.body;

    if (!id || !type || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate status
    const validStatuses = ['Pending', 'Approved', 'Rejected', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Use a transaction to ensure data consistency
        const result = await prisma.$transaction(async (prisma) => {
            let application;
            
            // First, verify the application exists and belongs to the school
            if (type === 'leave') {
                application = await prisma.leaveApplication.findFirst({
                    where: { 
                        id: parseInt(id),
                        schoolId: req.schoolId
                    }
                });
            } else if (type === 'event') {
                application = await prisma.eventApplication.findFirst({
                    where: { 
                        id: parseInt(id),
                        schoolId: req.schoolId
                    }
                });
            } else {
                throw new Error('Invalid application type');
            }

            if (!application) {
                throw new Error('Application not found');
            }

            // Update the application status
            if (type === 'leave') {
                return await prisma.leaveApplication.update({
                    where: { id: parseInt(id) },
                    data: { status },
                    include: {
                        teachers: {
                            select: {
                                teacherName: true,
                                email: true
                            }
                        }
                    }
                });
            } else {
                return await prisma.eventApplication.update({
                    where: { id: parseInt(id) },
                    data: { status },
                    include: {
                        teachers: {
                            select: {
                                teacherName: true,
                                email: true
                            }
                        }
                    }
                });
            }
        });

        return res.status(200).json({
            success: true,
            message: `Application ${status.toLowerCase()}`,
            data: result
        });

    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to update application status'
        });
    }
}

export default withAuth(
    allowedMethods(['POST'])(handler)
);
