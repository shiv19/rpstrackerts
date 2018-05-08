import { PtLoggingRepository } from '~/core/contracts/repositories';
import { LoggingLevelEnum } from '~/core/models/enums';

interface LogEntry {
  message: string;
  level: LoggingLevelEnum;
}

export class LoggingRepository implements PtLoggingRepository {
  private logs: LogEntry[] = [];

  constructor(
    private loggingEnabled: boolean,
    private loggingLevel: LoggingLevelEnum
  ) {}

  log(message: string) {
    if (this.loggingEnabled && this.loggingLevel === LoggingLevelEnum.Debug) {
      this.logs.push({ message: message, level: LoggingLevelEnum.Log });
      console.logColor(message);
    }
  }

  warn(message: string) {
    if (this.loggingEnabled && this.loggingLevel === LoggingLevelEnum.Debug) {
      this.logs.push({ message: message, level: LoggingLevelEnum.Warning });
      console.warnColor(message);
    }
  }

  error(message: string) {
    if (this.loggingEnabled) {
      this.logs.push({ message: message, level: LoggingLevelEnum.Error });
      console.errorColor(message);
    }
  }
}
