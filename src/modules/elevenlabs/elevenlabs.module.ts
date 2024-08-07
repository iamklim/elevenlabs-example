import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ElevenlabsService } from './elevenlabs.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [ElevenlabsService],
  exports: [ElevenlabsService],
})
export class ElevenlabsModule {}
