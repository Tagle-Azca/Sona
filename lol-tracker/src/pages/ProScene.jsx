import { useState } from 'react';
import { mockProTeams } from '../data/mockData';
import styles from './ProScene.module.css';

const REGIONS = ['ALL', 'LCK', 'LEC', 'LCS', 'LPL'];

const ROLE_ICON = { TOP: '🗡', JUNGLE: '🌲', MID: '✨', BOT: '🏹', SUPPORT: '🛡' };

export default function ProScene() {
  const [region, setRegion] = useState('ALL');
  const [expanded, setExpanded] = useState(null);

  const filtered = mockProTeams.filter((t) => region === 'ALL' || t.region === region);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Escena Profesional</h1>
      <p className={styles.pageSub}>Equipos y rosters activos — fuente: MongoDB + Dgraph</p>

      <div className={styles.filters}>
        {REGIONS.map((r) => (
          <button
            key={r}
            className={`${styles.filterBtn} ${region === r ? styles.filterActive : ''}`}
            onClick={() => setRegion(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className={styles.teamsGrid}>
        {filtered.map((team) => (
          <div key={team.teamId} className={styles.teamCard}>
            <div className={styles.teamHeader} onClick={() => setExpanded(expanded === team.teamId ? null : team.teamId)}>
              <div className={styles.teamLogo}>
                <span>{team.teamId.slice(0, 2)}</span>
              </div>
              <div className={styles.teamInfo}>
                <div className={styles.teamName}>{team.name}</div>
                <span className={`${styles.regionTag} ${styles['region_' + team.region]}`}>{team.region}</span>
              </div>
              <div className={styles.teamMeta}>
                <span className={styles.playerCount}>{team.roster.length} jugadores</span>
                <span className={styles.chevron}>{expanded === team.teamId ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === team.teamId && (
              <div className={styles.roster}>
                {team.roster.map((p) => (
                  <div key={p.proPlayerId} className={styles.playerRow}>
                    <span className={styles.roleIcon}>{ROLE_ICON[p.role] || '👤'}</span>
                    <span className={`${styles.playerRole} ${styles['role_' + p.role]}`}>{p.role}</span>
                    <span className={styles.playerName}>{p.username}</span>
                    <span className={styles.playerId}>{p.proPlayerId}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.infoCard}>
        <h3 className={styles.infoTitle}>Dgraph — Estructura del Grafo Competitivo</h3>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>HAS_TEAM</span>
            <span className={styles.infoDesc}>Organization → Team con role, joinDate, isActive</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>HAS_PLAYER</span>
            <span className={styles.infoDesc}>Team → ProPlayer con role, joinDate, isActive</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>PLAYED_FOR</span>
            <span className={styles.infoDesc}>Historial de traspasos: startDate, endDate, region</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>RIVAL_OF</span>
            <span className={styles.infoDesc}>Head-to-head: totalMatches, winsA, winsB, tournaments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
