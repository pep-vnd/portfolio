import './styles/globals.css';
import NetworkBackground from './components/NetworkBackground/NetworkBackground';
import CustomCursor from './components/CustomCursor/CustomCursor';
import Navbar from './components/Navbar/Navbar';
import Hero from './sections/Hero/Hero';
import About from './sections/About/About';
import Projects from './sections/Projects/Projects';
import GitHubSection from './sections/GitHub/GitHubSection';
import Skills from './sections/Skills/Skills';
import Certifications from './sections/Certifications/Certifications';
import HTB from './sections/HTB/HTB';
import Journey from './sections/Journey/Journey';
import Contact from './sections/Contact/Contact';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
      {/* Skip to content for accessibility */}
      <a href="#main-content" className="visually-hidden" style={{
        position: 'absolute', top: '1rem', left: '1rem', zIndex: 9999,
        background: 'var(--accent)', color: '#050c1a', padding: '0.5rem 1rem',
        borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
        transform: 'translateY(-200%)', transition: '0.2s',
      }}
        onFocus={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        onBlur={(e) => (e.currentTarget.style.transform = 'translateY(-200%)')}
      >
        Skip to main content
      </a>

      {/* Global background — fixed, behind everything */}
      <NetworkBackground />

      {/* Custom cursor — desktop only */}
      <CustomCursor />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Certifications />
        <GitHubSection />
        <HTB />
        <Journey />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
