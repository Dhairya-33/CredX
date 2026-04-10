// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title TrustChainSBT
 * @dev ERC-721 Soulbound Token (non‑transferable) representing a credential.
 * Stores IPFS CID and metadata about the credential.
 * Multi‑issuer role system and on‑chain revocation via voting.
 */
contract TrustChainSBT is ERC721, AccessControl {
    uint256 private _tokenIdTracker;

    // Roles
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // Credential data
    struct Credential {
        string ipfsCID;          // IPFS metadata CID
        address issuer;          // Issuer address
        uint256 timestamp;       // Issue timestamp
        string credentialType;   // e.g. "Certification"
        string category;         // e.g. "Skill", "Achievement"
        bool revoked;            // Revocation flag
    }

    // tokenId => Credential
    mapping(uint256 => Credential) public credentials;

    // Revocation voting (simple quorum)
    struct RevocationProposal {
        uint256 tokenId;
        uint256 approvals;
        uint256 rejections;
        uint256 deadline; // block timestamp
        bool executed;
    }
    mapping(uint256 => mapping(address => bool)) public voted;
    mapping(uint256 => RevocationProposal) public revocationProposals;
    uint256 public constant QUORUM = 1; // Lowered for demo
    uint256 public constant VOTING_PERIOD = 3 days;

    // Events
    event CredentialIssued(uint256 indexed tokenId, address indexed to, string ipfsCID);
    event CredentialRevoked(uint256 indexed tokenId);
    event RevocationVoted(uint256 indexed tokenId, address indexed voter, bool approve);

    constructor() ERC721("TrustChain Credential", "TCC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // ----- Issuer Management -----
    function grantIssuer(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, account);
    }
    function revokeIssuer(address account) external onlyRole(ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, account);
    }

    // ----- Mint (issue) -----
    function issueCredential(address to, string memory ipfsCID, string memory credentialType, string memory category) external onlyRole(ISSUER_ROLE) returns (uint256) {
        _tokenIdTracker += 1;
        uint256 tokenId = _tokenIdTracker;
        _safeMint(to, tokenId);

        credentials[tokenId] = Credential({
            ipfsCID: ipfsCID,
            issuer: msg.sender,
            timestamp: block.timestamp,
            credentialType: credentialType,
            category: category,
            revoked: false
        });
        emit CredentialIssued(tokenId, to, ipfsCID);
        return tokenId;
    }

    // ----- Revocation -----
    function proposeRevocation(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        require(_exists(tokenId), "Token does not exist");
        RevocationProposal storage p = revocationProposals[tokenId];
        require(!p.executed, "Already executed");
        require(p.deadline == 0, "Proposal already exists");
        p.tokenId = tokenId;
        p.deadline = block.timestamp + VOTING_PERIOD;
    }

    function voteRevocation(uint256 tokenId, bool approve) external onlyRole(ISSUER_ROLE) {
        RevocationProposal storage p = revocationProposals[tokenId];
        require(p.deadline != 0, "No active proposal");
        require(block.timestamp <= p.deadline, "Voting period ended");
        require(!voted[tokenId][msg.sender], "Already voted");
        voted[tokenId][msg.sender] = true;
        if (approve) {
            p.approvals += 1;
        } else {
            p.rejections += 1;
        }
        emit RevocationVoted(tokenId, msg.sender, approve);
        // Auto‑execute if quorum reached
        if (p.approvals >= QUORUM) {
            _revoke(tokenId);
            p.executed = true;
        }
    }

    function _revoke(uint256 tokenId) internal {
        Credential storage cred = credentials[tokenId];
        cred.revoked = true;
        emit CredentialRevoked(tokenId);
    }

    // ----- Soulbound overrides -----
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal pure override {
        require(from == address(0), "SBT: Transfer disabled"); // only allow minting
        // Note: revocation does not transfer token, it just marks revoked
    }
    function approve(address to, uint256 tokenId) public pure override {
        revert("SBT: approve disabled");
    }
    function setApprovalForAll(address operator, bool approved) public pure override {
        revert("SBT: setApprovalForAll disabled");
    }
    function transferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("SBT: transfer disabled");
    }
    function safeTransferFrom(address from, address to, uint256 tokenId) public pure override {
        revert("SBT: safeTransfer disabled");
    }
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public pure override {
        revert("SBT: safeTransfer disabled");
    }
}
