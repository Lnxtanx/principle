import { prisma } from '../../../lib/prisma';
import { withAuth, allowedMethods } from '../../../utils/apiAuth';

async function handler(req, res) {
    try {
        // Fetch all classes from Class table (they are global)
        const classes = await prisma.class.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        });

        // Add cache headers for performance
        res.setHeader('Cache-Control', 's-maxage=300');
        return res.status(200).json(classes);

    } catch (error) {
        console.error('Error fetching classes:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export default withAuth(allowedMethods(['GET'])(handler));
