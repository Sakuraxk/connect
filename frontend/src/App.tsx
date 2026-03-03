import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomizationStudio from './pages/CustomizationStudio';
import Community from './pages/Community';
import CollaborationHub from './pages/CollaborationHub';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';

type Theme = 'theme-dreamy' | 'theme-dark' | 'theme-minimalist';

function App() {
  const [theme, setTheme] = useState<Theme>('theme-dreamy');
  const location = useLocation();

  useEffect(() => {
    // Apply theme to body
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const isCollabRoute = location.pathname === '/collab';
  const isCommunityRoute = location.pathname === '/community';
  const isProfileRoute = location.pathname === '/profile';

  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Navbar currentTheme={theme} onThemeChange={toggleTheme} />
      <main
        className={`animate-fade-in ${(!isCollabRoute && !isCommunityRoute && !isProfileRoute) ? 'container' : ''}`}
        style={{
          flex: 1,
          paddingTop: (isCollabRoute || isCommunityRoute || isProfileRoute) ? '0' : '2rem',
          paddingBottom: (isCollabRoute || isCommunityRoute || isProfileRoute) ? '0' : '4rem',
          height: (isCollabRoute || isCommunityRoute || isProfileRoute) ? 'calc(100vh - 4rem)' : 'auto', // 4rem is navbar height
          overflowY: (isCollabRoute || isCommunityRoute || isProfileRoute) ? 'auto' : 'auto'
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<CustomizationStudio />} />
          <Route path="/community" element={<Community />} />
          <Route path="/collab" element={<CollaborationHub />} />
          <Route path="/tracking" element={<OrderTracking />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
