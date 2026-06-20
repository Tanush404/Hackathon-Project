import { Controller, Post, Get, Body, Param, NotFoundException } from '@nestjs/common';
import { RepositoriesService } from './repositories.service';

@Controller('repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Post('analyze')
  async analyze(@Body() body: { owner: string; repositoryName: string }) {
    if (!body.owner || !body.repositoryName) {
      return { success: false, message: 'Missing owner or repositoryName' };
    }
    const report = await this.repositoriesService.analyzeRepository(
      body.owner,
      body.repositoryName
    );
    return {
      success: true,
      message: 'Analysis completed successfully',
      data: report
    };
  }

  @Get()
  async listAll() {
    const repos = await this.repositoriesService.getAllRepositories();
    return { success: true, data: repos };
  }

  @Get(':id')
  async getDetails(@Param('id') id: string) {
    const repo = await this.repositoriesService.getRepositoryDetails(id);
    if (!repo) {
      throw new NotFoundException(`Repository with ID ${id} not found.`);
    }
    return { success: true, data: repo };
  }
}
