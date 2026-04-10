const axios = require('axios');
require('dotenv').config();
const FormData = require('form-data');
const { Readable } = require('stream');

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

const uploadToIPFS = async (metadata) => {
    // ... existing logic ...
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
            console.warn("Pinata API keys missing, using mock CID");
            return `mock-cid-${Date.now()}`;
        }

        const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        const response = await axios.post(url, {
            pinataContent: metadata,
            pinataMetadata: {
                name: `Cert-Metadata-${metadata.studentName}-${Date.now()}`
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });

        console.log(`[IPFS] Successfully uploaded JSON. CID: ${response.data.IpfsHash}`);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading to IPFS:", error.response ? error.response.data : error.message);
        throw new Error("IPFS Upload Failed");
    }
};

const uploadFileToIPFS = async (fileBuffer, fileName) => {
    try {
        if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
            console.warn("Pinata API keys missing, using mock File CID");
            return `mock-file-cid-${Date.now()}`;
        }

        const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
        
        const data = new FormData();
        const stream = Readable.from(fileBuffer);
        data.append('file', stream, { filename: fileName });
        
        const metadata = JSON.stringify({
            name: fileName,
        });
        data.append('pinataMetadata', metadata);

        const response = await axios.post(url, data, {
            maxBodyLength: 'Infinity',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });

        console.log(`[IPFS] Successfully uploaded File. CID: ${response.data.IpfsHash}`);
        return response.data.IpfsHash;
    } catch (error) {
        console.error("Error uploading file to IPFS:", error.response ? error.response.data : error.message);
        throw new Error("IPFS File Upload Failed");
    }
};

module.exports = { uploadToIPFS, uploadFileToIPFS };
