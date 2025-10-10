import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SingleDownload from './pages/SingleDownload'
import MultipleDownload from './pages/MultipleDownload';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SingleDownload />} />
        <Route path="/multiple" element={<MultipleDownload />} />
      </Routes>
    </Router>
  )
}

export default App