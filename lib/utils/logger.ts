/**
 * Development Logger Utility
 * Provides logging functions that only work in development environment
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class DevelopmentLogger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, component?: string): string {
    const timestamp = new Date().toISOString();
    const componentPrefix = component ? `[${component}] ` : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${componentPrefix}${message}`;
  }

  private log(level: LogLevel, message: string, data?: unknown, component?: string): void {
    if (!this.isDevelopment) return;

    const formattedMessage = this.formatMessage(level, message, component);
    
    switch (level) {
      case 'debug':
        if (data !== undefined) {
          console.log(`🐛 ${formattedMessage}`, data);
        } else {
          console.log(`🐛 ${formattedMessage}`);
        }
        break;
      case 'info':
        if (data !== undefined) {
          console.info(`ℹ️ ${formattedMessage}`, data);
        } else {
          console.info(`ℹ️ ${formattedMessage}`);
        }
        break;
      case 'warn':
        if (data !== undefined) {
          console.warn(`⚠️ ${formattedMessage}`, data);
        } else {
          console.warn(`⚠️ ${formattedMessage}`);
        }
        break;
      case 'error':
        if (data !== undefined) {
          console.error(`❌ ${formattedMessage}`, data);
        } else {
          console.error(`❌ ${formattedMessage}`);
        }
        break;
    }
  }

  /**
   * Log debug information (for development debugging)
   */
  debug(message: string, data?: unknown, component?: string): void {
    this.log('debug', message, data, component);
  }

  /**
   * Log general information
   */
  info(message: string, data?: unknown, component?: string): void {
    this.log('info', message, data, component);
  }

  /**
   * Log warnings
   */
  warn(message: string, data?: unknown, component?: string): void {
    this.log('warn', message, data, component);
  }

  /**
   * Log errors
   */
  error(message: string, data?: unknown, component?: string): void {
    this.log('error', message, data, component);
  }

  /**
   * Log form-specific debug information
   */
  formDebug(formName: string, action: string, data?: unknown): void {
    this.debug(`${formName} - ${action}`, data, 'Form');
  }

  /**
   * Log component lifecycle events
   */
  lifecycle(component: string, event: string, data?: unknown): void {
    this.debug(`${event}`, data, component);
  }

  /**
   * Group multiple logs together
   */
  group(label: string, callback: () => void): void {
    if (!this.isDevelopment) return;
    
    console.group(`📋 ${label}`);
    callback();
    console.groupEnd();
  }

  /**
   * Start a collapsible group of logs
   */
  groupStart(label: string): void {
    if (!this.isDevelopment) return;
    console.group(`📋 ${label}`);
  }

  /**
   * Start a collapsed group of logs
   */
  groupCollapsed(label: string): void {
    if (!this.isDevelopment) return;
    console.groupCollapsed(`📋 ${label}`);
  }

  /**
   * End the current group
   */
  groupEnd(): void {
    if (!this.isDevelopment) return;
    console.groupEnd();
  }

  /**
   * Check if logging is enabled (development mode)
   */
  get isEnabled(): boolean {
    return this.isDevelopment;
  }
}

// Create and export a singleton instance
export const logger = new DevelopmentLogger();

// Export the class for testing purposes
export { DevelopmentLogger };
