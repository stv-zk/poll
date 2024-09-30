const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Electoral System Deployment", function () {
  let ElectoralZkSetup, VoterRegistration, BallotBox;
  let electoralZkSetup, voterRegistration, ballotBox;
  let deployer;

  before(async function () {
    [deployer] = await ethers.getSigners();
  });

  it("Should deploy ElectoralZkSetup contract", async function () {
    ElectoralZkSetup = await ethers.getContractFactory("ElectoralZkSetup");
    electoralZkSetup = await ElectoralZkSetup.deploy();
    await electoralZkSetup.deployed();
    expect(electoralZkSetup.address).to.properAddress;
  });

  it("Should deploy VoterRegistration contract", async function () {
    VoterRegistration = await ethers.getContractFactory("VoterRegistration");
    voterRegistration = await VoterRegistration.deploy();
    await voterRegistration.deployed();
    expect(voterRegistration.address).to.properAddress;
  });

  it("Should deploy BallotBox contract with correct parameters", async function () {
    const startTime = Math.floor(Date.now() / 1000);
    const endTime = startTime + 86400;

    BallotBox = await ethers.getContractFactory("BallotBox");
    ballotBox = await BallotBox.deploy(
      voterRegistration.address,
      electoralZkSetup.address,
      startTime,
      endTime
    );
    await ballotBox.deployed();
    expect(ballotBox.address).to.properAddress;
  });

  it("Should have correct addresses in BallotBox contract", async function () {
    const voterRegAddress = await ballotBox.voterRegistration();
    const zkSetupAddress = await ballotBox.electoralZkSetup();
    expect(voterRegAddress).to.equal(voterRegistration.address);
    expect(zkSetupAddress).to.equal(electoralZkSetup.address);
  });
});