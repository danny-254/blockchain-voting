import { useState } from 'react'
import { ethers } from 'ethers'
import contract from './contract.json'
import { useNavigate } from 'react-router-dom'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'

function Home() {
  const contractABI = contract.abi
  const contractAddress = '' // insert contract address
  const [address, setAddress] = useState('')
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = provider.getSigner()
  const votingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )
  let voterRegister = []
  let navigate = useNavigate()

  /* This function is not efficient in this case. 
  I think as of now the best approach should be the deployer of the voting contract who is in charge of 
  managing the election should provide a voter register and this could be fetched via an API call from a database.
  Since verification is also done by the smart contract when calling the cast_vote function. */

  // Just make an api call and populate our voter Register with the data returned.

  // The following function just voter adresses into voterRegister by making calls to the smart contract
  const copyVoterRegister = async () => {
    const firstVoter = await votingContract.registeredVoters(0)
    voterRegister.push(firstVoter)
    const secondVoter = await votingContract.registeredVoters(1)
    voterRegister.push(secondVoter)
    const thirdVoter = await votingContract.registeredVoters(2)
    voterRegister.push(thirdVoter)
    const fourthVoter = await votingContract.registeredVoters(3)
    voterRegister.push(fourthVoter)
  }

  const checkVoterElegibility = (voterAddress) => {
    copyVoterRegister().then(() => {
      if (voterRegister.includes(voterAddress)) {
        navigate('/vote', { state: voterAddress })
      } else {
        navigate('/404')
      }
    })
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    checkVoterElegibility(address)
  }

  const handleResult = (e) => {
    e.preventDefault()
    navigate('/tally')
  }

  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center align-items-center">
          <label htmlFor="voterAddress">
            <h5>ENTER VOTER ADDRESS</h5>
          </label>
        </div>
        <br />
        <div>
          <input
            value={address}
            onInput={(e) => setAddress(e.target.value)}
            id="address"
            type="text"
            className="form-control form-control-lg"
            placeholder="Address"
            required
          />
        </div>
        <br />
        <div className="d-flex justify-content-center align-items-center">
          <button
            type="submit"
            className="blockButton btn btn-dark submit-button"
          >
            SUBMIT
          </button>
        </div>
        <br />
        <div>
          <button
            onClick={handleResult}
            className="blockButton btn btn-dark submit-button"
          >
            View Results
          </button>
        </div>
      </form>
    </div>
  )
}

export default Home
