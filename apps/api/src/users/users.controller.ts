import { Controller, Post, Get, Body, Param, Res, HttpStatus, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('analyze')
  async analyze(@Body() body: { username: string }, @Res() res: Response) {
    const { username } = body;
    
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Invalid GitHub username',
      });
    }

    try {
      const result = await this.usersService.analyzeUser(username.trim());
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      if (error.status === HttpStatus.TOO_MANY_REQUESTS || error.message?.includes('rate limit')) {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          error: 'GitHub API rate limit exceeded',
        });
      }
      if (error.status === HttpStatus.NOT_FOUND || error.message?.includes('not found')) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'GitHub user not found',
        });
      }
      if (error.status === HttpStatus.BAD_REQUEST || error.message?.includes('Invalid')) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          error: 'Invalid GitHub username',
        });
      }

      // General fallback error
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message || 'An unexpected error occurred during user analysis',
      });
    }
  }

  @Get(':username')
  async getProfile(@Param('username') username: string, @Res() res: Response) {
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(HttpStatus.BAD_REQUEST).json({
        error: 'Invalid GitHub username',
      });
    }

    try {
      const profile = await this.usersService.getUserByUsername(username.trim());
      if (!profile) {
        return res.status(HttpStatus.NOT_FOUND).json({
          error: 'GitHub user not found',
        });
      }
      return res.status(HttpStatus.OK).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error.message || 'Failed to retrieve profile details',
      });
    }
  }
}
