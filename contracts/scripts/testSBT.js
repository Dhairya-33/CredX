// contracts/scripts/testSBT.js
import hre from "hardhat";

async function main() {
  const [deployer, otherAccount] = await hre.ethers.getSigners();
  
  const VeriCertSBT = await hre.ethers.getContractFactory("VeriCertSBT");
  const sbt = await VeriCertSBT.deploy();
  await sbt.waitForDeployment();
  const address = await sbt.getAddress();
  console.log("Deployed VeriCertSBT to:", address);

  // Mint to deployer
  console.log("Minting to deployer...");
  await sbt.mintCertificate(deployer.address, "QmCID123", "John Doe", "Web3 Engineering");
  
  console.log("Attempting to transfer (should fail)...");
  try {
    await sbt.transferFrom(deployer.address, otherAccount.address, 1);
    console.log("FAIL: Transfer succeeded?!");
  } catch (e) {
    console.log("SUCCESS: Transfer failed as expected (Soulbound).");
  }

  // Attempt to approve
  console.log("Attempting to approve (should fail)...");
  try {
    const success = await sbt.approve(otherAccount.address, 1);
    console.log("FAIL: Approve succeeded?", success);
  } catch (e) {
    console.log("SUCCESS: Approve failed as expected (Soulbound).");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
