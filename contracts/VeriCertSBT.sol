// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title VeriCertSBT
 * @dev ERC-721 Soulbound Token (non-transferable) representing a verifiable credential.
 * Transfers are disabled to ensure identity-linked permanence.
 */
contract VeriCertSBT is ERC721, AccessControl {
    uint256 private _tokenIdTracker;

    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Certificate {
        string ipfsCID;
        address issuer;
        uint256 issueDate;
        string courseName;
        string studentName;
        bool isValid;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public userCertificates;

    event CertificateIssued(uint256 indexed tokenId, address indexed student, string ipfsCID);
    event CertificateRevoked(uint256 indexed tokenId);

    constructor() ERC721("VeriCert Certificate", "VCRT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender); // Admin is also an issuer by default
    }

    function grantIssuer(address account) external onlyRole(ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, account);
    }

    function mintCertificate(
        address to, 
        string memory ipfsCID, 
        string memory studentName, 
        string memory courseName
    ) external onlyRole(ISSUER_ROLE) returns (uint256) {
        _tokenIdTracker += 1;
        uint256 tokenId = _tokenIdTracker;
        _safeMint(to, tokenId);

        certificates[tokenId] = Certificate({
            ipfsCID: ipfsCID,
            issuer: msg.sender,
            issueDate: block.timestamp,
            studentName: studentName,
            courseName: courseName,
            isValid: true
        });

        userCertificates[to].push(tokenId);
        
        emit CertificateIssued(tokenId, to, ipfsCID);
        return tokenId;
    }

    function getCertificatesByOwner(address owner) external view returns (uint256[] memory) {
        return userCertificates[owner];
    }

    function revokeCertificate(uint256 tokenId) external onlyRole(ADMIN_ROLE) {
        require(_exists(tokenId), "Non-existent token");
        certificates[tokenId].isValid = false;
        emit CertificateRevoked(tokenId);
    }

    // Soulbound Magic: Disable Transfers
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal pure override {
        require(from == address(0), "VeriCertX: Soulbound tokens cannot be transferred");
    }

    function approve(address to, uint256 tokenId) public pure override {
        revert("VeriCertX: Approvals disabled for SBT");
    }

    function setApprovalForAll(address operator, bool approved) public pure override {
        revert("VeriCertX: Approvals disabled for SBT");
    }
}
