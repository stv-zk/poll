// Import necessary libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deployment Tests", function () {
  let ElectoralZkSetup, VoterRegistration, BallotBox;
  let electoralZkSetup, voterRegistration, ballotBox;
  let startTime, endTime;

  before(async function () {
    // Get contract factories
    ElectoralZkSetup = await ethers.getContractFactory("ElectoralZkSetup");
    VoterRegistration = await ethers.getContractFactory("VoterRegistration");
    BallotBox = await ethers.getContractFactory("BallotBox");

    // Deploy contracts
    electoralZkSetup = await ElectoralZkSetup.deploy();
    await electoralZkSetup.deployed();

    voterRegistration = await VoterRegistration.deploy();
    await voterRegistration.deployed();

    startTime = Math.floor(Date.now() / 1000);
    endTime = startTime + 86400;

    ballotBox = await BallotBox.deploy(
      voterRegistration.address,
      electoralZkSetup.address,
      startTime,
      endTime
    );
    await ballotBox.deployed();
  });

  it("should deploy ElectoralZkSetup contract successfully", async function () {
    expect(electoralZkSetup.address).to.properAddress;
  });

  it("should deploy VoterRegistration contract successfully", async function () {
    expect(voterRegistration.address).to.properAddress;
  });

  it("should deploy BallotBox contract successfully", async function () {
    expect(ballotBox.address).to.properAddress;
  });

  it("should initialize BallotBox contract with correct parameters", async function () {
    expect(await ballotBox.voterRegistration()).to.equal(voterRegistration.address);
    expect(await ballotBox.electoralZkSetup()).to.equal(electoralZkSetup.address);
    expect(await ballotBox.startTime()).to.equal(startTime);
    expect(await ballotBox.endTime()).to.equal(endTime);
  });

  it("should handle errors during deployment", async function () {
    await expect(ElectoralZkSetup.deploy()).to.not.be.reverted;
    await expect(VoterRegistration.deploy()).to.not.be.reverted;
    await expect(BallotBox.deploy(
      voterRegistration.address,
      electoralZkSetup.address,
      startTime,
      endTime
    )).to.not.be.reverted;
  });
});