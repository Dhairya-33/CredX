/**
 * AI Trust Scoring Engine
 * Analyzes credentials to detect fraud patterns and calculate a dynamic trust score (0-100).
 */

class TrustEngine {
  constructor() {
    this.issuerReputation = {
      "0xIssuerAlpha": 90,
      "0xIssuerBeta": 85,
    };
  }

  /**
   * Calculate trust score for a wallet
   * @param {Array} credentials List of credentials for the user
   * @param {string} walletAddress The user's wallet address
   */
  calculateScore(credentials, walletAddress) {
    if (!credentials || credentials.length === 0) return { score: 10, verdict: 'NEW_USER', flags: [] };

    let score = 50; // Starting baseline
    const flags = [];

    // 1. Issuer Credibility (30%)
    let issuerWeight = 0;
    credentials.forEach(c => {
      const rep = this.issuerReputation[c.issuer] || 50;
      issuerWeight += rep;
    });
    const avgIssuerRep = issuerWeight / credentials.length;
    score += (avgIssuerRep - 50) * 0.6; // Adjust score based on issuer rep

    // 2. Anomaly Detection: Duplicate Certificates
    const uniqueCIDs = new Set(credentials.map(c => c.ipfsCID));
    if (uniqueCIDs.size < credentials.length) {
      score -= 30;
      flags.push('DUPLICATE_CERTIFICATES_DETECTED');
    }

    // 3. Anomaly Detection: Unrealistic Timelines
    // If user got 10 certificates in 1 day from different issuers
    const timestamps = credentials.map(c => new Date(c.issueDate).getTime());
    const minTime = Math.min(...timestamps);
    const maxTime = Math.max(...timestamps);
    if (credentials.length > 5 && (maxTime - minTime) < (24 * 60 * 60 * 1000)) {
      score -= 40;
      flags.push('UNREALISTIC_ISSUANCE_TIMELINE');
    }

    // 4. Activity Consistency
    if (credentials.length > 10) score += 10;
    
    // Bounds check
    score = Math.max(0, Math.min(100, Math.round(score)));

    let verdict = 'TRUSTED';
    if (score > 85) verdict = 'HIGHLY_TRUSTED';
    else if (score < 40) verdict = 'SUSPICIOUS';
    else if (score < 20) verdict = 'HIGH_RISK';

    return {
      score,
      verdict,
      flags,
      historyLength: credentials.length
    };
  }

  detectFraud(credentialData) {
    const findings = [];
    if (credentialData.AI_trust_score < 30) findings.push("Low historical trust score for issuer/recipient combination");
    if (credentialData.anomaly_flag) findings.push("Structural metadata anomaly detected");
    
    return {
      isSuspicious: findings.length > 0,
      findings
    };
  }
}

module.exports = new TrustEngine();
