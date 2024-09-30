// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ZkProofLibrary.sol";

contract STVZkVoting is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    // Struct to store details of the election results
    struct ElectionResult {
        uint256 electionId;
        uint256[] winners; // Array of candidateIds who are elected
        bool finalized;
    }

    mapping(uint256 => ElectionResult) public electionResults; // Mapping of electionId to ElectionResult

    event ElectionFinalized(uint256 indexed electionId, uint256[] winners);

    // Modifier to ensure that the election can be finalized
    modifier canFinalizeElection(uint256 _electionId) {
        require(!elections[_electionId].completed, "Election has already been finalized.");
        require(elections[_electionId].totalVotes > 0, "No votes in this election.");
        _;
    }

    // Function to finalize the election and determine the winners
    function finalizeElection(uint256 _electionId) external onlyOwner canFinalizeElection(_electionId) {
        require(redistributions[_electionId].completed, "Redistribution process must be completed.");

        uint256[] memory winners = new uint256[](elections[_electionId].numSeats);
        uint256 seatCount = 0;

        // Determine the winners based on vote counts and STV redistribution results
        for (uint256 i = 1; i <= candidateCounter.current(); i++) {
            if (elections[_electionId].candidateVotes[i] > 0 && !eliminatedCandidates[i]) {
                winners[seatCount] = i;
                seatCount = seatCount.add(1);
                if (seatCount == elections[_electionId].numSeats) {
                    break;
                }
            }
        }

        // Mark the election as completed
        elections[_electionId].completed = true;
        electionResults[_electionId] = ElectionResult(_electionId, winners, true);

        emit ElectionFinalized(_electionId, winners);
    }

    // Function to retrieve the election results
    function getElectionWinners(uint256 _electionId) external view returns (uint256[] memory) {
        require(electionResults[_electionId].finalized, "Election results are not finalized yet.");
        return electionResults[_electionId].winners;
    }
}