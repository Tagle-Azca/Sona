import { useParams, Link } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { mockPlayers, mockPerformance, mockRankHistory } from '../data/mockData';
import styles from './PlayerProfile.module.css';

const TIER_ORDER = { IRON: 0, BRONZE: 1, SILVER: 2, GOLD: 3, PLATINUM: 4, EMERALD: 5, DIAMOND: 6, MASTER: 7, GRANDMASTER: 8, CHALLENGER: 9 };

function lpsForChart(tier, lp) {
  return (TIER_ORDER[tier] || 7) * 100 + lp;
}

export default function PlayerProfile() {
  const { name } = useParams();
  const player = mockPlayers[name];
  const perf = player ? mockPerformance[player.puuid] : null;
  const history = player ? (mockRankHistory[player.puuid] || []) : [];

  if (!player) {
    return (
      <div className={styles.notFound}>
        <h2>Jugador no encontrado</h2>
        <p>No existe un perfil mock para <strong>{name}</strong>.</p>
        <p>Prueba con: Faker, Caps, Ruler o Chovy.</p>
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

  const [k, d, a] = perf.avgKDA.split('/').map(Number);
  const kda = d === 0 ? 'Perfect' : ((k + a) / d).toFixed(2);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.avatarText}>{player.summonerName[0]}</span>
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h1 className={styles.summonerName}>{player.summonerName}</h1>
            <span className={styles.tag}>#{player.tag}</span>
            <span className={`${styles.regionBadge} ${styles['region_' + player.region]}`}>
              {player.region}
            </span>
          </div>
          <div className={styles.metaRow}>
            <span>Nivel <strong>{player.summonerLevel}</strong></span>
            <span>PUUID: <code className={styles.code}>{player.puuid.slice(0, 18)}…</code></span>
          </div>
          <div className={styles.roleList}>
            {perf.preferredRoles.map((r) => (
              <span key={r} className={`${styles.roleBadge} ${styles['role_' + r]}`}>{r}</span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="KDA Ratio" value={kda} sub={perf.avgKDA} color="#c89b3c" />
        <StatCard label="Winrate" value={`${(perf.winrate * 100).toFixed(1)}%`} sub="Ranked Solo" color={perf.winrate >= 0.5 ? '#00d4a0' : '#e84057'} />
        <StatCard label="Daño Prom." value={perf.avgDamage.toLocaleString()} sub="por partida" color="#0bc4e3" />
        <StatCard label="CS / Min" value={perf.avgCSPerMin.toFixed(1)} sub="minions/jungle" color="#a78bfa" />
      </div>

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
          <p className={styles.cardSub}>Fuente: MongoDB — recentPerformance</p>
          <div className={styles.matchList}>
            {perf.recentPerformance.map((m) => (
              <div key={m.matchId} className={`${styles.matchRow} ${m.win ? styles.matchWin : styles.matchLoss}`}>
                <span className={m.win ? styles.winPill : styles.lossPill}>{m.win ? 'W' : 'L'}</span>
                <div className={styles.matchInfo}>
                  <span className={styles.matchKda}>{m.kda}</span>
                  <span className={styles.matchId}>{m.matchId}</span>
                </div>
                <span className={styles.matchTime}>
                  {new Date(m.timestamp).toLocaleDateString('es-MX', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
