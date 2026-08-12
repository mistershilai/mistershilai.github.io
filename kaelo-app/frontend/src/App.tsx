import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import RegionDetail from "./pages/RegionDetail";
import Optimize from "./pages/Optimize";
import Planning from "./pages/Planning";
import About from "./pages/About";
import Docs from "./pages/Docs";
import Methodology from "./pages/Methodology";
import Asclepius from "./components/Asclepius";
import FooterNames from "./components/FooterNames";
import "./App.css";

function AppContent() {
  const [solving, setSolving] = useState(false);

  // Expose setter globally so Optimize/Planning pages can toggle it
  (window as any).__setSolving = setSolving;

  return (
    <>
      {/* Animated background */}
      <div className="bg-anim" aria-hidden="true">
        <div className="bg-grid" />
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      {/* Asclepius watermark */}
      <Asclepius beating={solving} />

      {
      <nav className="navbar">
        <Link to="/" className="nav-brand">
          <img src="/logos/kaelo.png" alt="Kaelo" className="nav-logo" />
          Kaelo
        </Link>
        <div className="nav-links">
          <Link to="/">Dashboard</Link>
          <Link to="/optimize">Simulate</Link>
          <Link to="/plan">Plan</Link>
          <Link to="/methodology">Math</Link>
          <Link to="/about">About</Link>
          <Link to="/docs">Docs</Link>
        </div>
      </nav>
      }
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/region/:region" element={<RegionDetail />} />
          <Route path="/optimize" element={<Optimize />} />
          <Route path="/plan" element={<Planning />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-partners">
            <span className="footer-label">In partnership with</span>
            <div className="footer-logos">
              <a href="https://www.moh.gov.bw/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/moh.png" alt="Ministry of Health, Republic of Botswana" className="footer-logo footer-logo-invert" />
              </a>
              <a href="https://achap.org/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/achap.png" alt="ACHAP - Partnerships for a healthy Africa" className="footer-logo footer-logo-achap" />
              </a>
              <a href="https://chw.princeton.edu/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/chw.png" alt="Princeton Center for Health and Wellbeing" className="footer-logo footer-logo-chw" />
              </a>
              <a href="https://globalhealth.princeton.edu/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/ghp.png" alt="Princeton Global Health Program" className="footer-logo footer-logo-ghp" />
              </a>
            </div>
          </div>
          <div className="footer-partners">
            <span className="footer-label">Built with <span className="footer-heart">&hearts;</span> by researchers from</span>
            <div className="footer-logos">
              <a href="https://orfe.princeton.edu/" target="_blank" rel="noopener noreferrer">
                <img src="/logos/orfe.png" alt="Princeton ORFE" className="footer-logo footer-logo-orfe" />
              </a>
            </div>
          </div>
          <div className="footer-credits">
            <FooterNames />
          </div>
        </div>
      </footer>
      }
    </>
  );
}

function App() {
  return (
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
  );
}

export default App;
