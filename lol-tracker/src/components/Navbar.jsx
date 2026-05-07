import { Link, useLocation } from 'react-router-dom';
import styles from './Navbar.module.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/player/Faker', label: 'Jugador' },
  { to: '/champions', label: 'Campeones' },
  { to: '/pro', label: 'Pro Scene' },
  { to: '/meta', label: 'Meta' },
  { to: '/tournaments', label: 'Torneos' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>⚔</span>
          <span>LoL<strong>Tracker</strong></span>
        </Link>
        <ul className={styles.links}>
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`${styles.link} ${pathname === to || (to !== '/' && pathname.startsWith(to)) ? styles.active : ''}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
