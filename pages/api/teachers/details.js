import { prisma } from '../../../lib/prisma';
import { withAuth } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const { teacherId } = req.query;
        const schoolId = req.schoolId;

        if (!teacherId || !schoolId) {
            return res.status(400).json({ 
                success: false, 
                error: 'Teacher ID and School ID are required' 
            });
        }

        // Get teacher details with correct field names
        const teacher = await prisma.teachers.findFirst({
            where: {
                id: parseInt(teacherId),
                schoolId: schoolId
            },
            select: {
                id: true,
                teacherName: true,
                email: true,
                profileImage: true,
                qualification: true,
                subjectAssigned: true,
                classAssigned: true,
                schools: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                error: 'Teacher not found' 
            });
        }

        // Transform the response to match the expected format
        const transformedTeacher = {
            ...teacher,
            name: teacher.teacherName, // Add name field for consistency
        };

        res.status(200).json({
            success: true,
            data: transformedTeacher
        });

    } catch (error) {
        console.error('Error fetching teacher details:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message 
        });
    }
}

export default withAuth(handler);
