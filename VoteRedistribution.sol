// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZkProofLibrary.sol";

contract STVZkVoting is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Struct to store details of each voter's participation in multiple elections
    struct Voter {
        bool hasVoted;
        uint256[] participatedElections; // List of electionIds the voter has participated in
    }

    mapping(address => Voter) public voters; // Mapping of voter address to Voter struct
    mapping(uint256 => mapping(address => bool)) public votedInElection; // Tracks if an address has voted in an election

    event VoterRegistered(address indexed voter, uint256[] participatedElections);

    // Modifier to ensure the voter is eligible to participate
    modifier eligibleToVote(uint256 _electionId) {
        require(!votedInElection[_electionId][msg.sender], "You have already voted in this election.");
        _;
    }

    // Function to register a voter and track their participation in elections
    function registerVoter() external {
        require(!voters[msg.sender].hasVoted, "Voter is already registered.");
        voters[msg.sender] = Voter(true, new uint256[](0));
        emit VoterRegistered(msg.sender, voters[msg.sender].participatedElections);
    }

    // Function to cast a vote in a specific election
    function castVoteInElection(uint256 _electionId, bytes32 _zkProof) external nonReentrant eligibleToVote(_electionId) {
        require(elections[_electionId].completed == false, "The election has already been completed.");

        // Use zk-proof to verify the vote
        uint256[] memory decryptedPreferences = ZkProofLibrary.verifyAndDecrypt(_zkProof);

        // Tally the vote as per STV rules
        tallyVotes(_electionId, decryptedPreferences);

        // Track the voter participation
        votedInElection[_electionId][msg.sender] = true;
        voters[msg.sender].participatedElections.push(_electionId);
    }

    // Internal function to tally votes based on decrypted preferences
    function tallyVotes(uint256 _electionId, uint256[] memory decryptedPreferences) internal {
        for (uint256 i = 0; i < decryptedPreferences.length; i++) {
            if (!eliminatedCandidates[decryptedPreferences[i]]) {
                elections[_electionId].candidateVotes[decryptedPreferences[i]] = 
                    elections[_electionId].candidateVotes[decryptedPreferences[i]].add(1);
            }
        }
        elections[_electionId].totalVotes = elections[_electionId].totalVotes.add(1);
    }
}