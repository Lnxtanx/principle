import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

export default withAuth(allowedMethods(async function handler(req, res) {
    const { teacherId } = req.query;
    if (!teacherId) {
        return res.status(400).json({ error: 'Teacher ID is required' });
    }

    const parsedTeacherId = parseInt(teacherId);

    try {
        // Get all classes with their lessons
        const classes = await prisma.class.findMany({
            select: {
                id: true,
                name: true,
                LessonPdf: {
                    where: {
                        OR: [
                            { schoolId: req.schoolId },
                            { isForAllSchools: true }
                        ]
                    },
                    select: {
                        id: true,
                        lessonName: true,
                        isForAllSchools: true
                    }
                }
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Get teacher's completed responses for these classes
        const completedResponses = await prisma.classResponse.findMany({
            where: {
                AND: [
                    { schoolId: req.schoolId },
                    { teacherId: parsedTeacherId },
                    { status: 'Completed' }
                ]
            },
            select: {
                classLevel: true,
                lessonName: true,
                submittedAt: true
            }
        });

        // Process the data to include completion status
        const processedClasses = classes.map(cls => {
            const lessons = cls.LessonPdf.map(lesson => {
                const completedResponse = completedResponses.find(
                    resp => resp.classLevel === cls.name && resp.lessonName === lesson.lessonName
                );

                return {
                    id: lesson.id,
                    lessonName: lesson.lessonName,
                    isForAllSchools: lesson.isForAllSchools,
                    completed: !!completedResponse,
                    submittedAt: completedResponse?.submittedAt || null
                };
            });

            return {
                id: cls.id,
                name: cls.name,
                lessons: lessons
            };
        });

        // Return with cache control headers
        res.setHeader('Cache-Control', 'private, max-age=300');
        return res.status(200).json(processedClasses);

    } catch (error) {
        console.error('Error processing teacher lessons:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}, ['GET']));
