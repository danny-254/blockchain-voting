// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract President {
    uint256 totalVotes;
    uint256 totalVoters;
    Candidate[] public candidates;
    mapping(address => Voter) public voters;
    mapping(uint256 => uint256) public tally;
    address [] public registeredVoters;
    Voter[] public voterRegister;
   

    struct Candidate {
        string name;
        uint256 voteCount;
        uint256 votePercentage;
    }

    struct Voter {
        address votersAddress;
        bool voted;
        uint256 vote;
    }

    event AnnounceWinner(string, uint256, uint256);
    event ShowVoters(Voter[]);
    event ShowCandidates(Candidate[]);

    // Get a voter address from the passed in array of voter address and map them to a Voter object with
    // their vote satus being false


    function addVoter(address voter) private {
        voters[voter].voted = false;
        voters[voter].vote = 0;
    }

    function exist(address voterAddress) private view returns (bool) {
        for (uint256 i = 0; i < registeredVoters.length; i++) {
            if (registeredVoters[i] == voterAddress) {
                return true;
            } 
        }

        return false;
    }

    constructor(string [] memory candidatesNames, address [] memory voterAddresses) {
        for (uint256 i = 0; i < candidatesNames.length; i++) {
            candidates.push(Candidate({
                name: candidatesNames[i],
                voteCount: 0,
                votePercentage: 0
            }));
        }
        for (uint256 j = 0; j < voterAddresses.length; j++) {
            addVoter(voterAddresses[j]);
            registeredVoters.push(voterAddresses[j]);
        }
    }

    function getVotersResults() public {
        Voter[] memory updatedRegister;
        (updatedRegister, ) = tallyResults();

        emit ShowVoters(updatedRegister);
    }

      function getCandidatesResults() public {
        Candidate[] memory updatedResults;
        ( ,updatedResults) = tallyResults();

        emit ShowCandidates(updatedResults);
    }

    // Enable voters to vote on their candidate of choice

    function castVote(address _voter, uint256 _candidate) public {
        require(exist(_voter), "Not an eligible voter");
        require(!voters[_voter].voted, "Already voted");

        voters[_voter].voted = true;
        voters[_voter].vote = _candidate;

        if (voters[_voter].vote == 1) {
            tally[1] += 1;
            totalVotes = totalVotes + 1;
            candidates[0].voteCount = tally[1];

        } else if (voters[_voter].vote == 2) {
            tally[2] += 1;
            totalVotes = totalVotes + 1;
            candidates[1].voteCount = tally[2];

        } else {
            revert();
        }
    }

    // Get the percentage Voter Turnout

    function voterTurnout() private returns (uint256){
        uint256 percentageTurnout;
        totalVoters = registeredVoters.length;

        percentageTurnout = (totalVotes * 100) / totalVoters;

        
        return (percentageTurnout);

    }

    // Make Sure that at least 60% of registered voters cast their votes to make the election valid

    function tallyResults() private returns(Voter[] memory, Candidate[] memory){
        delete voterRegister;
        totalVoters = registeredVoters.length;

        for (uint256 x = 0; x < registeredVoters.length; x++) {
            voterRegister.push(Voter({
                votersAddress: registeredVoters[x],
                voted: voters[registeredVoters[x]].voted,
                vote: voters[registeredVoters[x]].vote
            }));
        }
        
        for (uint256 y = 0; y < candidates.length; y++) {
        candidates[y].votePercentage = (candidates[y].voteCount * 100) / totalVoters;
        }

        return(voterRegister, candidates);

    }


    function getWinner() private returns (uint256) {
        require(tally[1] + tally[2] == totalVotes, "Election not fair");
        require(voterTurnout() >= 60, "Not Enough voters");
        

        if (tally[1] > tally[2]) {
            return 1;
        } else if (tally[2] > tally[1]) {
            return 2;
        } else {
            return 3;
        }
    }

    // Announce the winner 

    function announceWinner() private returns (string memory, uint256, uint256){
        uint256 result = getWinner();
        ( , Candidate[] memory _candidates) = tallyResults();
        string memory message;
        string memory winnerName;
        uint256 winnerVotes;
        uint256 winningMargin;

        if (result == 1) {
            winnerName = _candidates[0].name;
            winnerVotes = _candidates[0].voteCount;
            winningMargin = _candidates[0].votePercentage;
            
            return (winnerName, winnerVotes, winningMargin);
        } else if (result == 2) {
            winnerName = _candidates[1].name;
            winnerVotes = _candidates[1].voteCount;
            winningMargin = _candidates[1].votePercentage;
            
            return (winnerName, winnerVotes, winningMargin);  
        } else if (result == 3) {
            message = "Its a tie";
            winnerVotes = _candidates[0].voteCount;
            winningMargin = _candidates[0].votePercentage;

            return (message, winnerVotes, winningMargin);
        }
    }

    function sendData() public {
        (string memory Name, uint256 voteGot, uint256 margin) = announceWinner();
        emit AnnounceWinner(Name, voteGot, margin);
        
    }
}