import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const STATS = [
  { label: 'Partidas Analizadas', value: '2.4M+', icon: '🎮' },
  { label: 'Campeones', value: '168', icon: '⚔' },
  { label: 'Pro Players', value: '500+', icon: '🏆' },
  { label: 'Regiones', value: '12', icon: '🌍' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const name = query.trim();
    if (name) navigate(`/player/${encodeURIComponent(name)}`);
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>League of Legends</p>
          <h1 className={styles.title}>
            Competition<br />
            <span className={styles.titleAccent}>Tracker</span>
          </h1>
          <p className={styles.desc}>
            Análisis multidimensional del rendimiento competitivo.<br />
            Perfiles de jugadores, meta actual, escena pro y más.
          </p>
          <form className={styles.search} onSubmit={handleSearch}>
            <input
              className={styles.searchInput}
              placeholder="Buscar invocador (ej. Faker, Caps, Ruler)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={styles.searchBtn} type="submit">
              Buscar
            </button>
          </form>
          <div className={styles.quickLinks}>
            {['Faker', 'Caps', 'Chovy', 'Ruler'].map((name) => (
              <button
                key={name}
                className={styles.quickChip}
                onClick={() => navigate(`/player/${name}`)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        {STATS.map(({ label, value, icon }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statIcon}>{icon}</span>
            <div>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sections}>
        <SectionCard
          icon="📊"
          title="Perfiles de Jugadores"
          desc="KDA promedio, winrate, roles preferidos, historial reciente y evolución de rank."
          link="/player/Faker"
          linkLabel="Ver perfil de Faker →"
        />
        <SectionCard
          icon="🗡"
          title="Catálogo de Campeones"
          desc="Stats base, habilidades, orden de maxeo recomendado y synergies competitivas."
          link="/champions"
          linkLabel="Explorar campeones →"
        />
        <SectionCard
          icon="📈"
          title="Meta Actual"
          desc="Pick rate, ban rate y win rate por campeón en el parche vigente (Cassandra)."
          link="/meta"
          linkLabel="Ver meta →"
        />
        <SectionCard
          icon="🏟"
          title="Escena Pro"
          desc="Equipos, rosters y jugadores profesionales de todas las ligas regionales."
          link="/pro"
          linkLabel="Ver equipos →"
        />
        <SectionCard
          icon="🏆"
          title="Torneos"
          desc="Resultados históricos de MSI, Worlds y torneos regionales por temporada."
          link="/tournaments"
          linkLabel="Ver resultados →"
        />
        <SectionCard
          icon="🔗"
          title="Grafo Social"
          desc="Redes de compañeros, counters entre campeones y trayectorias pro (Dgraph)."
          link="/champions/Ahri"
          linkLabel="Ver counters de Ahri →"
        />
      </div>
    </div>
  );
}

function SectionCard({ icon, title, desc, link, linkLabel }) {
  const navigate = useNavigate();
  return (
    <div className={styles.sectionCard} onClick={() => navigate(link)}>
      <div className={styles.cardIcon}>{icon}</div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
      <span className={styles.cardLink}>{linkLabel}</span>
    </div>
  );
}
