type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.createLogEntry(level, message, data);
    
    // Add to internal logs array
    this.logs.push(entry);
    
    // Trim logs if exceeding max size
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with styling
    const styles = {
      debug: 'color: #6b7280',
      info: 'color: #2563eb',
      warn: 'color: #d97706',
      error: 'color: #dc2626; font-weight: bold'
    };

    console.log(
      `%c${entry.timestamp} [${level.toUpperCase()}] ${message}`,
      styles[level]
    );

    if (data) {
      console.log(data);
    }

    // For errors, also log the stack trace if available
    if (level === 'error' && data instanceof Error) {
      console.error(data);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();