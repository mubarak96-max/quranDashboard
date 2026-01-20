import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quotes from './components/Quotes';
import Home from './components/Home';
import Surah from './components/Surah';
import Audios from './components/Audios';
import Books from './components/Books';
import Duas from './components/Duas';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('quranDashboardAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('quranDashboardAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('quranDashboardAuth');
  };

  // Show loading state briefly while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Show login if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // Show main app if authenticated
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home onLogout={handleLogout} />} />
          {/* <Route path='/addQuote' element={<AddQuote />} /> */}

          <Route path='/surahs' element={<Surah />} />
          <Route path='/quotes' element={<Quotes />} />
          <Route path='/audios' element={<Audios />} />
          <Route path='/books' element={<Books />} />
          <Route path='/duas' element={<Duas />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
