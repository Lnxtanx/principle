import { getSession } from './auth';

export function withAuth(handler) {
    return async function apiHandler(req, res) {
        try {
            const session = await getSession(req);
            if (!session?.user?.schoolId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Add session to the request object
            req.session = session;
            req.schoolId = session.user.schoolId;

            // Call the handler
            await handler(req, res);
            
        } catch (error) {
            console.error('API Error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    };
}

// Helper for validating HTTP methods
export function allowedMethods(methods) {
    return function methodHandler(handler) {
        return async function (req, res) {
            if (!methods.includes(req.method)) {
                return res.status(405).json({ error: 'Method not allowed' });
            }
            await handler(req, res);
        };
    };
}
