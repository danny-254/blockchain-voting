import { ethers } from 'ethers'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import contract from './contract.json'
import { useNavigate } from 'react-router-dom'
import { CssBaseline, Box, Container, Button } from '@mui/material'

function App() {
  const contractABI = contract.abi
  const contractAddress = '' //insert contract address
  const provider = new ethers.providers.JsonRpcProvider()
  const signer = provider.getSigner()
  const votingContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer,
  )
  const [choice, setChoice] = useState('')
  const location = useLocation()
  let navigate = useNavigate()
  let voters = []

  const handleChange = (e) => {
    setChoice(e.target.value)
  }

  const submitChoice = async () => {
    if (choice === 'raila') {
      try {
        await votingContract.castVote(location.state, 1)
        navigate('/success')
      } catch (error) {
        if (error.error.data.reason === 'Already voted') {
          navigate('/failed')
        } else {
          console.log(error)
        }
      }
    } else if (choice === 'ruto') {
      try {
        await votingContract.castVote(location.state, 2)
        navigate('/success')
      } catch (error) {
        if (error.error.data.reason === 'Already voted') {
          navigate('/failed')
        } else {
          console.log(error)
        }
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    submitChoice().then(() => {
      voters.push({ address: location.state, candidateChosen: choice })
    })
  }

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box
          sx={{
            width: 300,
            height: 300,
            border: '1px solid black',
            marginTop: '50px',
            marginLeft: '100px',
            marginRight: 'auto',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 1,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div
              style={{
                width: '100%',
                marginTop: '50px',
                marginBottom: '50px',
                display: 'inline-block',
                justifyContent: 'right',
                marginLeft: '70px',
                marginRight: 'auto',
              }}
            >
              <label>
                <input
                  type="radio"
                  value="raila"
                  checked={choice === 'raila'}
                  onChange={handleChange}
                />
                <span> Raila Odinga</span>
              </label>
            </div>
            <div
              style={{
                width: '100%',
                marginTop: '10px',
                marginBottom: '10px',
                display: 'inline-block',
                justifyContent: 'right',
                marginLeft: '70px',
                marginRight: 'auto',
              }}
            >
              <label>
                <input
                  type="radio"
                  value="ruto"
                  checked={choice === 'ruto'}
                  onChange={handleChange}
                />
                <span> William Ruto</span>
              </label>
            </div>
            <div
              style={{
                width: '100%',
                marginTop: '50px',
                marginBottom: '10px',
                display: 'inline-block',
                justifyContent: 'right',
                marginLeft: '70px',
                marginRight: 'auto',
              }}
            >
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </form>
        </Box>
      </Container>
    </>
  )
}

export default App
