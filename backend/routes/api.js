// backend/routes/api.js
const express = require('express');
const router = express.Router();
const trustEngine = require('../ai/trustEngine');
const { uploadToIPFS, uploadFileToIPFS } = require('../services/ipfsService');
const { mintCert, getCerts } = require('../services/blockchainService');

/**
 * @route POST /api/issue-certificate
 * @desc Issue a new certificate, store on IPFS, and mint SBT
 */
router.post('/issue-certificate', async (req, res) => {
  try {
    const { name, wallet, course, grade, date, imageData } = req.body;
    console.log(`[API] Issuing visual certificate for ${name} to wallet ${wallet}...`);
    
    let certificateCID;

    if (imageData) {
        // Handle Base64 Image
        const buffer = Buffer.from(imageData.split(',')[1], 'base64');
        const fileName = `Certificate-${name.replace(/\s+/g, '_')}-${Date.now()}.png`;
        certificateCID = await uploadFileToIPFS(buffer, fileName);
    } else {
        // Fallback to JSON if no image provided
        const metadata = {
            studentName: name,
            walletAddress: wallet,
            courseName: course,
            grade,
            issueDate: date || new Date().toISOString(),
            issuer: "TrustChainX Authority",
            description: "Official Academic Certificate issued on TrustChainX Blockchain"
        };
        certificateCID = await uploadToIPFS(metadata);
    }

    // 3. Mint SBT on Blockchain with the Image CID
    const txHash = await mintCert(wallet, certificateCID, name, course);

    res.json({
      success: true,
      ipfsCID: certificateCID,
      txHash,
      message: "Visual certificate issued and recorded on blockchain."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/certificates/:wallet
 * @desc Fetch all certificates linked to a wallet
 */
router.get('/certificates/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const certs = await getCerts(wallet);
    
    // Add AI Trust Score for each/all
    const analysis = trustEngine.calculateScore(certs, wallet);

    res.json({
      wallet,
      certificates: certs,
      analysis
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/verify/:wallet
 * @desc Return verification status + trust score
 */
router.get('/verify/:wallet', async (req, res) => {
  try {
    const { wallet } = req.params;
    const certs = await getCerts(wallet);
    const analysis = trustEngine.calculateScore(certs, wallet);

    res.json({
      wallet,
      isVerified: certs.length > 0,
      trustScore: analysis.score,
      verdict: analysis.verdict,
      certificateCount: certs.length,
      lastVerified: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
