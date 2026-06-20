/**
 * Calculates the complexity of a repository based on lines of code,
 * file count, languages used, and repository stars count.
 */
export function calculateRepositoryComplexity(
  linesOfCode: number,
  filesCount: number,
  languagesCount: number,
  starsCount: number
): number {
  if (linesOfCode <= 0) return 0;
  
  // RCS = min(100, log2(Lines) * 10 + Files * 0.2 + Languages * 5 + Stars * 0.5)
  const locTerm = Math.log2(linesOfCode) * 10;
  const filesTerm = filesCount * 0.2;
  const langTerm = languagesCount * 5;
  const starsTerm = starsCount * 0.5;

  const score = locTerm + filesTerm + langTerm + starsTerm;
  return Math.min(100, Math.max(0, Math.round(score)));
}

/**
 * Assesses the quality multiplier based on commit message length and patterns.
 */
export function assessCommitMsgQuality(message: string): number {
  const msg = message.trim().toLowerCase();
  
  if (msg.length < 10) return 0.5;
  
  // Flag generic messages
  const genericPatterns = [
    /^fix\b/, /^test\b/, /^update\b/, /^wip\b/, /^work\b/, /^temp\b/,
    /^draft\b/, /^clean\b/, /^refactor\b/, /^dummy\b/, /^commit\b/,
    /^add\b/, /^change\b/
  ];
  
  const isGeneric = genericPatterns.some(pattern => pattern.test(msg));
  if (isGeneric && msg.length < 20) {
    return 0.5;
  }

  // Check for issue/ticket references (e.g., #12, GH-34, PROJ-123)
  const ticketPattern = /(?:#\d+|\b[A-Z]+-\d+\b)/;
  if (ticketPattern.test(message)) {
    return 1.2;
  }

  return 1.0;
}

/**
 * Calculates user contribution score for a single commit.
 */
export function calculateCommitContributionScore(
  additions: number,
  deletions: number,
  message: string,
  isVendorModified: boolean
): number {
  if (isVendorModified) {
    return 0; // Skip third-party libraries and lockfiles additions
  }

  const qualityFactor = assessCommitMsgQuality(message);
  
  // CS(c) = log1.2(1 + additions + deletions * 0.5) * qualityFactor
  const rawVolume = 1 + additions + (deletions * 0.5);
  const logVolume = Math.log(rawVolume) / Math.log(1.2); // log base 1.2
  
  return parseFloat((logVolume * qualityFactor).toFixed(2));
}
