# BlockChain Voting DApp

This is a minimal DApp that enables voting and vote tallying on the block chain.

It has a smart contract implemented in the solidity language that acts as a backend and a minimal front end built with React js.

# Project Inspiration

The main inspiration behind this project is the upcoming ( as of this writing ) General election in Kenya.

Out of curiousity, I wondered what it would be like if the election would be conducted on blockchain tech and with that idea in mind, this DApp was created.

# How it works

- The smart contract takes candidates' names and voter Addresses ( These should be blockchain addresses unique to each voter ) on deployment and these are stored on chain ( this could be quite expensive ). Out of this a voter register ( an array of voter address ) is created.
- On the front-end, the deployer of the contract should also provide a copy of the voters' register to which is used to validate users who are eligible to vote.

<!-- provide an image of the home page -->

- If the address provided exists in the voters' register, the user is then redirected to the voting page where they select a candidate of their choice and submit.

- On submission, the smart contract validates that the user address exists on the voter register stored on chain and that they have not cast a vote yet. If these requirements are met, the users vote is counted and added to the total tally and the supplied address marked as voted.

- The contract also implements a 60% voter turnout threshold; i.e For the election to be valid, at least 60% of all registered voters should vote.

- As soon as voting is concluded, election results can be view of the results page where there is tabulated data showing who won the election, the number of votes they got and a percentage margin of how much they got from the total votes cast.

<!-- provide image of results -->
