// backend/services/ipfsService.js
const axios = require('axios');
require('dotenv').config();

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

const uploadToIPFS = async (metadata) => {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
            console.warn("Pinata API keys missing, using mock CID");
            return `mock-cid-${Date.now()}`;
        }

        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        const response = await axios.post(url, {
            pinataContent: metadata,
            pinataMetadata: {
                name: `Cert-${metadata.studentName}-${Date.now()}`
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });

        console.log(`[IPFS] Successfully uploaded. CID: ${response.data.IpfsHash}`);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to IPFS:", error.response ? error.response.data : error.message);
        throw new Error("IPFS Upload Failed");
    }
};

module.exports = { uploadToIPFS };
