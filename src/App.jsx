import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Home from './pages/Home';
import StartupProfile from './pages/StartupProfile';

export default function App() {
  const [introState, setIntroState] = useState('visible');

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeTimer = window.setTimeout(() => setIntroState('leaving'), reducedMotion ? 500 : 5300);
    const removeTimer = window.setTimeout(() => setIntroState('hidden'), reducedMotion ? 650 : 6000);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/startup/:startupId" element={<StartupProfile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
      {introState !== 'hidden' && (
        <div
          className={`startup-intro${introState === 'leaving' ? ' startup-intro--leaving' : ''}`}
          role="status"
          aria-label="Loading startup directory"
        >
          <div className="startup-intro__content">
            <div className="startup-intro__scene" aria-hidden="true">
              <span className="startup-intro__orbit startup-intro__orbit--outer" />
              <span className="startup-intro__scan" />
              <span className="startup-intro__pulse" />
              <span className="startup-intro__orbit startup-intro__orbit--inner" />
              <span className="startup-intro__node startup-intro__node--one" />
              <span className="startup-intro__node startup-intro__node--two" />
              <span className="startup-intro__node startup-intro__node--three" />
              <MapPin className="startup-intro__pin" strokeWidth={1.5} />
            </div>
            <p className="startup-intro__eyebrow">BENGALURU · STARTUP DIRECTORY</p>
            <h1 className="startup-intro__brand">startup<span>io</span></h1>
            <div className="startup-intro__progress" aria-hidden="true"><span /></div>
            <p className="startup-intro__caption">Mapping ideas into the city</p>
          </div>
        </div>
      )}
    </>
  );
}
