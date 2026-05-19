import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { mockPerformance, mockRankHistory } from '../data/mockData';
import { getPlayerOverview } from '../services/dgraphService';
import { syncPlayerProfile, getMatchesByPuuid, getPlayerStats } from '../services/mongoService';
import styles from './PlayerProfile.module.css';

const TIER_ORDER = { IRON: 0, BRONZE: 1, SILVER: 2, GOLD: 3, PLATINUM: 4, EMERALD: 5, DIAMOND: 6, MASTER: 7, GRANDMASTER: 8, CHALLENGER: 9 };

function lpsForChart(tier, lp) {
  return (TIER_ORDER[tier] || 7) * 100 + lp;
}

export default function PlayerProfile() {
  const { gameName, tagLine } = useParams();
  const [player, setPlayer]   = useState(null);
  const [matches, setMatches] = useState([]);
  const [mains, setMains]       = useState([]);
  const [network, setNetwork]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState(null);

  useEffect(() => {
    if (!gameName || !tagLine) return;
    let mounted = true;

    syncPlayerProfile(gameName, tagLine).then((playerData) => {
      if (!mounted) return;
      setPlayer(playerData || null);
      setLoading(false);

      if (!playerData?.puuid) return;

      // puuid ya disponible — lanzar las 3 queries en paralelo
      Promise.all([
        getMatchesByPuuid(playerData.puuid),
        getPlayerOverview(playerData.puuid).catch(() => ({ mains: [], network: [] })),
      ]).then(([matchData, graphData]) => {
        if (!mounted) return;
        setMatches(matchData || []);
        setMains(graphData.mains || []);
        setNetwork(graphData.network || []);
      });

      // segundo fetch de partidas tras 3s para capturar las que aún se sincronizan
      setTimeout(() => {
        if (!mounted) return;
        getMatchesByPuuid(playerData.puuid).then(setMatches);
        getPlayerStats(playerData.puuid).then((raw) => {
          if (!mounted || !raw?.[0]) return;
          setStats(raw[0].stats?.[0] ?? null);
        });
      }, 3000);
    }).catch(() => {
      if (!mounted) return;
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [gameName, tagLine]);

  const history = player ? (mockRankHistory[player.puuid] || mockRankHistory['default'] || []) : [];

  if (loading) {
    return (
      <div className={styles.notFound}>
        <h2>Buscando perfil...</h2>
      </div>
    );
  }

  if (!player) {
    return (
      <div className={styles.notFound}>
        <h2>Jugador no encontrado</h2>
        <p>No se encontró el perfil de <strong>{gameName}#{tagLine}</strong>.</p>
        <p>Verifica que el nombre y tag sean correctos.</p>
        <Link to="/" className={styles.backLink}>← Volver al inicio</Link>
      </div>
    );
  }

  const chartData = history.map((h) => ({
    date: h.date.slice(5),
    LP: lpsForChart(h.tier, h.league_points),
    tier: h.tier,
    lp: h.league_points,
    label: `${h.tier.slice(0, 2)} ${h.league_points}LP`,
  }));

  const kda = stats?.avgKDA?.toFixed(2) ?? '—';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>{player.summonerName?.[0] || '?'}</span>
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h1 className={styles.summonerName}>{player.summonerName}</h1>
            <span className={styles.tag}>#{player.tag}</span>
            <span className={`${styles.regionBadge} ${styles['region_' + player.region]}`}>
              {player.region?.toUpperCase()}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span>Nivel <strong>{player.summonerLevel}</strong></span>
            <span>PUUID: <code className={styles.code}>{player.puuid?.slice(0, 18)}…</code></span>
          </div>
          {stats && (
            <div className={styles.roleList}>
              {stats?.preferredRoles?.map((r) => (
                <span key={r} className={`${styles.roleBadge} ${styles['role_' + r]}`}>{r}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats && (
        <div className={styles.statsGrid}>
          <StatCard label="KDA Ratio" value={kda} sub="por partida" color="#c89b3c" />
          <StatCard label="Winrate" value={`${(stats.winrate * 100).toFixed(1)}%`} sub="Ranked Solo" color={stats.winrate >= 0.5 ? '#00d4a0' : '#e84057'} />
          <StatCard label="Daño Prom." value={(stats.avgDamage ?? 0).toLocaleString()} sub="por partida" color="#0bc4e3" />
          <StatCard label="CS / Min" value={(stats.avgCSPerMin ?? 0).toFixed(1)} sub="minions/jungle" color="#a78bfa" />
        </div>
      )}

      <div className={styles.twoCol}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Evolución de Rank</h2>
          <p className={styles.cardSub}>Últimas 6 semanas — fuente: Cassandra</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                <XAxis dataKey="date" stroke="#4a6a8a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#4a6a8a" tick={{ fontSize: 11 }} tickFormatter={(v) => v > 900 ? 'CH' : v > 800 ? 'GM' : `${v}LP`} />
                <Tooltip
                  contentStyle={{ background: '#111d2e', border: '1px solid #1e3a5f', borderRadius: 6, fontSize: 12 }}
                  labelStyle={{ color: '#7fa2c8' }}
                  formatter={(v, n, props) => [props.payload.label, 'Rank']}
                />
                <Line type="monotone" dataKey="LP" stroke="#c89b3c" strokeWidth={2.5} dot={{ fill: '#c89b3c', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className={styles.empty}>Sin historial disponible.</p>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Partidas Recientes</h2>
          <p className={styles.cardSub}>Fuente: MongoDB — matches</p>
          {matches.length > 0 ? (
            <div className={styles.matchList}>
              {matches.map((m) => {
                const me = m.participants?.find(p => p.puuid === player.puuid);
                  return (
                    <Link key={m.matchId} to={`/match/${m.matchId}`} style={{ textDecoration: 'none' }}>
                      <div className={`${styles.matchRow} ${me?.win ? styles.matchWin : styles.matchLoss}`}>
                          <span className={me?.win ? styles.winPill : styles.lossPill}>{me?.win ? 'W' : 'L'}</span>
                          <div className={styles.matchInfo}>
                              <span className={styles.matchKda}>{me?.champion} — {me?.kills}/{me?.deaths}/{me?.assists}</span>
                              <span className={styles.matchId}>{m.gameMode}</span>
                          </div>
                          <span className={styles.matchTime}>
                              {new Date(m.createdAt).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                          </span>
                      </div>
                    </Link>
                  );
              })}
            </div>
          ) : (
            <p className={styles.empty}>Sin partidas recientes.</p>
          )}
        </div>
      </div>

      {mains.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>Pool de Campeones</h2>
            <span className={styles.edgeBadge}>Player → MAINS → Champion</span>
          </div>
          <p className={styles.cardSub}>Campeones más jugados por {player.summonerName} — Dgraph</p>
          <div className={styles.mainsGrid}>
            {mains.map((m) => (
              <div key={m.championId} className={styles.mainCard}>
                <div className={styles.mainRank}>{m.rank}</div>
                <div className={styles.mainName}>{m.name}</div>
                <div className={styles.mainStats}>
                  <div><span className={styles.relLabel}>Partidas</span><span className={styles.relVal}>{m.gamesPlayed}</span></div>
                  <div><span className={styles.relLabel}>Win rate</span><span className={styles.relVal} style={{ color: m.winRate >= 0.5 ? '#00d4a0' : '#e84057' }}>{(m.winRate * 100).toFixed(0)}%</span></div>
                  <div><span className={styles.relLabel}>KDA</span><span className={styles.relVal}>{m.avgKDA}</span></div>
                  <div><span className={styles.relLabel}>CS/min</span><span className={styles.relVal}>{m.avgCSPerMin}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {network.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardTitleRow}>
            <h2 className={styles.cardTitle}>Red de Duo</h2>
            <span className={styles.edgeBadge}>Player ↔ PLAYED_WITH ↔ Player</span>
          </div>
          <p className={styles.cardSub}>Jugadores con quienes {player.summonerName} suele jugar — Dgraph</p>
          <div className={styles.networkGrid}>
            {network.map((p) => (
              <div key={p.puuid} className={styles.networkCard}>
                <div className={styles.networkHeader}>
                  <div className={styles.networkAvatar}>{p.summonerName?.[0] || '?'}</div>
                  <div>
                    <div className={styles.networkName}>{p.summonerName}</div>
                    <div className={styles.networkRegion}>{p.region?.toUpperCase()}</div>
                  </div>
                </div>
                <div className={styles.networkStats}>
                  <div><span className={styles.relLabel}>Partidas</span><span className={styles.relVal}>{p.gamesShared}</span></div>
                  <div><span className={styles.relLabel}>Victorias</span><span className={styles.relVal} style={{ color: '#00d4a0' }}>{p.wins}</span></div>
                  <div><span className={styles.relLabel}>Derrotas</span><span className={styles.relVal} style={{ color: '#e84057' }}>{p.losses}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statValue} style={{ color }}>{value}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSub}>{sub}</div>
    </div>
  );
}