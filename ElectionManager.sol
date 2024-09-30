// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZkProofLibrary.sol";

contract STVZkVoting is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Struct to store election audit details
    struct AuditRecord {
        uint256 electionId;
        address auditor;
        string auditResult;
        uint256 timestamp;
    }

    mapping(uint256 => AuditRecord[]) public electionAudits; // Map electionId to audit records

    event AuditPerformed(uint256 indexed electionId, address indexed auditor, string auditResult, uint256 timestamp);

    // Modifier to ensure only authorized auditors can perform audits
    modifier onlyAuditor() {
        require(hasRole(AUDITOR_ROLE, msg.sender), "Caller is not an authorized auditor.");
        _;
    }

    // Role-based access control for auditors
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");

    // Function to assign auditor role
    function assignAuditor(address _auditor) external onlyOwner {
        _setupRole(AUDITOR_ROLE, _auditor);
    }

    // Function to perform an audit on an election
    function performAudit(uint256 _electionId, string memory _auditResult) external onlyAuditor {
        require(elections[_electionId].completed, "Election is not yet finalized.");

        AuditRecord memory newAudit = AuditRecord({
            electionId: _electionId,
            auditor: msg.sender,
            auditResult: _auditResult,
            timestamp: block.timestamp
        });

        electionAudits[_electionId].push(newAudit);

        emit AuditPerformed(_electionId, msg.sender, _auditResult, block.timestamp);
    }

    // Function to retrieve audit records for an election
    function getAuditRecords(uint256 _electionId) external view returns (AuditRecord[] memory) {
        return electionAudits[_electionId];
    }
}