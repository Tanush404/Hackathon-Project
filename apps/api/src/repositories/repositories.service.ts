import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  calculateRepositoryComplexity, 
  calculateCommitContributionScore 
} from './scoring.util';

@Injectable()
export class RepositoriesService {
  private readonly logger = new Logger(RepositoriesService.name);
  private readonly gemini: GoogleGenerativeAI | null = null;

  // In-memory cache for hackathon quickstart when PostgreSQL isn't running
  private mockRepoDb = new Map<string, any>();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.gemini = new GoogleGenerativeAI(apiKey);
      this.logger.log('Gemini AI Engine successfully initialized.');
    } else {
      this.logger.warn('GEMINI_API_KEY not found. AI features will run in mock mode.');
    }
  }

  async analyzeRepository(owner: string, repoName: string, userId: string = 'mock-user-id') {
    this.logger.log(`Starting analysis for repository ${owner}/${repoName}`);
    
    // 1. Simulating GitHub API calls
    const mockRepoMetadata = {
      id: Math.floor(Math.random() * 100000000),
      name: repoName,
      fullName: `${owner}/${repoName}`,
      description: `A verified production-ready implementation of ${repoName}.`,
      primaryLanguage: 'TypeScript',
      starsCount: Math.floor(Math.random() * 120) + 15,
      forksCount: Math.floor(Math.random() * 30) + 5,
      repoCreatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    // 2. Generate commits history and contributions
    const mockCommits = [
      { sha: 'sha1', authorName: 'Sanya Dev', authorEmail: 'sanya@dev.net', message: 'feat: add user authentication flow and JWT validation', linesAdded: 320, linesDeleted: 15, commitDate: new Date().toISOString() },
      { sha: 'sha2', authorName: 'Sanya Dev', authorEmail: 'sanya@dev.net', message: 'fix: resolve race conditions on token refresh', linesAdded: 45, linesDeleted: 8, commitDate: new Date(Date.now() - 1200000).toISOString() },
      { sha: 'sha3', authorName: 'Sanya Dev', authorEmail: 'sanya@dev.net', message: 'test: configure units for deployment verification #10', linesAdded: 150, linesDeleted: 0, commitDate: new Date(Date.now() - 3600000).toISOString() },
      { sha: 'sha4', authorName: 'Contributor A', authorEmail: 'contrib@dev.net', message: 'docs: update deployment guidelines', linesAdded: 12, linesDeleted: 2, commitDate: new Date(Date.now() - 7200000).toISOString() },
    ];

    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let totalContributionScore = 0;

    mockCommits.forEach(c => {
      if (c.authorName === 'Sanya Dev') {
        const isVendorFile = c.message.includes('package-lock.json');
        const score = calculateCommitContributionScore(c.linesAdded, c.linesDeleted, c.message, isVendorFile);
        totalContributionScore += score;
        totalLinesAdded += c.linesAdded;
        totalLinesDeleted += c.linesDeleted;
      }
    });

    const complexityScore = calculateRepositoryComplexity(
      totalLinesAdded + totalLinesDeleted,
      mockCommits.length,
      3, // languages count
      mockRepoMetadata.starsCount
    );

    // 3. AI Code quality audit simulation or call
    let aiAudit = {
      readabilityScore: 88,
      modularityScore: 92,
      securityScore: 85,
      summary: 'Clean architecture utilizing monorepo configurations, modular NestJS dependencies, and isolated database schemas.',
      vulnerabilities: ['Potential exposure of secret keys in client side configuration templates'],
      improvements: ['Implement custom JWT strategies with short-lived tokens', 'Extract environment configurations into strict validations']
    };

    if (this.gemini) {
      try {
        const model = this.gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `Analyze the repository named "${repoName}" which runs on "${mockRepoMetadata.primaryLanguage}". 
        It has ${mockCommits.length} commits. The developer summary is: ${mockRepoMetadata.description}. 
        Evaluate code quality on a scale of 0-100 for readability, modularity, and security. Return a JSON structure exactly matching:
        {"readability": 90, "modularity": 85, "security": 80, "summary": "...", "vulnerabilities": ["..."], "improvements": ["..."]}`;
        
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(jsonText);
        
        aiAudit = {
          readabilityScore: parsed.readability || 88,
          modularityScore: parsed.modularity || 90,
          securityScore: parsed.security || 85,
          summary: parsed.summary || aiAudit.summary,
          vulnerabilities: parsed.vulnerabilities || aiAudit.vulnerabilities,
          improvements: parsed.improvements || aiAudit.improvements
        };
      } catch (err) {
        this.logger.error('Failed to parse Gemini AI response, using defaults:', err.message);
      }
    }

    const report = {
      id: `repo_${mockRepoMetadata.id}`,
      metadata: mockRepoMetadata,
      complexityScore,
      userContributionScore: Math.round(totalContributionScore),
      linesContributed: totalLinesAdded,
      commitsCount: mockCommits.filter(c => c.authorName === 'Sanya Dev').length,
      commits: mockCommits,
      aiAudit,
      analyzedAt: new Date().toISOString()
    };

    this.mockRepoDb.set(report.id, report);
    return report;
  }

  async getRepositoryDetails(id: string) {
    if (this.mockRepoDb.has(id)) {
      return this.mockRepoDb.get(id);
    }
    return null;
  }

  async getAllRepositories() {
    return Array.from(this.mockRepoDb.values());
  }
}
