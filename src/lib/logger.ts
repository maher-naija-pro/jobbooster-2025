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

    // GDPR-specific logging methods
    gdprConsentUpdate(userId: string, consentVersion: string, context?: LogContext): void {
        this.info(`[GDPR Consent] Consent updated`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            consentVersion,
            action: 'consent_update',
            timestamp: new Date().toISOString()
        });
    }

    gdprConsentFetch(userId: string, context?: LogContext): void {
        this.info(`[GDPR Consent] Consent data fetched`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            action: 'consent_fetch',
            timestamp: new Date().toISOString()
        });
    }

    gdprDataDeletion(userId: string, deletedRecords: number, reason: string, context?: LogContext): void {
        this.info(`[GDPR Delete] Data deletion completed`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            deletedRecords,
            reason,
            action: 'data_deletion',
            timestamp: new Date().toISOString()
        });
    }

    gdprDataExport(userId: string, format: string, dataSize: number, context?: LogContext): void {
        this.info(`[GDPR Export] Data export completed`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            format,
            dataSize,
            action: 'data_export',
            timestamp: new Date().toISOString()
        });
    }

    gdprUnauthorizedAccess(endpoint: string, method: string, context?: LogContext): void {
        this.warn(`[GDPR Security] Unauthorized access attempt`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            endpoint,
            method,
            action: 'unauthorized_access',
            timestamp: new Date().toISOString()
        });
    }

    gdprValidationError(userId: string | undefined, field: string, value: any, context?: LogContext): void {
        this.warn(`[GDPR Validation] Invalid data provided`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            field,
            value,
            action: 'validation_error',
            timestamp: new Date().toISOString()
        });
    }

    gdprDatabaseOperation(operation: string, userId: string, recordCount: number, context?: LogContext): void {
        this.debug(`[GDPR Database] ${operation}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            operation,
            recordCount,
            action: 'database_operation',
            timestamp: new Date().toISOString()
        });
    }

    gdprTransactionStart(userId: string, transactionType: string, context?: LogContext): void {
        this.info(`[GDPR Transaction] Starting ${transactionType}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            transactionType,
            action: 'transaction_start',
            timestamp: new Date().toISOString()
        });
    }

    gdprTransactionComplete(userId: string, transactionType: string, duration: number, context?: LogContext): void {
        this.info(`[GDPR Transaction] ${transactionType} completed`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            transactionType,
            duration: `${duration}ms`,
            action: 'transaction_complete',
            timestamp: new Date().toISOString()
        });
    }

    gdprError(operation: string, userId: string | undefined, error: Error | string, context?: LogContext): void {
        this.error(`[GDPR Error] ${operation} failed`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            userId,
            operation,
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            action: 'gdpr_error',
            timestamp: new Date().toISOString()
        });
    }

    // Mac-specific logging methods
    macProcessStart(processName: string, context?: LogContext): void {
        this.info(`[Mac Process] Starting ${processName}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            processType: 'start'
        });
    }

    macProcessEnd(processName: string, duration: number, context?: LogContext): void {
        this.info(`[Mac Process] Completed ${processName}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            processType: 'end',
            duration: `${duration}ms`
        });
    }

    macSystemInfo(context?: LogContext): void {
        this.info(`[Mac System] System information logged`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server-side',
            timestamp: new Date().toISOString()
        });
    }

    macFileOperation(operation: string, filePath: string, context?: LogContext): void {
        this.info(`[Mac File] ${operation}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            filePath,
            operation
        });
    }

    macNetworkRequest(url: string, method: string, status: number, context?: LogContext): void {
        this.info(`[Mac Network] ${method} ${url}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            url,
            method,
            status,
            timestamp: new Date().toISOString()
        });
    }

    macError(error: Error | string, context?: LogContext): void {
        this.error(`[Mac Error] ${error}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            error: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
        });
    }

    macPerformance(operation: string, duration: number, context?: LogContext): void {
        this.info(`[Mac Performance] ${operation}`, {
            ...(typeof context === 'object' && context !== null ? context : {}),
            platform: 'macOS',
            operation,
            duration: `${duration}ms`,
            performance: duration > 1000 ? 'slow' : duration > 500 ? 'moderate' : 'fast'
        });
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
