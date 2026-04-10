// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying VeriCertSBT with the account:", deployer.address);

  const VeriCertSBT = await hre.ethers.getContractFactory("VeriCertSBT");
  const sbt = await VeriCertSBT.deploy();

  await sbt.waitForDeployment();

  console.log("VeriCertSBT deployed to:", await sbt.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
