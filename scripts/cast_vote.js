const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  // Carregar o contrato BallotBox já implantado
  const BallotBox = await ethers.getContractFactory("BallotBox");
  const ballotBox = await BallotBox.attach(
    "ENDERECO_DO_CONTRATO_BALLOT_BOX" // Substitua pelo endereço do contrato implantado
  );

  // Carregar a prova zk e os sinais públicos de arquivos JSON
  const proof = JSON.parse(fs.readFileSync("./proof.json", "utf8"));
  const publicSignals = JSON.parse(fs.readFileSync("./publicSignals.json", "utf8"));

  // Chamar a função castVote no contrato BallotBox para lançar o voto
  const tx = await ballotBox.castVote(
    proof.pi_a,   // Prova componente A
    proof.pi_b,   // Prova componente B
    proof.pi_c,   // Prova componente C
    publicSignals // Sinais públicos
  );
  await tx.wait(); // Esperar a confirmação da transação

  console.log("Voto lançado com sucesso!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });