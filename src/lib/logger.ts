export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  context?: Record<string, any>;
  ip?: string;
  path?: string;
  durationMs?: number;
  statusCode?: number;
}

// In-memory circular buffer lưu trữ 200 logs gần nhất cho Admin UI realtime
const MAX_LOG_BUFFER = 200;
const logBuffer: LogEntry[] = [];

class EnterpriseLogger {
  private serviceName: string;

  constructor(serviceName = 'ZyPage-Core') {
    this.serviceName = serviceName;
  }

  private writeLog(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: new Date().toISOString(),
      level,
      service: this.serviceName,
      message,
      context,
      ip: context?.ip || '127.0.0.1',
      path: context?.path,
      durationMs: context?.durationMs,
      statusCode: context?.statusCode,
    };

    // Format console output chuẩn JSON structured log cho APM / CloudWatch / Datadog
    const consoleMsg = `[${entry.timestamp}] [${level}] [${this.serviceName}] ${message}`;
    if (level === 'ERROR') {
      console.error(consoleMsg, context || '');
    } else if (level === 'WARN') {
      console.warn(consoleMsg, context || '');
    } else {
      console.log(consoleMsg, context || '');
    }

    // Push vào buffer bộ nhớ
    logBuffer.unshift(entry);
    if (logBuffer.length > MAX_LOG_BUFFER) {
      logBuffer.pop();
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.writeLog('DEBUG', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.writeLog('INFO', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.writeLog('WARN', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.writeLog('ERROR', message, context);
  }

  audit(message: string, context?: Record<string, any>) {
    this.writeLog('AUDIT', message, context);
  }

  getRecentLogs(limit = 100, level?: LogLevel): LogEntry[] {
    if (level) {
      return logBuffer.filter((l) => l.level === level).slice(0, limit);
    }
    return logBuffer.slice(0, limit);
  }
}

export const logger = new EnterpriseLogger('ZyPage-App');

// Tạo log khởi tạo hệ thống
logger.info('Enterprise Observability & Logging System initialized', {
  env: process.env.NODE_ENV || 'production',
  version: '3.0.0',
});
