import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
/* import { AppController } from './app.controller';
import { AppService } from './app.service'; */
import { DisksModule } from './disks/disks.module';
import { RolesGuard } from './users/guards/roles.guard';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    DisksModule,
    UsersModule,
  ],
  controllers: [
    /* AppController */
  ],
  providers: [
    /* {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }, */
    /* AppService */
  ],
})
export class AppModule {}
