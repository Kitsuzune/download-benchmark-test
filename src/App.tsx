import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SingleDownload from './pages/SingleDownload'
import MultipleDownload from './pages/MultipleDownload';
import FileUpload from './pages/FileUpload';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SingleDownload />} />
        <Route path="/multiple" element={<MultipleDownload />} />
        <Route path="/upload" element={<FileUpload />} />
      </Routes>
    </Router>
  )
}

export default App