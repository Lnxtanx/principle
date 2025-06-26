import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const schoolId = req.schoolId;
        
        // Validate schoolId
        if (!schoolId) {
            return res.status(401).json({ error: 'Unauthorized - School ID not found' });
        }

        // Get all classes with their lessons in a single query
        const classesWithLessons = await prisma.class.findMany({
            select: {
                id: true,
                name: true,
                LessonPdf: {
                    where: {
                        OR: [
                            { schoolId: schoolId },
                            { isForAllSchools: true }
                        ]
                    },
                    select: {
                        id: true,
                        lessonName: true,
                        pdfUrl: true,
                        isForAllSchools: true
                    },
                    orderBy: {
                        id: 'desc'
                    },
                    take: 50
                },
                _count: {
                    select: {
                        LessonPdf: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Add cache control headers
        res.setHeader('Cache-Control', 'private, max-age=300');
        
        return res.status(200).json(classesWithLessons);
    } catch (error) {
        console.error('Error fetching class lessons:', error);
        return res.status(500).json({ error: 'Failed to fetch class lessons' });
    }
}

export default allowedMethods(['GET'])(withAuth(handler));
