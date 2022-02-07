import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import App from './App'
import NotFound from './NotFound'
import Results from './tally'
import Submit from './Submit'
import Failed from './Failed'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<App />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/tally" element={<Results />} />
        <Route path="/success" element={<Submit />} />
        <Route path="/failed" element={<Failed />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
