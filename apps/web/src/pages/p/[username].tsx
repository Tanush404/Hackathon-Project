import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  GitCommit, 
  Code2, 
  Layers, 
  Zap,
  Globe,
  Cpu,
  ExternalLink
} from 'lucide-react';

export default function PublicPortfolio() {
  const router = useRouter();
  const { username } = router.query;

  // Mock profile details matching credentials
  const profile = {
    username: username || 'sanyadev',
    displayName: 'Sanya Dev',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    bio: 'Full Stack Engineer focusing on performant APIs, secure ledger validation networks, and automated visual verification architectures.',
    globalScore: 92,
    skills: [
      { name: 'TypeScript', category: 'language', score: 90, linesWritten: 12400, projectsCount: 4 },
      { name: 'NodeJS', category: 'framework', score: 95, linesWritten: 18200, projectsCount: 6 },
      { name: 'React/Next.js', category: 'framework', score: 88, linesWritten: 9300, projectsCount: 3 },
      { name: 'PostgreSQL', category: 'database', score: 85, linesWritten: 4000, projectsCount: 5 }
    ],
    verifiedDeployments: [
      {
        id: 'dep_1',
        url: 'https://auth.sanyadev.net',
        provider: 'Vercel',
        uptimePercentage: 99.98,
        lastVerifiedAt: new Date().toLocaleDateString(),
        score: 95,
        ledgerSignature: 'sha256:8a7c29f8f7a6e5d4c3b2a101f2e3d4c5b6a78901'
      }
    ],
    achievements: [
      { id: 'ach_1', title: 'DevOps Master', description: 'Maintain verified deployment with >99.9% uptime score and correct SSL settings.', icon: '⚡' },
      { id: 'ach_2', title: 'Commit Marathoner', description: 'Write more than 5,000 verified lines of code in active projects.', icon: '🏆' },
      { id: 'ach_3', title: 'Clean Coder', description: 'Receive an average AI code quality modularity score of >85%.', icon: '💎' }
    ]
  };

  return (
    <div style={{ padding: '60px 24px', maxWidth: '1000px', margin: '0 auto' }}>
      <Head>
        <title>{profile.displayName} (@{profile.username}) – Proof of Build</title>
      </Head>

      {/* Main Profile Header */}
      <div className="glass-card" style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '32px' }}>
        <img 
          src={profile.avatarUrl} 
          alt={profile.displayName} 
          style={{ width: '120px', height: '120px', borderRadius: '50%', border: '3px solid var(--primary)' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800 }}>{profile.displayName}</h2>
              <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem', marginTop: '4px' }}>@{profile.username}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="badge badge-score" style={{ padding: '8px 16px', fontSize: '0.95rem' }}>
                <ShieldCheck size={18} /> Verified Build Score: {profile.globalScore}/100
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: '12px', lineHeight: 1.6 }}>{profile.bio}</p>
        </div>
      </div>

      {/* Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '32px' }}>
        
        {/* Left Side: Skills & Badges */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Verified Skills */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Code2 style={{ color: 'var(--primary)' }} /> Verified Skill Metrics
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profile.skills.map((skill, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600 }}>{skill.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{skill.score}% proficiency</span>
                  </div>
                  {/* Progress Bar */}
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${skill.score}%`, 
                        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                        borderRadius: '4px'
                      }} 
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{skill.linesWritten.toLocaleString()} lines written</span>
                    <span>{skill.projectsCount} projects</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Badges */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Zap style={{ color: '#f59e0b' }} /> Verified Achievements
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {profile.achievements.map((ach) => (
                <div key={ach.id} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.75rem', background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '8px' }}>
                    {ach.icon}
                  </span>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{ach.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{ach.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Ledger / Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Proof Ledger Timeline */}
          <div className="glass-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Layers style={{ color: 'var(--secondary)' }} /> Verification Proof Ledger
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Event Card */}
              {profile.verifiedDeployments.map((dep) => (
                <div 
                  key={dep.id} 
                  style={{ 
                    border: '1px solid rgba(20, 184, 166, 0.2)', 
                    background: 'rgba(20, 184, 166, 0.02)', 
                    padding: '20px', 
                    borderRadius: '12px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Globe size={18} style={{ color: 'var(--secondary)' }} /> Live Deployment Verified
                    </h4>
                    <span className="badge badge-verified">
                      <CheckCircle size={12} /> {dep.uptimePercentage}% Uptime
                    </span>
                  </div>
                  
                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Target Endpoint:</span>
                    <a 
                      href={dep.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                    >
                      {dep.url} <ExternalLink size={12} />
                    </a>
                  </div>
                  
                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Audit Date:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{dep.lastVerifiedAt}</span>
                  </div>

                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Provider Host:</span>
                    <span style={{ color: 'var(--text-primary)' }}>{dep.provider}</span>
                  </div>

                  <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '16px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Cryptographic Proof Signature:</div>
                    <code style={{ fontSize: '0.75rem', color: 'var(--secondary)', wordBreak: 'break-all' }}>{dep.ledgerSignature}</code>
                  </div>
                </div>
              ))}

              {/* Event Card: Repo scanner */}
              <div 
                style={{ 
                  border: '1px solid rgba(99, 102, 241, 0.2)', 
                  background: 'rgba(99, 102, 241, 0.02)', 
                  padding: '20px', 
                  borderRadius: '12px' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <GitCommit size={18} style={{ color: 'var(--primary)' }} /> Repository Scanned
                  </h4>
                  <span className="badge badge-score">Complexity: 82%</span>
                </div>
                
                <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Target Repo:</span>
                  <span style={{ color: 'var(--text-primary)' }}>sanyadev/fastify-auth-node</span>
                </div>

                <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Contributions:</span>
                  <span style={{ color: 'var(--text-primary)' }}>4,320 lines / 3 commits</span>
                </div>

                <div style={{ marginTop: '16px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', gap: '10px' }}>
                  <Cpu size={18} style={{ color: 'var(--primary)' }} />
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                    <strong>AI Auditor:</strong> Modular API integration code structures conforming to standard controller patterns. High readability score.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
