// Import necessary modules
const { expect } = require("chai");
const sinon = require("sinon");
const { ethers } = require("hardhat");

// Mock data
const mockContractAddress = "0x1234567890abcdef1234567890abcdef12345678";
const mockVoterAddress = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef";
const mockTransaction = { wait: sinon.stub().resolves() };

// Test suite for register_voter.js
describe("register_voter.js", function () {
  let VoterRegistration, voterRegistration, attachStub, registerVoterStub;

  beforeEach(async function () {
    // Mock the ethers.getContractFactory and attach functions
    VoterRegistration = { attach: sinon.stub().returns(mockTransaction) };
    attachStub = sinon.stub(ethers, "getContractFactory").resolves(VoterRegistration);
    registerVoterStub = sinon.stub(mockTransaction, "registerVoter").resolves(mockTransaction);
  });

  afterEach(function () {
    // Restore the original functions
    sinon.restore();
  });

  it("should attach to the VoterRegistration contract correctly", async function () {
    await main();
    expect(attachStub.calledOnceWith("VoterRegistration")).to.be.true;
    expect(VoterRegistration.attach.calledOnceWith(mockContractAddress)).to.be.true;
  });

  it("should call registerVoter with the correct address", async function () {
    await main();
    expect(registerVoterStub.calledOnceWith(mockVoterAddress)).to.be.true;
  });

  it("should wait for the transaction to be confirmed", async function () {
    await main();
    expect(mockTransaction.wait.calledOnce).to.be.true;
  });

  it("should handle errors correctly", async function () {
    const error = new Error("Test error");
    registerVoterStub.rejects(error);

    try {
      await main();
    } catch (err) {
      expect(err).to.equal(error);
    }
  });
});