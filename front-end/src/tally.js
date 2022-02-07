import { useState } from 'react'
import { ethers } from 'ethers'
import contract from './contract.json'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'

function Results() {
  const contractABI = contract.abi
  const contractAddress = '' // insert contract address
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = provider.getSigner()
  const votingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )

  const [rows1, setRows1] = useState([])
  const [rows2, setRows2] = useState([])
  const [display, setDisplay] = useState(false)
  const [electionResult, setElectionResult] = useState([])

  const getVoterData = async () => {
    await votingContract.getVotersResults()
  }

  const getCandidateData = async () => {
    await votingContract.getCandidatesResults()
  }

  const populateRows1 = (candidateName, votes, popularPercentage) => {
    return { candidateName, votes, popularPercentage }
  }

  const populateRows2 = (address, status, candidate) => {
    return { address, status, candidate }
  }

  const populateResult = (presidentElect, votesGained, winningMargin) => {
    return { presidentElect, votesGained, winningMargin }
  }

  const getElectionResult = async () => {
    await votingContract.sendData()
  }

  const handleClick = (e) => {
    e.preventDefault()

    getElectionResult().then(() => {
      votingContract.on('AnnounceWinner', (candidate, votes, winningMargin) => {
        let resultObject = []
        resultObject.push(
          populateResult(
            candidate,
            ethers.BigNumber.from(votes).toNumber(),
            ethers.BigNumber.from(winningMargin).toNumber(),
          ),
        )
        setElectionResult(resultObject)
      })
    })

    getCandidateData().then(() => {
      votingContract.on('ShowCandidates', (data1) => {
        let returnedData1 = []

        for (let i = 0; i < data1.length; i++) {
          returnedData1.push(
            populateRows1(
              data1[i][0],
              ethers.BigNumber.from(data1[i][1]).toNumber(),
              ethers.BigNumber.from(data1[i][2]).toNumber(),
            ),
          )
        }
        setRows1(returnedData1)
      })
    })

    getVoterData().then(() => {
      votingContract.on('ShowVoters', (data2) => {
        let returnedData2 = []

        for (let j = 0; j < data2.length; j++) {
          if (ethers.BigNumber.from(data2[j][2]).toNumber() === 0) {
            returnedData2.push(
              populateRows2(data2[j][0], data2[j][1].toString(), 'NOT VOTED'),
            )
          } else if (ethers.BigNumber.from(data2[j][2]).toNumber() === 1) {
            returnedData2.push(
              populateRows2(data2[j][0], data2[j][1].toString(), 'RAILA'),
            )
          } else if (ethers.BigNumber.from(data2[j][2]).toNumber() === 2) {
            returnedData2.push(
              populateRows2(data2[j][0], data2[j][1].toString(), 'RUTO'),
            )
          } else {
            returnedData2.push(
              populateRows2(
                data2[j][0],
                data2[j][1].toString(),
                'SPOILED VOTE',
              ),
            )
          }
        }
        setRows2(returnedData2)
      })
    })
    setDisplay(true)
  }

  if (display) {
    return (
      <>
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>WINNER</TableCell>
                  <TableCell align="center">VOTES GARNERED</TableCell>
                  <TableCell align="center">WINNING MARGIN (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {electionResult.map((row) => (
                  <TableRow
                    key={row.presidentElect}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.presidentElect}
                    </TableCell>
                    <TableCell align="center">{row.votesGained}</TableCell>
                    <TableCell align="center">{row.winningMargin}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>CANDIDATE</TableCell>
                  <TableCell align="center">VOTES GARNERED</TableCell>
                  <TableCell align="center">
                    PERCENTAGE POPULARITY (%)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows1.map((row) => (
                  <TableRow
                    key={row.candidateName}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.candidateName}
                    </TableCell>
                    <TableCell align="center">{row.votes}</TableCell>
                    <TableCell align="center">
                      {row.popularPercentage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />

        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>VOTER ADDRESS</TableCell>
                  <TableCell align="center">VOTING STATUS</TableCell>
                  <TableCell align="center">CANDIDATE CHOSEN</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows2.map((row) => (
                  <TableRow
                    key={row.address}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.address}
                    </TableCell>
                    <TableCell align="center">{row.status}</TableCell>
                    <TableCell align="center">{row.candidate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </>
    )
  } else {
    return (
      <div style={{ height: 400, width: '100%' }}>
        <button onClick={handleClick}>log data</button>
      </div>
    )
  }
}

export default Results
