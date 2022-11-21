import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Surah from './components/Surah';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* This route is for home component 
          with exact path "/", in component props 
          we passes the imported component*/}
          <Route exact path='/' element={<Home />} />

          <Route path='/surah' element={<Surah />} />

          {/* If any route mismatches the upper 
          route endpoints then, redirect triggers 
          and redirects app to home component with to="/" */}
          {/* <Redirect to='/' /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
