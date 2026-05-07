import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PlayerProfile from './pages/PlayerProfile';
import Champions from './pages/Champions';
import ChampionDetail from './pages/ChampionDetail';
import ProScene from './pages/ProScene';
import Meta from './pages/Meta';
import Tournaments from './pages/Tournaments';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/player/:name" element={<PlayerProfile />} />
          <Route path="/champions" element={<Champions />} />
          <Route path="/champions/:id" element={<ChampionDetail />} />
          <Route path="/pro" element={<ProScene />} />
          <Route path="/meta" element={<Meta />} />
          <Route path="/tournaments" element={<Tournaments />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
