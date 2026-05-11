import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockMetaByPatch, mockCompetitivePatches } from '../data/mockData';
import { getTournamentWinrates, getAllChampions } from '../services/mongoService';
import styles from './Meta.module.css';

const PATCHES = Object.keys(mockMetaByPatch);

function winColor(rate) {
  if (rate >= 53) return '#00d4a0';
  if (rate >= 51) return '#c89b3c';
  return '#e84057';
}

export default function Meta() {
  const [patch, setPatch] = useState(PATCHES[0]);
  const [sort, setSort] = useState('pick_rate');
  const [view, setView] = useState('table');
  const [mongoProStats, setMongoProStats] = useState([]);

  useEffect(() => {
    Promise.all([
      getTournamentWinrates('14.6'),
      getAllChampions(),
    ]).then(([winrateData, champData]) => {
      if (winrateData && winrateData.length > 0) {
        // Crear mapa de championId -> nombre
        const champMap = {};
        champData?.forEach(c => { champMap[c.championId] = c.name; });

        setMongoProStats(winrateData.map(w => ({
          champion: champMap[w._id] || w._id, // nombre si existe, si no el id
          picks: w.totalPicks,
          winrate: w.winrate,
        })));
      }
    });
  }, []);

  const data = [...(mockMetaByPatch[patch] || [])].sort((a, b) => b[`global_${sort}`] - a[`global_${sort}`]);
  const compData = mockCompetitivePatches.find((p) => p.patchId === patch);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Meta Tracker</h1>
      <p className={styles.pageSub}>Pick rate, ban rate y win rate por parche — Cassandra + MongoDB</p>

      <div className={styles.toolbar}>
        <div className={styles.patchSelect}>
          <span className={styles.label}>Parche:</span>
          {PATCHES.map((p) => (
            <button key={p} className={`${styles.chip} ${patch === p ? styles.chipActive : ''}`} onClick={() => setPatch(p)}>
              {p}
            </button>
          ))}
        </div>
        <div className={styles.sortSelect}>
          <span className={styles.label}>Ordenar por:</span>
          {[
            { key: 'pick_rate', label: 'Pick %' },
            { key: 'ban_rate', label: 'Ban %' },
            { key: 'win_rate', label: 'Win %' },
          ].map(({ key, label }) => (
            <button key={key} className={`${styles.chip} ${sort === key ? styles.chipActive : ''}`} onClick={() => setSort(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className={styles.viewToggle}>
          <button className={`${styles.chip} ${view === 'table' ? styles.chipActive : ''}`} onClick={() => setView('table')}>Tabla</button>
          <button className={`${styles.chip} ${view === 'chart' ? styles.chipActive : ''}`} onClick={() => setView('chart')}>Gráfica</button>
        </div>
      </div>

      {view === 'table' ? (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Campeón</th>
                <th>Win Rate</th>
                <th>Pick Rate</th>
                <th>Ban Rate</th>
                <th>Partidas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.champion_id}>
                  <td className={styles.rank}>{i + 1}</td>
                  <td className={styles.champName}>{row.champion_id}</td>
                  <td>
                    <div className={styles.rateCell}>
                      <div className={styles.rateBar} style={{ width: `${Math.min(row.global_win_rate, 60)}%`, background: winColor(row.global_win_rate) }} />
                      <span style={{ color: winColor(row.global_win_rate) }}>{row.global_win_rate}%</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.rateCell}>
                      <div className={styles.rateBar} style={{ width: `${Math.min(row.global_pick_rate * 2, 80)}%`, background: '#0bc4e3' }} />
                      <span style={{ color: '#0bc4e3' }}>{row.global_pick_rate}%</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.rateCell}>
                      <div className={styles.rateBar} style={{ width: `${Math.min(row.global_ban_rate * 1.5, 80)}%`, background: '#e84057' }} />
                      <span style={{ color: '#e84057' }}>{row.global_ban_rate}%</span>
                    </div>
                  </td>
                  <td className={styles.muted}>{row.total_games_analyzed.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.chartCard}>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 30 }}>
              <XAxis dataKey="champion_id" stroke="#4a6a8a" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" />
              <YAxis stroke="#4a6a8a" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#111d2e', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 12 }}
                formatter={(v) => [`${v}%`]}
              />
              <Bar dataKey={`global_${sort}`} radius={[4, 4, 0, 0]}>
                {data.map((row) => (
                  <Cell key={row.champion_id} fill={
                    sort === 'win_rate' ? winColor(row.global_win_rate) :
                    sort === 'ban_rate' ? '#e84057' : '#0bc4e3'
                  } />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {mongoProStats.length > 0 && (
        <div className={styles.proSection}>
          <h2 className={styles.sectionTitle}>
            Pro Play — Picks competitivos en {compData?.tournament || 'LCK_Spring_2024'}
          </h2>
          <p className={styles.sectionSub}>MongoDB — pipeline de agregación sobre competitive_patches</p>
          <div className={styles.proGrid}>
            {mongoProStats.map((s) => (
              <div key={s.champion} className={styles.proCard}>
                <div className={styles.proName}>{s.champion}</div>
                <div className={styles.proStats}>
                  <div className={styles.proStat}>
                    <span className={styles.proStatVal}>{s.picks}</span>
                    <span className={styles.proStatLabel}>Picks</span>
                  </div>
                  <div className={styles.proStat}>
                    <span className={styles.proStatVal} style={{ color: s.winrate >= 50 ? '#00d4a0' : '#e84057' }}>
                      {s.winrate.toFixed(0)}%
                    </span>
                    <span className={styles.proStatLabel}>Win Rate</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function computeProStats(picks) {
  const map = {};
  picks.forEach(({ championId, win }) => {
    if (!map[championId]) map[championId] = { picks: 0, wins: 0 };
    map[championId].picks++;
    if (win) map[championId].wins++;
  });
  return Object.entries(map)
    .map(([champion, { picks, wins }]) => ({ champion, picks, winrate: (wins / picks) * 100 }))
    .sort((a, b) => b.picks - a.picks);
}