import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GithubApiService } from './github-api.service';
import { SkillExtractorService } from './skill-extractor.service';
import { RepositoriesModule } from '../repositories/repositories.module';

@Module({
  imports: [RepositoriesModule],
  controllers: [UsersController],
  providers: [UsersService, GithubApiService, SkillExtractorService],
  exports: [UsersService, SkillExtractorService],
})
export class UsersModule {}
