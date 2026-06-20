import { Injectable, Logger } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly jwtSecret = 'proof-of-build-jwt-secret-key-12345';

  async exchangeGithubCode(code: string) {
    this.logger.log(`Exchanging code ${code} for GitHub Access Token`);
    
    // Simulate GitHub access token exchange & profile fetch
    const mockUser = {
      id: 'c108c1a6-89d3-49fe-b9c2-069dfb489d53',
      username: 'sanyadev',
      displayName: 'Sanya Dev',
      avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
      bio: 'Full Stack Engineer building secure decentralized ledger integrations and automated audit engines.'
    };

    const token = jwt.sign(
      { userId: mockUser.id, username: mockUser.username },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: mockUser
    };
  }
}
