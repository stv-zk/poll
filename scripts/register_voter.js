const { ethers } = require("hardhat");

async function main() {
  // Conectar ao contrato VoterRegistration já implantado
  const VoterRegistration = await ethers.getContractFactory("VoterRegistration");
  const voterRegistration = await VoterRegistration.attach(
    "ENDERECO_DO_CONTRATO_VOTER_REGISTRATION" // Substitua pelo endereço do contrato implantado
  );

  // Endereço do eleitor a ser registrado
  const voterAddress = "ENDERECO_DO_ELEITOR"; // Substitua pelo endereço real do eleitor

  // Registrar o eleitor chamando a função registerVoter
  const tx = await voterRegistration.registerVoter(voterAddress);
  await tx.wait(); // Esperar a confirmação da transação

  console.log(`Eleitor ${voterAddress} registrado com sucesso.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });