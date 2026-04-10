// backend/services/blockchainService.js
const { ethers } = require('ethers');
require('dotenv').config();

const RPC_URL = process.env.RPC_URL || "https://rpc-amoy.polygon.technology";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
    "function mintCertificate(address to, string memory ipfsCID, string memory studentName, string memory courseName) external returns (uint256)",
    "function getCertificatesByOwner(address owner) external view returns (uint256[] memory)",
    "function certificates(uint256 tokenId) external view returns (string ipfsCID, address issuer, uint256 issueDate, string courseName, string studentName, bool isValid)"
];

const getContract = () => {
    if (!PRIVATE_KEY || !CONTRACT_ADDRESS) {
        console.warn("Blockchain config missing for real transactions. Returning mock interface.");
        return null;
    }
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    return new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
};

const mockCertStore = [
    {
        owner: "0xdemo",
        ipfsCID: "QmSampleEthersJS",
        issuer: "VeriCertX Academy",
        issueDate: "2025-01-15T10:00:00Z",
        courseName: "Full Stack Web3 Engineering",
        studentName: "Demo Student",
        isValid: true
    },
    {
        owner: "0xdemo",
        ipfsCID: "QmSampleSolidity",
        issuer: "Polygon Labs",
        issueDate: "2024-12-01T14:30:00Z",
        courseName: "SBT & Identity Protocols",
        studentName: "Demo Student",
        isValid: true
    }
];

const mintCert = async (to, cid, studentName, courseName) => {
    const contract = getContract();
    if (!contract) {
        const mockTx = `0x-mock-tx-${Date.now()}`;
        mockCertStore.push({
            owner: to,
            ipfsCID: cid,
            issuer: "0xIssuerAlpha",
            issueDate: new Date().toISOString(),
            courseName,
            studentName,
            isValid: true
        });
        return mockTx;
    }

    try {
        const tx = await contract.mintCertificate(to, cid, studentName, courseName);
        const receipt = await tx.wait();
        return receipt.hash;
    } catch (error) {
        console.error("Blockchain Minting Error:", error);
        throw error;
    }
};

const getCerts = async (owner) => {
    const contract = getContract();
    if (!contract) {
        return mockCertStore.filter(c => c.owner.toLowerCase() === owner.toLowerCase());
    }

    try {
        const tokenIds = await contract.getCertificatesByOwner(owner);
        const certs = await Promise.all(tokenIds.map(async (id) => {
            const data = await contract.certificates(id);
            return {
                tokenId: id.toString(),
                ipfsCID: data[0],
                issuer: data[1],
                issueDate: new Date(Number(data[2]) * 1000).toISOString(),
                courseName: data[3],
                studentName: data[4],
                isValid: data[5]
            };
        }));
        return certs;
    } catch (error) {
        console.error("Fetch Certificates Error:", error);
        return [];
    }
};

module.exports = { mintCert, getCerts };
