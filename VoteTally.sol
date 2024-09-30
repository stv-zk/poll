// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZkProofLibrary.sol";

contract STVZkVoting is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Struct to store details of the round of redistribution in STV
    struct Redistribution {
        uint256 roundNumber;
        uint256 totalVotesDistributed;
        bool completed;
        mapping(uint256 => uint256) redistributedVotes; // Mapping from candidateId to redistributed votes
    }

    mapping(uint256 => Redistribution) public redistributions; // Mapping of round number to Redistribution
    mapping(uint256 => bool) public eliminatedCandidates; // Track eliminated candidates in each election

    event RedistributionStarted(uint256 indexed roundNumber, uint256 electionId);
    event RedistributionCompleted(uint256 indexed roundNumber, uint256 electionId, uint256[] redistributedVotes);

    // Modifier to ensure the candidate is still active
    modifier candidateActive(uint256 _electionId, uint256 _candidateId) {
        require(!eliminatedCandidates[_candidateId], "This candidate has been eliminated.");
        _;
    }

    // Function to start redistribution process in case no candidate meets the quota
    function startRedistribution(uint256 _electionId) external onlyOwner electionOngoing(_electionId) {
        require(elections[_electionId].totalVotes > 0, "No votes to redistribute in this election.");

        uint256 roundNumber = elections[_electionId].totalVotes.div(elections[_electionId].numSeats);
        redistributions[roundNumber] = Redistribution(roundNumber, 0, false);

        emit RedistributionStarted(roundNumber, _electionId);
    }

    // Function to redistribute votes from eliminated candidates
    function redistributeVotes(uint256 _electionId, uint256 _candidateId, bytes32 _zkProof) external nonReentrant candidateActive(_electionId, _candidateId) {
        require(elections[_electionId].completed == false, "The election has already been completed.");

        // Verify and decrypt the zk-proof to get the preferences for redistribution
        uint256[] memory decryptedPreferences = ZkProofLibrary.verifyAndDecrypt(_zkProof);

        // Redistribute votes to remaining candidates based on preferences
        for (uint256 i = 1; i < decryptedPreferences.length; i++) {
            if (!eliminatedCandidates[decryptedPreferences[i]]) {
                redistributions[_candidateId].redistributedVotes[decryptedPreferences[i]] = 
                    redistributions[_candidateId].redistributedVotes[decryptedPreferences[i]].add(1);
            }
        }

        redistributions[_candidateId].totalVotesDistributed = redistributions[_candidateId].totalVotesDistributed.add(1);
        redistributions[_candidateId].completed = true;

        emit RedistributionCompleted(_candidateId, _electionId, decryptedPreferences);
    }

    // Function to mark a candidate as eliminated
    function eliminateCandidate(uint256 _candidateId) external onlyOwner {
        eliminatedCandidates[_candidateId] = true;
    }
}