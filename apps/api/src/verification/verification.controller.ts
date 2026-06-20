import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { VerificationService } from './verification.service';

@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post('verify')
  async verify(@Body() body: { url: string; repositoryId: string }) {
    if (!body.url || !body.repositoryId) {
      return { success: false, message: 'Missing url or repositoryId' };
    }
    const report = await this.verificationService.verifyDeployment(
      body.url,
      body.repositoryId
    );
    return {
      success: true,
      message: 'Uptime and SSL audit completed successfully',
      data: report
    };
  }

  @Get('repo/:repoId')
  async getByRepo(@Param('repoId') repoId: string) {
    const reports = await this.verificationService.getReportsByRepo(repoId);
    return { success: true, data: reports };
  }
}
