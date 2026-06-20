import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { VerificationModule } from './verification/verification.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    RepositoriesModule,
    VerificationModule,
    UsersModule
  ],
})
export class AppModule {}
