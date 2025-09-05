import { cleanupExpiredSessions } from './session-manager'

/**
 * Cleanup expired sessions - can be called from API routes or cron jobs
 */
export async function runSessionCleanup() {
    try {
        const result = await cleanupExpiredSessions()

        if (result.success) {
            console.log(`Session cleanup completed: ${result.deletedCount} expired sessions removed`)
            return {
                success: true,
                deletedCount: result.deletedCount,
                message: `Cleaned up ${result.deletedCount} expired sessions`
            }
        } else {
            console.error('Session cleanup failed:', result.error)
            return {
                success: false,
                error: result.error,
                message: 'Session cleanup failed'
            }
        }
    } catch (error) {
        console.error('Error running session cleanup:', error)
        return {
            success: false,
            error,
            message: 'Session cleanup failed with error'
        }
    }
}
