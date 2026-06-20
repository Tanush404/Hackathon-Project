import { Injectable, Logger } from '@nestjs/common';
import { GithubApiService } from './github-api.service';

export interface ExtractedSkill {
  name: string;
  category: 'Language' | 'Frontend' | 'Backend' | 'Database' | 'Cloud & DevOps' | string;
  confidence: number;
  linesWritten: number;
  projectsCount: number;
}

@Injectable()
export class SkillExtractorService {
  private readonly logger = new Logger(SkillExtractorService.name);

  constructor(private readonly githubApiService: GithubApiService) {}

  async extractSkills(username: string, repos: any[]): Promise<ExtractedSkill[]> {
    this.logger.log(`Extracting skills for user ${username} from ${repos.length} repositories`);
    const skillMap = new Map<string, ExtractedSkill>();

    for (const repo of repos) {
      try {
        const repoName = repo.name;
        this.logger.log(`Scanning repository: ${repoName}`);

        // 1. Fetch language statistics
        const languages = await this.githubApiService.getRepositoryLanguages(username, repoName);
        const totalLanguageLoc = Object.values(languages).reduce((sum, val) => sum + val, 0);

        // 2. Fetch root directory contents
        const contents = await this.githubApiService.getRepositoryContents(username, repoName, '');
        const fileNames = contents.map(c => c.name.toLowerCase());
        const hasFile = (name: string) => fileNames.includes(name.toLowerCase());
        const hasFilePattern = (pattern: RegExp) => contents.some(c => pattern.test(c.name));

        // 3. Fetch package.json if it exists
        let packageJson: any = null;
        if (hasFile('package.json')) {
          const text = await this.githubApiService.getFileContent(username, repoName, 'package.json');
          if (text) {
            try {
              packageJson = JSON.parse(text);
            } catch (e) {
              this.logger.warn(`Failed to parse package.json for ${repoName}: ${e.message}`);
            }
          }
        }

        // 4. Fetch requirements.txt if it exists
        let requirementsText = '';
        if (hasFile('requirements.txt')) {
          const text = await this.githubApiService.getFileContent(username, repoName, 'requirements.txt');
          if (text) {
            requirementsText = text;
          }
        }

        // Helper check functions
        const hasNpmDep = (dep: string) => {
          if (!packageJson) return false;
          const deps = packageJson.dependencies || {};
          const devDeps = packageJson.devDependencies || {};
          return !!(deps[dep] || devDeps[dep]);
        };

        const hasPyDep = (dep: string) => {
          if (!requirementsText) return false;
          return requirementsText.toLowerCase().includes(dep.toLowerCase());
        };

        const hasTopic = (topic: string) => {
          const topics = repo.topics || [];
          return topics.some((t: string) => t.toLowerCase() === topic.toLowerCase());
        };

        const hasKeyword = (keyword: string) => {
          const desc = repo.description || '';
          const name = repo.name || '';
          return desc.toLowerCase().includes(keyword.toLowerCase()) || name.toLowerCase().includes(keyword.toLowerCase());
        };

        // --- SKILL DETECTION ---

        // 1. Programming Languages
        const targetLanguages = [
          { name: 'Java', keys: ['java'], ext: ['.java'], files: ['pom.xml', 'build.gradle'] },
          { name: 'Python', keys: ['python'], ext: ['.py'], files: ['requirements.txt', 'pipfile', 'pyproject.toml'] },
          { name: 'C++', keys: ['c++', 'cpp', 'c'], ext: ['.cpp', '.cc', '.cxx', '.h', '.hpp'], files: [] },
          { name: 'JavaScript', keys: ['javascript'], ext: ['.js', '.mjs', '.cjs'], files: ['package.json'] },
          { name: 'TypeScript', keys: ['typescript'], ext: ['.ts', '.tsx'], files: ['tsconfig.json'] },
          { name: 'Go', keys: ['go'], ext: ['.go'], files: ['go.mod'] },
          { name: 'Rust', keys: ['rust'], ext: ['.rs'], files: ['cargo.toml'] },
          { name: 'PHP', keys: ['php'], ext: ['.php'], files: ['composer.json'] },
          { name: 'Kotlin', keys: ['kotlin'], ext: ['.kt', '.kts'], files: [] }
        ];

        for (const lang of targetLanguages) {
          let detected = false;
          let loc = 0;
          let locPercent = 0;

          // Check language stats API
          const matchedKey = Object.keys(languages).find(key => 
            lang.keys.includes(key.toLowerCase())
          );
          if (matchedKey) {
            detected = true;
            loc = languages[matchedKey];
            locPercent = totalLanguageLoc > 0 ? (loc / totalLanguageLoc) * 100 : 0;
          }

          // Check primary language
          const primaryMatches = repo.language && lang.keys.includes(repo.language.toLowerCase());

          // Check files/extensions
          const extMatches = lang.ext.some(ext => hasFilePattern(new RegExp(`\\${ext}$`, 'i')));
          const fileMatches = lang.files.some(file => hasFile(file));

          if (detected || primaryMatches || extMatches || fileMatches) {
            let confidence = 70;
            if (locPercent > 50) {
              confidence += 15;
            } else if (locPercent > 10) {
              confidence += 10;
            }
            if (primaryMatches) {
              confidence += 10;
            }
            if (hasTopic(lang.name)) {
              confidence += 5;
            }
            if (repo.stars > 10) {
              confidence += 5;
            }
            confidence = Math.min(98, confidence);

            // Lines written attribution
            const lines = loc > 0 ? loc : (primaryMatches ? 5000 : 1000);

            this.addOrMergeSkill(skillMap, {
              name: lang.name,
              category: 'Language',
              confidence,
              linesWritten: lines,
              projectsCount: 1
            });
          }
        }

        // 2. Frameworks - Frontend
        const frontendFrameworks = [
          { name: 'React', deps: ['react', 'react-dom'], topics: ['react', 'reactjs'] },
          { name: 'Next.js', deps: ['next'], topics: ['nextjs', 'next.js'] },
          { name: 'Angular', deps: ['@angular/core'], topics: ['angular', 'angularjs'] },
          { name: 'Vue', deps: ['vue'], topics: ['vue', 'vuejs'] }
        ];

        for (const framework of frontendFrameworks) {
          const inDeps = framework.deps.some(dep => hasNpmDep(dep));
          const hasTopics = framework.topics.some(topic => hasTopic(topic) || hasKeyword(topic));

          if (inDeps || hasTopics) {
            let confidence = inDeps ? 80 : 50;
            const primaryIsJSOrTS = repo.language && ['typescript', 'javascript'].includes(repo.language.toLowerCase());
            if (inDeps && primaryIsJSOrTS) {
              confidence += 10;
            }
            if (repo.stars > 10) {
              confidence += 5;
            }
            confidence = Math.min(98, confidence);

            // Estimate lines from repository main language or total complexity
            const lines = totalLanguageLoc > 0 ? Math.round(totalLanguageLoc * 0.4) : 4000;

            this.addOrMergeSkill(skillMap, {
              name: framework.name,
              category: 'Frontend',
              confidence,
              linesWritten: lines,
              projectsCount: 1
            });
          }
        }

        // 3. Frameworks - Backend
        const backendFrameworks = [
          { name: 'Express', npmDeps: ['express'], pyDeps: [], topics: ['express', 'expressjs'] },
          { name: 'NestJS', npmDeps: ['@nestjs/core', '@nestjs/common'], pyDeps: [], topics: ['nestjs'] },
          { name: 'Spring Boot', npmDeps: [], pyDeps: [], topics: ['spring-boot', 'spring'], files: ['pom.xml', 'build.gradle'], keyword: 'spring-boot' },
          { name: 'Django', npmDeps: [], pyDeps: ['django'], topics: ['django'] },
          { name: 'Flask', npmDeps: [], pyDeps: ['flask'], topics: ['flask'] },
          { name: 'FastAPI', npmDeps: [], pyDeps: ['fastapi'], topics: ['fastapi'] }
        ];

        for (const framework of backendFrameworks) {
          const inNpmDeps = framework.npmDeps.some(dep => hasNpmDep(dep));
          const inPyDeps = framework.pyDeps.some(dep => hasPyDep(dep));
          const hasTopics = framework.topics.some(topic => hasTopic(topic) || hasKeyword(topic));
          const hasFiles = framework.files ? framework.files.some(file => hasFile(file)) : false;
          const matchesKeyword = framework.keyword ? hasKeyword(framework.keyword) : false;

          if (inNpmDeps || inPyDeps || hasTopics || hasFiles || matchesKeyword) {
            let confidence = (inNpmDeps || inPyDeps || hasFiles) ? 80 : 50;
            
            // Check primary language alignment
            const primaryLang = repo.language ? repo.language.toLowerCase() : '';
            if (primaryLang) {
              if ((inNpmDeps && ['typescript', 'javascript'].includes(primaryLang)) ||
                  (inPyDeps && primaryLang === 'python') ||
                  (hasFiles && primaryLang === 'java')) {
                confidence += 10;
              }
            }
            if (repo.stars > 10) {
              confidence += 5;
            }
            confidence = Math.min(98, confidence);

            const lines = totalLanguageLoc > 0 ? Math.round(totalLanguageLoc * 0.3) : 3000;

            this.addOrMergeSkill(skillMap, {
              name: framework.name,
              category: 'Backend',
              confidence,
              linesWritten: lines,
              projectsCount: 1
            });
          }
        }

        // 4. Databases
        const targetDatabases = [
          { name: 'PostgreSQL', npmDeps: ['pg', 'pg-promise'], pyDeps: ['psycopg2', 'psycopg'], topics: ['postgresql', 'postgres', 'pg'] },
          { name: 'MySQL', npmDeps: ['mysql', 'mysql2'], pyDeps: ['pymysql', 'mysql-connector'], topics: ['mysql'] },
          { name: 'MongoDB', npmDeps: ['mongodb', 'mongoose'], pyDeps: ['pymongo'], topics: ['mongodb', 'mongo'] },
          { name: 'Redis', npmDeps: ['redis', 'ioredis'], pyDeps: ['redis'], topics: ['redis'] },
          { name: 'Firebase', npmDeps: ['firebase', 'firebase-admin'], pyDeps: ['firebase-admin'], topics: ['firebase'] },
          { name: 'Supabase', npmDeps: ['@supabase/supabase-js'], pyDeps: ['supabase'], topics: ['supabase'] }
        ];

        for (const db of targetDatabases) {
          const inNpmDeps = db.npmDeps.some(dep => hasNpmDep(dep));
          const inPyDeps = db.pyDeps.some(dep => hasPyDep(dep));
          const hasTopics = db.topics.some(topic => hasTopic(topic) || hasKeyword(topic));

          if (inNpmDeps || inPyDeps || hasTopics) {
            let confidence = (inNpmDeps || inPyDeps) ? 85 : 55;
            if (repo.stars > 10) {
              confidence += 5;
            }
            confidence = Math.min(98, confidence);

            const lines = totalLanguageLoc > 0 ? Math.round(totalLanguageLoc * 0.15) : 1500;

            this.addOrMergeSkill(skillMap, {
              name: db.name,
              category: 'Database',
              confidence,
              linesWritten: lines,
              projectsCount: 1
            });
          }
        }

        // 5. Cloud & DevOps
        const devopsTools = [
          { name: 'Docker', files: ['dockerfile', 'docker-compose.yml', 'docker-compose.yaml'], npmDeps: [], topics: ['docker', 'docker-compose'] },
          { name: 'Kubernetes', files: ['k8s', 'kubernetes'], npmDeps: [], topics: ['kubernetes', 'k8s'], isFolder: true },
          { name: 'AWS', files: [], npmDeps: ['aws-sdk', '@aws-sdk/client-s3'], topics: ['aws', 'amazon-web-services'], keyword: 'amplify' },
          { name: 'Azure', files: [], npmDeps: ['@azure/storage-blob'], topics: ['azure', 'microsoft-azure'] },
          { name: 'GCP', files: [], npmDeps: ['@google-cloud/storage'], topics: ['gcp', 'google-cloud'] },
          { name: 'Terraform', files: ['infra.tf', 'main.tf'], npmDeps: [], ext: ['.tf', '.tfvars'], topics: ['terraform', 'iac'] },
          { name: 'GitHub Actions', files: ['.github/workflows'], npmDeps: [], topics: ['github-actions', 'ci-cd'], isFolder: true }
        ];

        for (const tool of devopsTools) {
          const hasFiles = tool.files.some(file => {
            if (tool.isFolder) {
              // check if any content file path contains/starts with it
              return contents.some(c => c.path.toLowerCase().includes(file.toLowerCase())) ||
                     hasFile(file);
            }
            return hasFile(file);
          });
          const inNpmDeps = tool.npmDeps ? tool.npmDeps.some(dep => hasNpmDep(dep)) : false;
          const hasTopics = tool.topics.some(topic => hasTopic(topic) || hasKeyword(topic));
          const matchesExt = tool.ext ? tool.ext.some(ext => hasFilePattern(new RegExp(`\\${ext}$`, 'i'))) : false;
          const matchesKeyword = tool.keyword ? hasKeyword(tool.keyword) : false;

          if (hasFiles || inNpmDeps || hasTopics || matchesExt || matchesKeyword) {
            let confidence = (hasFiles || inNpmDeps || matchesExt) ? 85 : 55;
            if (repo.stars > 10) {
              confidence += 5;
            }
            confidence = Math.min(98, confidence);

            const lines = totalLanguageLoc > 0 ? Math.round(totalLanguageLoc * 0.1) : 1000;

            this.addOrMergeSkill(skillMap, {
              name: tool.name,
              category: 'Cloud & DevOps',
              confidence,
              linesWritten: lines,
              projectsCount: 1
            });
          }
        }

      } catch (err) {
        this.logger.error(`Error processing repository ${repo.name} for skill extraction: ${err.message}`);
      }
    }

    // Convert map to sorted array
    const sortedSkills = Array.from(skillMap.values()).sort((a, b) => b.confidence - a.confidence);

    this.logger.log(`Successfully extracted ${sortedSkills.length} unique skills for user ${username}`);
    return sortedSkills;
  }

  private addOrMergeSkill(map: Map<string, ExtractedSkill>, skill: ExtractedSkill) {
    const existing = map.get(skill.name);
    if (existing) {
      // Merge logic:
      // Max confidence across repositories + usage boost (e.g. +3% for each additional repository)
      const mergedConfidence = Math.min(100, Math.max(existing.confidence, skill.confidence) + 3);
      existing.confidence = mergedConfidence;
      existing.linesWritten += skill.linesWritten;
      existing.projectsCount += 1;
    } else {
      map.set(skill.name, skill);
    }
  }
}
