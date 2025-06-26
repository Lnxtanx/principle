import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        const school = await prisma.schools.findUnique({
            where: {
                id: req.schoolId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        return res.status(200).json(school);
    } catch (error) {
        console.error('Error fetching school profile:', error);
        return res.status(500).json({ error: 'Failed to fetch school profile' });
    }
}

export default withAuth(allowedMethods(['GET'])(handler));
