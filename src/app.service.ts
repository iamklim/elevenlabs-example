import { Injectable, OnModuleInit } from '@nestjs/common';
import { SessionService } from './modules/session/session.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly sessionService: SessionService) {}

  onModuleInit() {
    this.sessionService.start('upXdoBq9wiydOGAaLw3x');
    console.log('Audio generation started');
  }

  getHello(): string {
    return 'Audio generation started, check server console';
  }
}
