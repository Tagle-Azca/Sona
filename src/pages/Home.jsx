import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

const STATS = [
  { label: 'Partidas Analizadas', value: '2.4M+', icon: 'fi-rr-gamepad' },
  { label: 'Campeones', value: '172', icon: 'fi-rr-sword' },
  { label: 'Pro Players', value: '500+', icon: 'fi-rr-trophy' },
  { label: 'Regiones', value: '12', icon: 'fi-rr-globe' },
];

export default function Home() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const input = query.trim();
    if (!input) return;
    
    const [gameName, tagLine] = input.split('#');
    if (!gameName || !tagLine) {
      alert('Formato inválido. Usa: NombreJugador#TAG (ej. Faker#KR1)');
      return;
    }

    navigate(`/player/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`);
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
              placeholder="Buscar invocador (ej. Faker#KR1, Caps#EUW)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className={styles.searchBtn} type="submit">
              Buscar
            </button>
          </form>
          <div className={styles.quickLinks}>
            {[
              { gameName: 'Faker', tagLine: 'KR1' },
              { gameName: 'Caps', tagLine: 'EUW' },
              { gameName: 'Chovy', tagLine: 'KR2' },
              { gameName: 'Ruler', tagLine: 'KR4' },
            ].map(({ gameName, tagLine }) => (
              <button
                key={`${gameName}#${tagLine}`}
                className={styles.quickChip}
                onClick={() => navigate(`/player/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`)}
              >
                {gameName}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.statsBar}>
        {STATS.map(({ label, value, icon }) => (
          <div key={label} className={styles.statItem}>
            <span className={styles.statIcon}><i className={`fi ${icon}`} /></span>
            <div>
              <div className={styles.statValue}>{value}</div>
              <div className={styles.statLabel}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sections}>
        <SectionCard
          icon="fi-rr-chart-histogram"
          title="Perfiles de Jugadores"
          desc="KDA promedio, winrate, roles preferidos, historial reciente y evolución de rank."
          link="/player/Faker/KR1"
          linkLabel="Ver perfil de Faker →"
        />
        <SectionCard
          icon="fi-rr-sword"
          title="Catálogo de Campeones"
          desc="Stats base, habilidades, orden de maxeo recomendado y synergies competitivas."
          link="/champions"
          linkLabel="Explorar campeones →"
        />
        <SectionCard
          icon="fi-rr-chart-line-up"
          title="Meta Actual"
          desc="Pick rate, ban rate y win rate por campeón en el parche vigente (Cassandra)."
          link="/meta"
          linkLabel="Ver meta →"
        />
        <SectionCard
          icon="fi-rr-users"
          title="Escena Pro"
          desc="Equipos, rosters y jugadores profesionales de todas las ligas regionales."
          link="/pro"
          linkLabel="Ver equipos →"
        />
        <SectionCard
          icon="fi-rr-trophy"
          title="Torneos"
          desc="Resultados históricos de MSI, Worlds y torneos regionales por temporada."
          link="/tournaments"
          linkLabel="Ver resultados →"
        />
        <SectionCard
          icon="fi-rr-network"
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
      <div className={styles.cardIcon}><i className={`fi ${icon}`} /></div>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDesc}>{desc}</p>
      <span className={styles.cardLink}>{linkLabel}</span>
    </div>
  );
}
