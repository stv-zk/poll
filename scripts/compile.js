const path = require("path");
const compiler = require("circom");
const fs = require("fs");

const circuitPath = path.join(__dirname, "../circuit", "circuit.circom");  // Caminho para o arquivo .circom

// Função para compilar o circuito
compiler(circuitPath).then((circuit) => {
  // Diretórios de saída para os arquivos compilados
  const jsonPath = path.join(__dirname, "../circuit", "circuit.json");
  const wasmPath = path.join(__dirname, "../circuit", "circuit_js", "circuit.wasm");

  // Escrever os arquivos .r1cs e .wasm nos diretórios apropriados
  circuit.r1cs.writeToFile(jsonPath);  // Arquivo .r1cs (restrições do circuito)
  circuit.wasm.writeToFile(wasmPath);  // Arquivo .wasm

  console.log("Circuito compilado com sucesso!");
}).catch((error) => {
  console.error("Erro ao compilar o circuito:", error);
});