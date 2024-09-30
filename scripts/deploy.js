const { ethers } = require("hardhat");

async function main() {
  // Implantar o contrato ElectoralZkSetup
  const ElectoralZkSetup = await ethers.getContractFactory("ElectoralZkSetup");
  const electoralZkSetup = await ElectoralZkSetup.deploy();
  await electoralZkSetup.deployed();
  console.log("ElectoralZkSetup implantado em:", electoralZkSetup.address);

  // Implantar o contrato VoterRegistration
  const VoterRegistration = await ethers.getContractFactory("VoterRegistration");
  const voterRegistration = await VoterRegistration.deploy();
  await voterRegistration.deployed();
  console.log("VoterRegistration implantado em:", voterRegistration.address);

  // Implantar o contrato BallotBox
  const BallotBox = await ethers.getContractFactory("BallotBox");
  const ballotBox = await BallotBox.deploy(
    voterRegistration.address,  // Endereço do contrato de registro de eleitores
    electoralZkSetup.address,   // Endereço do contrato de setup zk
    Math.floor(Date.now() / 1000), // Tempo de início da eleição (agora)
    Math.floor(Date.now() / 1000) + 86400 // Tempo de término da eleição (24 horas depois)
  );
  await ballotBox.deployed();
  console.log("BallotBox implantado em:", ballotBox.address);
}

main().catch((error) => {
  console.error("Erro ao implantar os contratos:", error);
  process.exit(1);
});