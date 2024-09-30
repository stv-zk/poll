const path = require("path");
const compiler = require("circom");
const fs = require("fs");
const { expect } = require("chai");
const sinon = require("sinon");

describe("compile.js", () => {
  let pathJoinStub, compilerStub, writeToFileStub;

  beforeEach(() => {
    pathJoinStub = sinon.stub(path, "join");
    compilerStub = sinon.stub(compiler, "default");
    writeToFileStub = sinon.stub();

    pathJoinStub.withArgs(__dirname, "../circuit", "circuit.circom").returns("/mocked/path/circuit.circom");
    pathJoinStub.withArgs(__dirname, "../circuit", "circuit.json").returns("/mocked/path/circuit.json");
    pathJoinStub.withArgs(__dirname, "../circuit", "circuit_js", "circuit.wasm").returns("/mocked/path/circuit.wasm");

    compilerStub.resolves({
      r1cs: { writeToFile: writeToFileStub },
      wasm: { writeToFile: writeToFileStub }
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call path.join with correct arguments for circuit path", async () => {
    await require("/C:/Users/metatateca/Documents/@@@@@@ projeto/@projeto novo - baseado em projetos auditados/compile.js");
    expect(pathJoinStub.calledWith(__dirname, "../circuit", "circuit.circom")).to.be.true;
  });

  it("should call compiler with correct circuit path", async () => {
    await require("/C:/Users/metatateca/Documents/@@@@@@ projeto/@projeto novo - baseado em projetos auditados/compile.js");
    expect(compilerStub.calledWith("/mocked/path/circuit.circom")).to.be.true;
  });

  it("should call path.join with correct arguments for output paths", async () => {
    await require("/C:/Users/metatateca/Documents/@@@@@@ projeto/@projeto novo - baseado em projetos auditados/compile.js");
    expect(pathJoinStub.calledWith(__dirname, "../circuit", "circuit.json")).to.be.true;
    expect(pathJoinStub.calledWith(__dirname, "../circuit", "circuit_js", "circuit.wasm")).to.be.true;
  });

  it("should write compiled files to correct paths", async () => {
    await require("/C:/Users/metatateca/Documents/@@@@@@ projeto/@projeto novo - baseado em projetos auditados/compile.js");
    expect(writeToFileStub.calledWith("/mocked/path/circuit.json")).to.be.true;
    expect(writeToFileStub.calledWith("/mocked/path/circuit.wasm")).to.be.true;
  });

  it("should handle compiler errors", async () => {
    compilerStub.rejects(new Error("Compilation error"));
    try {
      await require("/C:/Users/metatateca/Documents/@@@@@@ projeto/@projeto novo - baseado em projetos auditados/compile.js");
    } catch (error) {
      expect(error.message).to.equal("Compilation error");
    }
  });
});