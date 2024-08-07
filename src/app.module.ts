import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ElevenlabsModule } from './modules/elevenlabs/elevenlabs.module';
import { SessionModule } from './modules/session/session.module';
import { AudioModule } from './modules/audio/audio.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    ElevenlabsModule,
    SessionModule,
    AudioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
