import { PtLoggingRepository } from '~/core/contracts/repositories';
import { PtLoggingService } from '~/core/contracts/services';

export class LoggingService implements PtLoggingService {
  constructor(private loggingRepo: PtLoggingRepository) {}

  log(message: string) {
    this.loggingRepo.log(message);
  }

  warn(message: string) {
    this.loggingRepo.warn(message);
  }

  error(message: string) {
    this.loggingRepo.error(message);
  }
}
