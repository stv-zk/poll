// Import necessary modules
const { expect } = require("chai");
const sinon = require("sinon");
const { ethers } = require("hardhat");
const fs = require("fs");

// Import the main function to be tested
const main = require("/C:/Users/metatateca/Documents/@@@@@@ projeto/@projeto novo - baseado em projetos auditados/cast_vote.js").main;

describe("cast_vote.js", function () {
  let contractFactoryStub, contractStub, readFileSyncStub, consoleLogStub;

  beforeEach(function () {
    // Stub ethers.getContractFactory
    contractStub = {
      attach: sinon.stub().returnsThis(),
      castVote: sinon.stub().resolves({ wait: sinon.stub().resolves() })
    };
    contractFactoryStub = sinon.stub(ethers, "getContractFactory").resolves(contractStub);

    // Stub fs.readFileSync
    readFileSyncStub = sinon.stub(fs, "readFileSync");
    readFileSyncStub.withArgs("./proof.json", "utf8").returns(JSON.stringify({
      pi_a: "proofA",
      pi_b: "proofB",
      pi_c: "proofC"
    }));
    readFileSyncStub.withArgs("./publicSignals.json", "utf8").returns(JSON.stringify(["signal1", "signal2"]));

    // Stub console.log
    consoleLogStub = sinon.stub(console, "log");
  });

  afterEach(function () {
    // Restore stubs
    sinon.restore();
  });

  it("should attach to the BallotBox contract", async function () {
    await main();
    expect(contractFactoryStub.calledWith("BallotBox")).to.be.true;
    expect(contractStub.attach.calledWith("ENDERECO_DO_CONTRATO_BALLOT_BOX")).to.be.true;
  });

  it("should read proof and public signals from JSON files", async function () {
    await main();
    expect(readFileSyncStub.calledWith("./proof.json", "utf8")).to.be.true;
    expect(readFileSyncStub.calledWith("./publicSignals.json", "utf8")).to.be.true;
  });

  it("should call castVote with correct parameters", async function () {
    await main();
    expect(contractStub.castVote.calledWith("proofA", "proofB", "proofC", ["signal1", "signal2"])).to.be.true;
  });

  it("should wait for the transaction to be confirmed", async function () {
    await main();
    expect(contractStub.castVote().wait.calledOnce).to.be.true;
  });

  it("should log success message", async function () {
    await main();
    expect(consoleLogStub.calledWith("Voto lançado com sucesso!")).to.be.true;
  });
});