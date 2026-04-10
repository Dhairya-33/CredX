// backend/routes/api.js
const express = require('express');
const router = express.Router();
const trustEngine = require('../ai/trustEngine');
const { mockIpfs, mockBlockchain } = require('../services/mockServices');

/**
 * @route POST /api/issueCredential
 * @desc Issue a new credential, store on IPFS, and mint SBT
 */
router.post('/issueCredential', async (req, res) => {
  try {
    const { name, wallet, course, issuer, grade, category } = req.body;
    
    // 1. Prepare metadata
    const metadata = {
      name,
      wallet,
      course,
      issuer,
      issueDate: new Date().toISOString(),
      grade,
      credentialType: 'Certification',
      category: category || 'Skill',
      history_log: [`Issued by ${issuer} on ${new Date().toLocaleDateString()}`]
    };

    // 2. Upload to IPFS (Mock)
    const ipfsCID = await mockIpfs.upload(metadata);

    // 3. Mint SBT on Blockchain (Mock)
    const txHash = await mockBlockchain.mint(wallet, ipfsCID, metadata.credentialType, metadata.category);

    res.json({
      success: true,
      ipfsCID,
      txHash,
      message: "Credential issued successfully on-chain."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/getTrustScore/:address
 * @desc Calculate and return the trust score for a specific wallet
 */
router.get('/getTrustScore/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Fetch user credentials from blockchain (Mock)
    const credentials = await mockBlockchain.getCredentials(address);
    
    // Calculate score using AI engine
    const analysis = trustEngine.calculateScore(credentials, address);

    res.json({
      address,
      ...analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/verifyWallet/:address
 * @desc Get all credentials and AI verdict for a wallet
 */
router.get('/verifyWallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const credentials = await mockBlockchain.getCredentials(address);
    const analysis = trustEngine.calculateScore(credentials, address);

    res.json({
      address,
      credentials,
      analysis,
      verifiedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/detectFraud
 * @desc Check specific credential data for anomalies
 */
router.post('/detectFraud', (req, res) => {
  const result = trustEngine.detectFraud(req.body);
  res.json(result);
});

module.exports = router;
