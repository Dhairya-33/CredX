# VeriCertX: Blockchain-Based Certificate Verification Platform

VeriCertX is a Soulbound Token (SBT) and IPFS-powered platform designed to eliminate fake credentials through immutable, decentralized verification.

---

## 🚀 Running the Project

Follow these steps to launch the platform locally:

### 1. Backend API
1. Open a terminal and navigate to the backend:  
   `cd backend`
2. Install dependencies:  
   `npm install`
3. (Optional) Create a `.env` file with your `PINATA_API_KEY`, `PINATA_SECRET_KEY`, and `PRIVATE_KEY` for real blockchain/IPFS usage.
4. Start the server:  
   `node server.js`  
   *The API will be live at `http://localhost:5000`*

### 2. Frontend (Vite)
1. Open a new terminal and navigate to the frontend:  
   `cd frontend`
2. Install dependencies:  
   `npm install`
3. Start the development server:  
   `npm run dev`  
   *Visit the app at `http://localhost:5173`*

---

## 🧪 Testing Walkthrough

Follow this flow to test all features of the VeriCertX MVP:

### Step 1: Issue a Certificate (Admin Flow)
1. In the app, click the **"Authority Port"** tab in the navigation.
2. Fill out the form with:
   - **Student Full Name**: E.g., "John Smith"
   - **Wallet Address**: Use `0xdemo` for easy testing, or any valid Ethereum address.
   - **Course Name**: E.g., "Advanced Blockchain Engineering"
   - **Grade**: E.g., "A+"
3. Click **"Issue Certificate"**.
   - You will see a loading animation while the certificate is uploaded to IPFS and minted on the blockchain.
   - A success message will appear with a Transaction Hash snippet.

### Step 2: View Your Vault (User Flow)
1. Click the **"Trust Profile"** tab.
2. If you issued to `0xdemo`, the dashboard will automatically fetch your new certificate.
3. Observe the **interactive NFT Card**:
   - Locate the **"Verified on Blockchain"** badge.
   - Scan the **QR Code** with your phone (links to the IPFS metadata).
   - Check the **Activity Log** on the right for the minting event.

### Step 3: Verify Publicly (Recruiter Flow)
1. Click the **"Identity Audit"** tab.
2. Enter the wallet address you used (e.g., `0xdemo`).
3. Click **"Verify Certs"**.
4. The **AI Trust Meter** will calculate a score based on the certificates found.
5. Review the list of verified units to ensure they match the student's claims.

---

## 🛠️ Technology Stack
- **Blockchain**: Solidity, Soulbound Tokens (ERC-721 based), Hardhat.
- **Backend**: Node.js, Express, Ethers.js, IPFS (Pinata).
- **Frontend**: React, Vite, Framer Motion, QR Code SVG.
- **AI**: Custom heuristic Trust Engine for fraud detection.

---
Built for the future of verifiable achievements. 🎓✨
