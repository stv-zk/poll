const { ethers } = require("hardhat");

async function main() {
  // Deploy ElectoralZkSetup contract
  const ElectoralZkSetup = await ethers.getContractFactory("ElectoralZkSetup");
  const electoralZkSetup = await ElectoralZkSetup.deploy();
  await electoralZkSetup.deployed();
  console.log("ElectoralZkSetup deployed to:", electoralZkSetup.address);

  // Deploy VoterRegistration contract
  const VoterRegistration = await ethers.getContractFactory("VoterRegistration");
  const voterRegistration = await VoterRegistration.deploy();
  await voterRegistration.deployed();
  console.log("VoterRegistration deployed to:", voterRegistration.address);

  // Deploy BallotBox contract with references to VoterRegistration and ElectoralZkSetup
  const BallotBox = await ethers.getContractFactory("BallotBox");
  const ballotBox = await BallotBox.deploy(
    voterRegistration.address, // Voter registration contract address
    electoralZkSetup.address,  // ZK setup contract address
    Math.floor(Date.now() / 1000), // Election start time (current time)
    Math.floor(Date.now() / 1000) + 86400 // Election end time (24 hours later)
  );
  await ballotBox.deployed();
  console.log("BallotBox deployed to:", ballotBox.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});