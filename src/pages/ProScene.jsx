import { useState, useEffect } from 'react';
import { mockProTeams } from '../data/mockData';
import { getProTeams, getProProfile } from '../services/dgraphService';
import styles from './ProScene.module.css';

const REGIONS = ['ALL', 'LCK', 'LEC', 'LCS', 'LPL'];
const ROLE_ICON = { TOP: 'fi-rr-sword', JUNGLE: 'fi-rr-leaf', MID: 'fi-rr-bolt', BOT: 'fi-rr-target', SUPPORT: 'fi-rr-shield' };

export default function ProScene() {
  const [region, setRegion]       = useState('ALL');
  const [expanded, setExpanded]   = useState(null);
  const [teams, setTeams]         = useState(mockProTeams);
  const [selectedPro, setSelectedPro] = useState(null);
  const [proCache, setProCache]   = useState({});

  useEffect(() => {
    getProTeams().then(setTeams);
  }, []);

  function handleProClick(proPlayerId) {
    if (selectedPro === proPlayerId) { setSelectedPro(null); return; }
    setSelectedPro(proPlayerId);
    if (!proCache[proPlayerId]) {
      getProProfile(proPlayerId).then((data) => {
        if (data) setProCache((prev) => ({ ...prev, [proPlayerId]: data }));
      });
    }
  }

  const filtered = teams.filter((t) => region === 'ALL' || t.region === region);

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
                {team.roster.map((p) => {
                  const isSelected = selectedPro === p.proPlayerId;
                  const profile    = proCache[p.proPlayerId];
                  return (
                    <div key={p.proPlayerId}>
                      <div
                        className={`${styles.playerRow} ${isSelected ? styles.playerRowActive : ''}`}
                        onClick={() => handleProClick(p.proPlayerId)}
                      >
                        <i className={`fi ${ROLE_ICON[p.role] || 'fi-rr-user'} ${styles.roleIcon}`} />
                        <span className={`${styles.playerRole} ${styles['role_' + p.role]}`}>{p.role}</span>
                        <span className={styles.playerName}>{p.username}</span>
                        <span className={styles.rivalHint}>ver rivalidades {isSelected ? '▲' : '▼'}</span>
                      </div>

                      {isSelected && (
                        <div className={styles.rivalSection}>
                          <div className={styles.rivalEdgeLabel}>ProPlayer ↔ RIVAL_OF ↔ ProPlayer</div>
                          {!profile && <p className={styles.rivalLoading}>Cargando...</p>}
                          {profile?.rivalries?.length === 0 && <p className={styles.rivalEmpty}>Sin rivalidades registradas aún.</p>}
                          {profile?.rivalries?.map((r) => (
                            <div key={r.proPlayerId} className={styles.rivalRow}>
                              <span className={styles.rivalName}>{r.proName}</span>
                              <div className={styles.rivalStats}>
                                <span className={styles.rivalStat}><span className={styles.relLabel}>Partidas</span> <strong>{r.totalMatches}</strong></span>
                                <span className={styles.rivalStat} style={{ color: '#00d4a0' }}><span className={styles.relLabel}>Victorias</span> <strong>{r.winsA}</strong></span>
                                <span className={styles.rivalStat} style={{ color: '#e84057' }}><span className={styles.relLabel}>Derrotas</span> <strong>{r.winsB}</strong></span>
                                {r.tournaments && <span className={styles.rivalTournaments}>{r.tournaments}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
