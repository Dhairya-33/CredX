// backend/services/mockServices.js

/**
 * Mock IPFS service for pinata-less demo
 */
const mockIpfs = {
  upload: async (data) => {
    console.log("Mock IPFS Upload:", data);
    return `Qm${Math.random().toString(36).substring(2, 15)}`;
  }
};

/**
 * Mock Blockchain service for gas-less demo
 */
const mockBlockchain = {
  mint: async (to, cid, type, category) => {
    console.log(`Mock Minting for ${to}: ${cid}`);
    return `0x${Math.random().toString(16).substring(2, 66)}`;
  },
  getCredentials: async (address) => {
    // Return sample data for demo wallet
    if (address.toLowerCase() === '0xdemo') {
      return [
        { ipfsCID: 'Qm123', issuer: '0xIssuerAlpha', issueDate: '2025-01-01', type: 'Certification', category: 'Skill' },
        { ipfsCID: 'Qm456', issuer: '0xIssuerBeta', issueDate: '2025-02-15', type: 'Achievement', category: 'Project' }
      ];
    }
    return [];
  }
};

module.exports = { mockIpfs, mockBlockchain };
