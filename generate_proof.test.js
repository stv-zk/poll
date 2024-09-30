// Install dependencies: mocha, chai, sinon, proxyquire
// npm install mocha chai sinon proxyquire

const { expect } = require("chai");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

describe("generateProof", () => {
  let groth16Mock, fsMock, generateProof;

  beforeEach(() => {
    groth16Mock = {
      fullProve: sinon.stub(),
    };

    fsMock = {
      writeFileSync: sinon.stub(),
    };

    generateProof = proxyquire("../generate_proof", {
      snarkjs: { groth16: groth16Mock },
      fs: fsMock,
    }).generateProof;
  });

  it("should generate proof and save files successfully", async () => {
    const input = { vote: 1, nullifier: 12345 };
    const proof = { proof: "proof" };
    const publicSignals = { signals: "signals" };

    groth16Mock.fullProve.resolves({ proof, publicSignals });

    await generateProof(input);

    expect(groth16Mock.fullProve.calledOnceWith(input, sinon.match.string, sinon.match.string)).to.be.true;
    expect(fsMock.writeFileSync.calledTwice).to.be.true;
    expect(fsMock.writeFileSync.firstCall.args[0]).to.include("proof.json");
    expect(fsMock.writeFileSync.firstCall.args[1]).to.equal(JSON.stringify(proof, null, 2));
    expect(fsMock.writeFileSync.secondCall.args[0]).to.include("publicSignals.json");
    expect(fsMock.writeFileSync.secondCall.args[1]).to.equal(JSON.stringify(publicSignals, null, 2));
  });

  it("should handle errors during proof generation", async () => {
    const input = { vote: 1, nullifier: 12345 };
    const error = new Error("Test error");

    groth16Mock.fullProve.rejects(error);

    const consoleErrorStub = sinon.stub(console, "error");

    await generateProof(input);

    expect(consoleErrorStub.calledOnceWith("Erro ao gerar a prova:", error)).to.be.true;

    consoleErrorStub.restore();
  });
});

describe("main", () => {
  let generateProofMock, main;

  beforeEach(() => {
    generateProofMock = sinon.stub();

    main = proxyquire("../generate_proof", {
      "./generate_proof": { generateProof: generateProofMock },
    }).main;
  });

  it("should call generateProof with correct input", async () => {
    await main();

    expect(generateProofMock.calledOnceWith({ vote: 1, nullifier: 12345 })).to.be.true;
  });
});