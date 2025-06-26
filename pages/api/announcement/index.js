import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const schoolId = req.schoolId;

        if (!schoolId) {
            return res.status(401).json({ error: 'Unauthorized - School ID not found' });
        }

        if (req.method === 'GET') {
            const announcements = await prisma.announcement.findMany({
                where: { 
                    school_id: schoolId
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    date: true,
                    schools: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: { 
                    date: 'desc' 
                },
                take: 50 // Limit to recent 50 announcements
            });
            
            // Format the response
            const formattedAnnouncements = announcements.map(announcement => ({
                id: announcement.id,
                title: announcement.title,
                content: announcement.content,
                date: announcement.date,
                schoolName: announcement.schools.name
            }));

            return res.status(200).json(formattedAnnouncements);
        }

        if (req.method === 'POST') {
            const { title, content } = req.body;
            
            if (!title?.trim() || !content?.trim()) {
                return res.status(400).json({ error: 'Title and content are required' });
            }

            const announcement = await prisma.announcement.create({
                data: {
                    title: title.trim(),
                    content: content.trim(),
                    school_id: schoolId,
                    date: new Date()
                },
                select: {
                    id: true,
                    title: true,
                    content: true,
                    date: true,
                    schools: {
                        select: {
                            name: true
                        }
                    }
                }
            });

            return res.status(201).json({
                id: announcement.id,
                title: announcement.title,
                content: announcement.content,
                date: announcement.date,
                schoolName: announcement.schools.name
            });
        }

        // Handle DELETE method
        if (req.method === 'DELETE') {
            const { id } = req.query;
            
            if (!id) {
                return res.status(400).json({ error: 'Announcement ID is required' });
            }

            const existingAnnouncement = await prisma.announcement.findFirst({
                where: {
                    id: parseInt(id),
                    school_id: schoolId
                }
            });

            if (!existingAnnouncement) {
                return res.status(404).json({ error: 'Announcement not found' });
            }

            await prisma.announcement.delete({
                where: {
                    id: parseInt(id)
                }
            });

            return res.status(200).json({ message: 'Announcement deleted successfully' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Error handling announcement:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default withAuth(allowedMethods(['GET', 'POST', 'DELETE'])(handler));
