// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZkProofLibrary.sol"; // Placeholder for the zk-proof generation and verification library

contract STVZkVoting is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Struct to store details of the election
    struct Election {
        uint256 id;
        string description;
        bool completed;
        uint256 totalVotes;
        uint256 numSeats;
        mapping(uint256 => uint256) candidateVotes; // Maps candidateId to their vote tally
    }

    Counters.Counter private electionCounter; // Counter for elections
    mapping(uint256 => Election) public elections; // Mapping of electionId to Election
    mapping(address => bool) public hasVotedInElection; // Mapping to track if a voter has voted in a specific election

    event ElectionCreated(uint256 indexed electionId, string description, uint256 numSeats);
    event VoteTallied(uint256 indexed electionId, address voter, uint256[] decryptedPreferences);

    // Modifier to check if an election is still ongoing
    modifier electionOngoing(uint256 _electionId) {
        require(!elections[_electionId].completed, "This election has already been completed.");
        _;
    }

    // Function to create an election
    function createElection(string memory _description, uint256 _numSeats) external onlyOwner {
        electionCounter.increment();
        uint256 electionId = electionCounter.current();
        elections[electionId] = Election(electionId, _description, false, 0, _numSeats);

        emit ElectionCreated(electionId, _description, _numSeats);
    }

    // Function to tally votes by decrypting zk-proof preferences and counting them
    function tallyVotes(uint256 _electionId, bytes32 _zkProof) external nonReentrant electionOngoing(_electionId) {
        require(hasVotedInElection[msg.sender] == false, "You can only vote once in the election.");

        // Use the ZkProofLibrary to verify and decrypt preferences
        uint256[] memory decryptedPreferences = ZkProofLibrary.verifyAndDecrypt(_zkProof);

        // Process the decrypted preferences to tally votes according to STV rules
        for (uint256 i = 0; i < decryptedPreferences.length; i++) {
            elections[_electionId].candidateVotes[decryptedPreferences[i]] = 
                elections[_electionId].candidateVotes[decryptedPreferences[i]].add(1);
        }

        elections[_electionId].totalVotes = elections[_electionId].totalVotes.add(1);
        hasVotedInElection[msg.sender] = true;

        emit VoteTallied(_electionId, msg.sender, decryptedPreferences);
    }
}