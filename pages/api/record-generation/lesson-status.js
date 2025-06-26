import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const { teacherId } = req.query;
        const schoolId = req.schoolId;
        
        if (!teacherId) {
            return res.status(400).json({ error: 'Teacher ID is required' });
        }

        if (!schoolId) {
            return res.status(401).json({ error: 'Unauthorized - School ID not found' });
        }

        const parsedTeacherId = parseInt(teacherId);

        // Get all classes and their lessons
        const classes = await prisma.class.findMany({
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
                        isForAllSchools: true,
                        createdAt: true,
                        updatedAt: true
                    },
                    orderBy: {
                        lessonName: 'asc'
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Get teacher's completed responses
        const completedResponses = await prisma.classResponse.findMany({
            where: {
                teacherId: parsedTeacherId,
                schoolId: schoolId
            },
            select: {
                classLevel: true,
                lessonName: true,
                status: true,
                submittedAt: true,
                reason: true,
                imageUrl: true
            }
        });

        // Create a map for faster lookups
        const responseMap = new Map(
            completedResponses.map(response => [
                `${response.classLevel.trim().toLowerCase()}-${response.lessonName.trim().toLowerCase()}`,
                response
            ])
        );

        // Process data to include completion status
        const processedData = classes
            .map(cls => {
                // Skip if no lessons for this class
                if (!cls.LessonPdf || cls.LessonPdf.length === 0) {
                    return null;
                }

                const lessons = cls.LessonPdf.map(lesson => {
                    // Normalize strings for comparison
                    const key = `${cls.name.trim().toLowerCase()}-${lesson.lessonName.trim().toLowerCase()}`;
                    const response = responseMap.get(key);

                    return {
                        lessonId: lesson.id,
                        lessonName: lesson.lessonName,
                        pdfUrl: lesson.pdfUrl,
                        isForAllSchools: lesson.isForAllSchools,
                        status: response?.status || 'Pending',
                        submittedAt: response?.submittedAt || null,
                        reason: response?.reason || null,
                        imageUrl: response?.imageUrl || null,
                        createdAt: lesson.createdAt,
                        updatedAt: lesson.updatedAt
                    };
                });

                return {
                    classId: cls.id,
                    className: cls.name,
                    lessons: lessons
                };
            })
            .filter(Boolean) // Remove null entries
            .filter(classData => classData.lessons.length > 0); // Remove classes with no lessons

        if (processedData.length === 0) {
            return res.status(404).json({ error: 'No lessons found for this teacher' });
        }

        // Add cache control headers
        res.setHeader('Cache-Control', 'private, max-age=300');
        
        return res.status(200).json(processedData);
    } catch (error) {
        console.error('Error fetching lesson status:', error);
        return res.status(500).json({ error: 'Failed to fetch lesson status' });
    }
}

export default allowedMethods(['GET'])(withAuth(handler));
