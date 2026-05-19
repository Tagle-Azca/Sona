import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockChampions, mockSynergies, mockCounters } from '../data/mockData';
import { getChampionGraph } from '../services/dgraphService';
import { getChampionById } from '../services/mongoService';
import styles from './ChampionDetail.module.css';

const ABILITY_KEYS = ['passive', 'q', 'w', 'e', 'r'];
const ABILITY_LABELS = { passive: 'Pasiva', q: 'Q', w: 'W', e: 'E', r: 'R (ULT)' };

export default function ChampionDetail() {
  const { id } = useParams();
  const [champion, setChampion] = useState(null);
  const [synergies, setSynergies] = useState([]);
  const [counters, setCounters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);

    Promise.all([
      getChampionById(id),
      getChampionGraph(id).catch(() => ({ synergies: [], counters: [] })),
    ]).then(([champData, graphData]) => {
      if (!mounted) return;
      setChampion(champData || null);
      setSynergies(graphData.synergies);
      setCounters(graphData.counters);
      setLoading(false);
    })
    .catch(() => {
      if (!mounted) return;
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className={styles.notFound}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  if (!champion) {
    return (
      <div className={styles.notFound}>
        <h2>Campeón no encontrado</h2>
        <Link to="/champions" className={styles.back}>← Volver al catálogo</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/champions" className={styles.back}>← Catálogo de campeones</Link>

      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>{champion.name.slice(0, 2)}</span>
        </div>
        <div>
          <h1 className={styles.name}>{champion.name}</h1>
          <div className={styles.roles}>
            {champion.roles.map((r) => (
              <span key={r} className={`${styles.roleBadge} ${styles['role_' + r]}`}>{r}</span>
            ))}
          </div>
          <div className={styles.maxOrder}>
            <span className={styles.maxLabel}>Orden de maxeo recomendado:</span>
            {champion.recommendedMaxOrder.map((k, i) => (
              <span key={i} className={styles.maxKey}>{k}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Estadísticas Base</h2>
          <p className={styles.cardSub}>MongoDB — baseStats</p>
          <div className={styles.statsGrid}>
            <StatRow icon="fi-rr-heart" label="HP" value={champion.baseStats.hp} />
            <StatRow icon="fi-rr-sword" label="Daño base" value={champion.baseStats.ad} />
            <StatRow icon="fi-rr-shield" label="Armadura" value={champion.baseStats.armor} />
            <StatRow icon="fi-rr-bolt" label="Resistencia mágica" value={champion.baseStats.mr} />
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Habilidades</h2>
          <p className={styles.cardSub}>MongoDB — abilities</p>
          <div className={styles.abilityList}>
            {ABILITY_KEYS.map((key) => (
              <div key={key} className={styles.abilityRow}>
                <span className={`${styles.abilityKey} ${key === 'r' ? styles.abilityR : ''}`}>
                  {ABILITY_LABELS[key]}
                </span>
                <span className={styles.abilityName}>{champion.abilities[key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {synergies.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>Sinergias</h2>
            <span className={styles.edgeBadge} style={{ color: '#00d4a0', borderColor: 'rgba(0,212,160,0.25)', background: 'rgba(0,212,160,0.06)' }}>
              {champion.name} ↔ SYNERGIZES_WITH ↔ Champion
            </span>
          </div>
          <p className={styles.cardSub}>Mejores compañeros de equipo — Dgraph</p>
          <div className={styles.relGrid}>
            {synergies.map((s) => (
              <div key={s.champion} className={styles.relCard}>
                <div className={styles.relEdgePath}>
                  <span className={styles.relPathNode}>{champion.name}</span>
                  <span className={styles.relPathArrow}>↔</span>
                  <span className={styles.relPathNode}>{s.champion}</span>
                </div>
                <div className={styles.relStats}>
                  <div><span className={styles.relLabel}>Win rate</span><span className={styles.relVal} style={{ color: '#00d4a0' }}>{s.winRate}%</span></div>
                  <div><span className={styles.relLabel}>Partidas</span><span className={styles.relVal}>{s.gamesPlayed}</span></div>
                  <div><span className={styles.relLabel}>Daño comb.</span><span className={styles.relVal}>{s.avgCombinedDamage.toLocaleString()}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {counters.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>Counters recibidos</h2>
            <span className={styles.edgeBadge} style={{ color: '#e84057', borderColor: 'rgba(232,64,87,0.25)', background: 'rgba(232,64,87,0.06)' }}>
              Champion → COUNTERS → {champion.name}
            </span>
          </div>
          <p className={styles.cardSub}>Campeones que ganan en duelo directo — Dgraph</p>
          <div className={styles.relGrid}>
            {counters.map((c) => (
              <div key={c.champion} className={`${styles.relCard} ${styles.counterCard}`}>
                <div className={styles.relEdgePath}>
                  <span className={styles.relPathNode}>{c.champion}</span>
                  <span className={styles.relPathArrow} style={{ color: '#e84057' }}>→</span>
                  <span className={styles.relPathNode}>{champion.name}</span>
                </div>
                <div className={styles.relStats}>
                  <div><span className={styles.relLabel}>Win rate favor</span><span className={styles.relVal} style={{ color: '#e84057' }}>{c.winRateFavor}%</span></div>
                  <div><span className={styles.relLabel}>Matchups</span><span className={styles.relVal}>{c.matchups}</span></div>
                  <div><span className={styles.relLabel}>Posición</span><span className={styles.relVal}>{c.position}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {synergies.length === 0 && counters.length === 0 && (
        <div className={styles.card}>
          <p className={styles.noData}>Las relaciones de este campeón se calculan al procesar partidas reales — sin datos aún.</p>
        </div>
      )}
    </div>
  );
}

function StatRow({ icon, label, value }) {
  return (
    <div className={styles.statRow}>
      <i className={`fi ${icon} ${styles.statIcon}`} />
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statVal}>{value}</span>
    </div>
  );
}
