export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  skills: UserSkillDto[];
  verifiedDeployments: VerifiedDeploymentDto[];
  achievements: AchievementDto[];
}

export interface UserSkillDto {
  name: string;
  category: 'language' | 'framework' | 'database' | 'devops';
  proficiencyScore: number;
  linesWritten: number;
  projectsCount: number;
}

export interface VerifiedDeploymentDto {
  id: string;
  url: string;
  provider: string;
  uptimePercentage: number;
  lastVerifiedAt: string | null;
  reports: VerificationReportDto[];
}

export interface VerificationReportDto {
  id: string;
  status: 'healthy' | 'degraded' | 'offline';
  sslValid: boolean;
  sslIssuer: string | null;
  sslExpiresAt: string | null;
  responseTimeMs: number;
  lighthousePerfScore: number;
  screenshotUrl: string | null;
  consoleErrors: any;
  ledgerSignature: string | null;
  createdAt: string;
}

export interface AchievementDto {
  id: string;
  title: string;
  description: string;
  badgeIconUrl: string;
  criteriaType: string;
  unlockedAt: string;
}

export interface AnalyzeRepositoryRequest {
  repositoryName: string;
  owner: string;
}

export interface VerifyDeploymentRequest {
  repositoryId: string;
  url: string;
}
