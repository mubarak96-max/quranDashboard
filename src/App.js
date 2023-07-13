import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quotes from './components/Quotes';
import Home from './components/Home';
import Surah from './components/Surah';
import Audios from './components/Audios';
import Books from './components/Books';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home />} />
          {/* <Route path='/addQuote' element={<AddQuote />} /> */}

          <Route path='/surahs' element={<Surah />} />
          <Route path='/quotes' element={<Quotes />} />
          <Route path='/audios' element={<Audios />} />
          <Route path='/books' element={<Books />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
