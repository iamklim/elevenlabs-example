import { Module } from '@nestjs/common';

import { AudioModule } from '../audio/audio.module';
import { ElevenlabsModule } from '../elevenlabs/elevenlabs.module';
import { SessionService } from './session.service';

@Module({
  imports: [ElevenlabsModule, AudioModule],
  providers: [SessionService],
  exports: [SessionService],
})
export class SessionModule {}
