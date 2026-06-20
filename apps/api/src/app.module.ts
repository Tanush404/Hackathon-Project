import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { VerificationModule } from './verification/verification.module';

@Module({
  imports: [
    AuthModule,
    RepositoriesModule,
    VerificationModule
  ],
})
export class AppModule {}
