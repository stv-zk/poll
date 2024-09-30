const { groth16 } = require("snarkjs");
const path = require("path");
const fs = require("fs");

const wasmPath = path.join(__dirname, "../circuit", "circuit_js", "circuit.wasm"); // Caminho para o arquivo wasm
const zkeyPath = path.join(__dirname, "../circuit", "circuit_final.zkey"); // Caminho para o arquivo zkey

// Função para gerar a zk-proof
const generateProof = async (input) => {
  try {
    // Gerar a prova e os sinais públicos usando a biblioteca groth16
    const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);

    // Converter a prova e os sinais públicos para JSON
    const proofJson = JSON.stringify(proof, null, 2);
    const publicSignalsJson = JSON.stringify(publicSignals, null, 2);

    // Salvar a prova e os sinais públicos em arquivos locais
    fs.writeFileSync(path.join(__dirname, "../proof.json"), proofJson);
    fs.writeFileSync(path.join(__dirname, "../publicSignals.json"), publicSignalsJson);

    console.log("Prova e sinais públicos gerados e salvos.");
  } catch (error) {
    console.error("Erro ao gerar a prova:", error);
  }
};

// Função principal para chamar a geração da prova com dados de entrada
const main = async () => {
  const input = {
    vote: 1,           // Exemplo de voto, você pode ajustar conforme necessário
    nullifier: 12345,  // Identificador único do voto
  };

  await generateProof(input);  // Gerar a zk-proof com os dados de entrada
};

main();