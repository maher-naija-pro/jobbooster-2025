// Comprehensive logging utility for the Job Application Enhancer

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    TRACE = 'trace',
}

export type LogContext = Record<string, unknown> | Error | string | number | boolean | null | undefined;

export interface LogEntry {
    timestamp: Date;
    level: LogLevel;
    message: string;
    context?: LogContext;
    userId?: string;
    sessionId?: string;
}

class Logger {
    private level: LogLevel;
    private logs: LogEntry[] = [];

    constructor(level: LogLevel = LogLevel.INFO) {
        this.level = level;
    }

    private shouldLog(level: LogLevel): boolean {
        const levels = Object.values(LogLevel);
        return levels.indexOf(level) <= levels.indexOf(this.level);
    }

    private createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
        return {
            timestamp: new Date(),
            level,
            message,
            context,
            sessionId: this.getSessionId(),
        };
    }

    private getSessionId(): string {
        // In a real implementation, this would get from user session
        return `session_${Date.now()}`;
    }

    private log(level: LogLevel, message: string, context?: LogContext): void {
        if (!this.shouldLog(level)) return;

        const entry = this.createLogEntry(level, message, context);
        this.logs.push(entry);

        // Console output with colored levels
        const color = this.getColor(level);
        console.log(`${color}[${entry.timestamp.toISOString()}] ${level.toUpperCase()}:${color} ${message}`, context || '');

        // In production, you would send to logging service
        if (level === LogLevel.ERROR) {
            // Send to error tracking service
            this.sendToErrorTracking(entry);
        }
    }

    private getColor(level: LogLevel): string {
        switch (level) {
            case LogLevel.ERROR: return '\x1b[31m'; // Red
            case LogLevel.WARN: return '\x1b[33m'; // Yellow
            case LogLevel.INFO: return '\x1b[36m'; // Cyan
            case LogLevel.DEBUG: return '\x1b[35m'; // Magenta
            case LogLevel.TRACE: return '\x1b[37m'; // White
            default: return '\x1b[0m'; // Reset
        }
    }

    private sendToErrorTracking(entry: LogEntry): void {
        // In a real implementation, send to services like Sentry, LogRocket, etc.
        console.error('Error logged to tracking service:', entry);
    }

    // Public logging methods
    error(message: string, context?: LogContext): void {
        this.log(LogLevel.ERROR, message, context);
    }

    warn(message: string, context?: LogContext): void {
        this.log(LogLevel.WARN, message, context);
    }

    info(message: string, context?: LogContext): void {
        this.log(LogLevel.INFO, message, context);
    }

    debug(message: string, context?: LogContext): void {
        this.log(LogLevel.DEBUG, message, context);
    }

    trace(message: string, context?: LogContext): void {
        this.log(LogLevel.TRACE, message, context);
    }

    // Component-specific logging methods
    cvUpload(message: string, context?: LogContext): void {
        this.info(`[CV Upload] ${message}`, context);
    }

    jobAnalysis(message: string, context?: LogContext): void {
        this.info(`[Job Analysis] ${message}`, context);
    }

    contentGeneration(message: string, context?: LogContext): void {
        this.info(`[Content Generation] ${message}`, context);
    }

    apiRequest(endpoint: string, method: string, duration: number, context?: LogContext): void {
        this.info(`[API] ${method} ${endpoint} - ${duration}ms`, context);
    }

    userAction(action: string, context?: LogContext): void {
        this.info(`[User Action] ${action}`, context);
    }

    // Get recent logs (for debugging)
    getRecentLogs(count: number = 10): LogEntry[] {
        return this.logs.slice(-count);
    }

    // Clear logs
    clearLogs(): void {
        this.logs = [];
    }

    // Export logs (for debugging/admin purposes)
    exportLogs(): LogEntry[] {
        return [...this.logs];
    }
}

// Create singleton logger instance
export const logger = new Logger(LogLevel.INFO);

// Export for convenience
export default logger;
