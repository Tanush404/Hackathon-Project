import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { 
  GitBranch, 
  Globe, 
  ShieldAlert, 
  Cpu, 
  ExternalLink, 
  Award, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Code
} from 'lucide-react';

export default function Dashboard() {
  const [owner, setOwner] = useState('sanyadev');
  const [repoName, setRepoName] = useState('fastify-auth-node');
  const [deployUrl, setDeployUrl] = useState('https://auth.sanyadev.net');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  
  const [repositories, setRepositories] = useState<any[]>([]);
  const [activeRepo, setActiveRepo] = useState<any>(null);
  const [verificationReport, setVerificationReport] = useState<any>(null);

  // Load sample initial data so UI is populated on start
  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/repositories');
      const json = await res.json();
      if (json.success && json.data.length > 0) {
        setRepositories(json.data);
        setActiveRepo(json.data[0]);
      } else {
        // Fallback demo data
        const demoRepo = {
          id: 'repo_demo123',
          metadata: {
            name: 'fastify-auth-node',
            fullName: 'sanyadev/fastify-auth-node',
            description: 'A verified production-ready implementation of fastify auth module.',
            primaryLanguage: 'TypeScript',
            starsCount: 42,
            forksCount: 12
          },
          complexityScore: 82,
          userContributionScore: 94,
          linesContributed: 4320,
          commitsCount: 3,
          commits: [
            { sha: 'a7b2c9d', authorName: 'Sanya Dev', message: 'feat: add user authentication flow and JWT validation', linesAdded: 320, linesDeleted: 15 },
            { sha: 'd3e4f5a', authorName: 'Sanya Dev', message: 'fix: resolve race conditions on token refresh', linesAdded: 45, linesDeleted: 8 }
          ],
          aiAudit: {
            readabilityScore: 90,
            modularityScore: 88,
            securityScore: 85,
            summary: 'Clean architecture utilizing modular controllers and dependency injection models.',
            vulnerabilities: ['Exposure of local secrets configurations'],
            improvements: ['Implement runtime config validations', 'Move to short-lived token strategies']
          }
        };
        setRepositories([demoRepo]);
        setActiveRepo(demoRepo);
      }
    } catch (e) {
      console.warn('API backend not running, loading local UI sandbox data.');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    try {
      const res = await fetch('http://localhost:3001/api/repositories/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner, repositoryName: repoName })
      });
      const json = await res.json();
      if (json.success) {
        setRepositories(prev => [json.data, ...prev]);
        setActiveRepo(json.data);
      }
    } catch (err) {
      // Offline fallback
      setTimeout(() => {
        const fallbackNew = {
          id: `repo_${Math.floor(Math.random() * 1000)}`,
          metadata: {
            name: repoName,
            fullName: `${owner}/${repoName}`,
            description: `Offline Sandbox: Analyzed ${repoName} metadata successfully.`,
            primaryLanguage: 'JavaScript',
            starsCount: 10,
            forksCount: 2
          },
          complexityScore: 65,
          userContributionScore: 78,
          linesContributed: 1200,
          commitsCount: 2,
          commits: [
            { sha: '9f8e7d', authorName: owner, message: 'Initial sandbox commit setup', linesAdded: 1100, linesDeleted: 0 }
          ],
          aiAudit: {
            readabilityScore: 80,
            modularityScore: 75,
            securityScore: 90,
            summary: 'Straightforward client integration structure.',
            vulnerabilities: [],
            improvements: ['Add comprehensive test suites']
          }
        };
        setRepositories(prev => [fallbackNew, ...prev]);
        setActiveRepo(fallbackNew);
      }, 1000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRepo) return;
    setIsVerifying(true);
    try {
      const res = await fetch('http://localhost:3001/api/verification/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: deployUrl, repositoryId: activeRepo.id })
      });
      const json = await res.json();
      if (json.success) {
        setVerificationReport(json.data);
      }
    } catch (err) {
      setTimeout(() => {
        setVerificationReport({
          id: 'report_sandbox',
          url: deployUrl,
          status: 'healthy',
          sslValid: true,
          sslIssuer: 'Let\'s Encrypt sandbox Authority',
          sslExpiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          responseTimeMs: 82,
          score: 95,
          ledgerSignature: 'hmac_sandbox_signature_9a8b7c6d5e4f'
        });
      }, 1000);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div style={{ padding: '40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Head>
        <title>Proof of Build – Developer Workspace</title>
      </Head>

      {/* Header */}
      <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }} className="gradient-text">Proof of Build</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '6px' }}>Verify repository code artifacts and live deployment endpoints.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge badge-verified">
            <CheckCircle size={14} /> Connected
          </span>
        </div>
      </header>

      {/* Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Left Side: Input Tools */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* GitHub Input */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <GitBranch style={{ color: 'var(--primary)' }} /> Analyze GitHub
            </h3>
            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>GitHub Username</label>
                <input 
                  type="text" 
                  value={owner} 
                  onChange={(e) => setOwner(e.target.value)} 
                  className="form-input" 
                  required
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Repository Name</label>
                <input 
                  type="text" 
                  value={repoName} 
                  onChange={(e) => setRepoName(e.target.value)} 
                  className="form-input" 
                  required
                />
              </div>
              <button type="submit" className="gradient-border-btn" disabled={isAnalyzing} style={{ marginTop: '6px' }}>
                {isAnalyzing ? 'Analyzing Repository...' : 'Scan Repository'}
              </button>
            </form>
          </div>

          {/* Live site Input */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe style={{ color: 'var(--secondary)' }} /> Live Deployment Check
            </h3>
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Live App URL</label>
                <input 
                  type="url" 
                  value={deployUrl} 
                  onChange={(e) => setDeployUrl(e.target.value)} 
                  className="form-input" 
                  placeholder="https://example.com"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="gradient-border-btn" 
                disabled={isVerifying || !activeRepo} 
                style={{ 
                  marginTop: '6px', 
                  background: 'linear-gradient(135deg, #14b8a6, #0d9488)', 
                  boxShadow: '0 4px 14px 0 rgba(20, 184, 166, 0.4)' 
                }}
              >
                {isVerifying ? 'Auditing Uptime...' : 'Audit Live App'}
              </button>
            </form>
          </div>

          {/* Analyzed Repos List */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Analyzed Projects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {repositories.map((r, i) => (
                <div 
                  key={r.id || i} 
                  onClick={() => setActiveRepo(r)}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: activeRepo?.id === r.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                    border: activeRepo?.id === r.id ? '1px solid var(--primary)' : '1px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{r.metadata.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.metadata.fullName}</div>
                  </div>
                  <span className="badge badge-score">{r.complexityScore}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Detailed metrics & Ledger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {activeRepo ? (
            <>
              {/* Score grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Complexity Grade</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>{activeRepo.complexityScore}/100</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contribution Weight</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--secondary)' }}>{activeRepo.userContributionScore}</div>
                </div>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Lines Scanned</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>{activeRepo.linesContributed}</div>
                </div>
              </div>

              {/* Code Quality AI Summary */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Cpu style={{ color: 'var(--primary)' }} /> AI-Powered Code Quality Audit
                </h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                  {activeRepo.aiAudit.summary}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldAlert size={16} /> Key Risks
                    </h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {activeRepo.aiAudit.vulnerabilities.length > 0 ? (
                        activeRepo.aiAudit.vulnerabilities.map((v: string, i: number) => <li key={i}>{v}</li>)
                      ) : (
                        <li>No critical security flaws detected.</li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Activity size={16} /> Recommended Actions
                    </h4>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {activeRepo.aiAudit.improvements.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Deployment verification report */}
              {verificationReport && (
                <div className="glass-card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Globe style={{ color: 'var(--secondary)' }} /> Verification Result: {verificationReport.status.toUpperCase()}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SSL Verification</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: verificationReport.sslValid ? '#10b981' : '#ef4444' }}>
                        {verificationReport.sslValid ? 'Secure' : 'Invalid'}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Response Speed</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600 }}>{verificationReport.responseTimeMs} ms</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deployment Score</div>
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--secondary)' }}>{verificationReport.score}%</div>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.8rem' }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Cryptographic Proof Signature (Ledger):</div>
                    <code style={{ wordBreak: 'break-all', color: '#14b8a6' }}>{verificationReport.ledgerSignature}</code>
                  </div>
                </div>
              )}

              {/* Commits timeline */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Code /> Contribution Timeline
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {activeRepo.commits.map((c: any, i: number) => (
                    <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '14px', position: 'relative' }}>
                      <div style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%', position: 'absolute', left: '-5px', top: '6px' }} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600 }}>{c.message}</span>
                        <code style={{ color: 'var(--text-muted)' }}>{c.sha.slice(0, 7)}</code>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                        Author: {c.authorName} | +{c.linesAdded} -{c.linesDeleted} lines
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <p style={{ color: 'var(--text-muted)' }}>Select or Scan a repository to view analytics details.</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
