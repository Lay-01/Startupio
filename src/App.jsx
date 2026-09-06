import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StartupProfile from './pages/StartupProfile';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/startup/:startupId" element={<StartupProfile />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}
