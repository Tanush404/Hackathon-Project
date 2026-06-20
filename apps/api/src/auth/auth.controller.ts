import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('github')
  async githubLogin(@Body() body: { code: string }) {
    if (!body.code) {
      return { success: false, message: 'OAuth authorization code is required' };
    }
    const result = await this.authService.exchangeGithubCode(body.code);
    return {
      success: true,
      message: 'Successfully authenticated with GitHub',
      data: result
    };
  }
}
