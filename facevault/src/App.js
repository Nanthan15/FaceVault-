import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './pages/login';
import Register from './pages/register';
import CheckPage from './pages/check';
import Home from './pages/home';
import ReceiveFilesPage from './pages/receive';
import VaultPage from './pages/vault';
import SendFileModal from './pages/share';


function App() {
  return (
    <Router>
      <div className="App">
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/vault" element={<VaultPage />} />
          <Route path="/receive" element={<ReceiveFilesPage />} />
          <Route path="/send" element={<SendFileModal />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
