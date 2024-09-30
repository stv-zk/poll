// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ZkProofLibrary.sol"; // Placeholder for zk-proof-related operations

contract STVZkVoting is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Struct to store details of a candidate in the election
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // Struct to store details of each voter's ballot
    struct Ballot {
        bool casted;
        bytes32 encryptedPreferences; // Encrypted preferences using zk-proof
    }

    Counters.Counter private candidateCounter; // Counter for candidates
    mapping(uint256 => Candidate) public candidates; // Mapping of candidateId to Candidate
    mapping(address => Ballot) public ballots; // Mapping of voters' addresses to their Ballots

    event CandidateAdded(uint256 indexed candidateId, string name);
    event VoteCast(address indexed voter, bytes32 encryptedPreferences);

    // Modifier to check if a voter has already casted their vote
    modifier hasNotVoted() {
        require(!ballots[msg.sender].casted, "You have already casted your vote.");
        _;
    }

    // Function to add a candidate to the election
    function addCandidate(string memory _name) external onlyOwner {
        candidateCounter.increment();
        uint256 candidateId = candidateCounter.current();
        candidates[candidateId] = Candidate(candidateId, _name, 0);

        emit CandidateAdded(candidateId, _name);
    }

    // Function to cast a vote using zk-proof to encrypt preferences
    function castVote(bytes32 _encryptedPreferences) external nonReentrant hasNotVoted {
        ballots[msg.sender] = Ballot(true, _encryptedPreferences);

        emit VoteCast(msg.sender, _encryptedPreferences);
    }
}

