import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockChampions } from '../data/mockData';
import { getAllChampions } from '../services/mongoService';
import styles from './Champions.module.css';

const ALL_ROLES = ['ALL', 'TOP', 'JUNGLE', 'MID', 'BOT', 'SUPPORT'];

const ROLE_STYLE = {
  TOP: { background: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '1px solid rgba(251,146,60,0.3)' },
  JUNGLE: { background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.3)' },
  MID: { background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' },
  BOT: { background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.3)' },
  SUPPORT: { background: 'rgba(244,114,182,0.15)', color: '#f472b6', border: '1px solid rgba(244,114,182,0.3)' },
};

export default function Champions() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');

  const [champions, setChampions] = useState(mockChampions);
  useEffect(() => {
    let mounted = true;
    getAllChampions().then((data) => {
      if (!mounted) return;
      if (Array.isArray(data) && data.length > 0) setChampions(data);
    }).catch(() => {
      // keep fallback mock data
    });
    return () => { mounted = false; };
  }, []);

  const filtered = champions.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchRole = role === 'ALL' || c.roles.includes(role);
    return matchSearch && matchRole;
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Catálogo de Campeones</h1>
      <p className={styles.pageSub}>Estadísticas base, habilidades y orden de maxeo — fuente: MongoDB</p>

      <div className={styles.controls}>
        <input
          className={styles.searchInput}S
          placeholder="Buscar campeón..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={styles.roleFilter}>
          {ALL_ROLES.map((r) => (
            <button
              key={r}
              className={`${styles.roleBtn} ${role === r ? styles.roleBtnActive : ''} ${r !== 'ALL' ? styles['roleColor_' + r] : ''}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className={styles.count}>{filtered.length} campeón{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>

      <div className={styles.grid}>
        {filtered.map((c) => (
          <Link to={`/champions/${c.championId}`} key={c.championId} className={styles.card}>
            <div className={styles.cardAvatar}>
              <span className={styles.cardAvatarText}>{c.name.slice(0, 2)}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardName}>{c.name}</div>
              <div className={styles.roleTags}>
                {c.roles.map((r) => (
                  <span key={r} className={styles.roleTag} data-role={r} style={ROLE_STYLE[r]}>{r}</span>
                ))}
              </div>
              <div className={styles.statsRow}>
                <span title="HP"><i className="fi fi-rr-heart" /> {c.baseStats.hp}</span>
                <span title="AD"><i className="fi fi-rr-sword" /> {c.baseStats.ad}</span>
                <span title="Armor"><i className="fi fi-rr-shield" /> {c.baseStats.armor}</span>
              </div>
              <div className={styles.maxOrder}>
                Max: {c.recommendedMaxOrder.join(' → ')}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
