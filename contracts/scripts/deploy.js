// scripts/deploy.js
require('dotenv').config();
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);
  const TrustChainSBT = await ethers.getContractFactory('TrustChainSBT');
  const sbt = await TrustChainSBT.deploy();
  await sbt.deployed();
  console.log('TrustChainSBT deployed to:', sbt.address);
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
