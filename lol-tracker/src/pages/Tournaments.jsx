import { useState } from 'react';
import { mockTournaments } from '../data/mockData';
import styles from './Tournaments.module.css';

export default function Tournaments() {
  const [selected, setSelected] = useState(mockTournaments[0].tournament_id);

  const tournament = mockTournaments.find((t) => t.tournament_id === selected);

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Torneos</h1>
      <p className={styles.pageSub}>Resultados por torneo y temporada — Cassandra</p>

      <div className={styles.tabs}>
        {mockTournaments.map((t) => (
          <button
            key={t.tournament_id}
            className={`${styles.tab} ${selected === t.tournament_id ? styles.tabActive : ''}`}
            onClick={() => setSelected(t.tournament_id)}
          >
            {t.tournament_name}
          </button>
        ))}
      </div>

      {tournament && (
        <div className={styles.content}>
          <div className={styles.matchList}>
            {groupByStage(tournament.matches).map(({ stage, matches }) => (
              <div key={stage} className={styles.stageGroup}>
                <div className={styles.stageHeader}>
                  <span className={styles.stageLabel}>{stage}</span>
                  <span className={styles.stageCount}>{matches.length} serie{matches.length !== 1 ? 's' : ''}</span>
                </div>
                {matches.map((m) => (
                  <MatchCard key={m.match_id} match={m} />
                ))}
              </div>
            ))}
          </div>

          <div className={styles.sidePanel}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoTitle}>Cassandra Schema</h3>
              <div className={styles.schemaList}>
                <div className={styles.schemaRow}><span className={styles.pk}>PK</span><span>tournament_id</span></div>
                <div className={styles.schemaRow}><span className={styles.ck}>CK</span><span>match_date, match_id</span></div>
                <div className={styles.schemaCol}><span className={styles.colKey}>Columnas</span><span>team_a_name, team_b_name,<br/>team_a_score, team_b_score,<br/>winner_id, stage</span></div>
              </div>
            </div>

            <div className={styles.statsCard}>
              <h3 className={styles.infoTitle}>Resumen del torneo</h3>
              <TournamentStats tournament={tournament} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MatchCard({ match }) {
  const aWon = match.winner_id === match.team_a_name || match.winner_id === match.team_b_name
    ? match.winner_id === (match.team_a_score > match.team_b_score ? match.team_a_name : match.team_b_name)
    : match.team_a_score > match.team_b_score;

  return (
    <div className={styles.matchCard}>
      <div className={styles.matchDate}>
        {new Date(match.match_date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
      <div className={styles.matchTeams}>
        <div className={`${styles.team} ${match.team_a_score > match.team_b_score ? styles.teamWin : styles.teamLoss}`}>
          <span className={styles.teamName}>{match.team_a_name}</span>
          <span className={styles.score}>{match.team_a_score}</span>
        </div>
        <div className={styles.vs}>vs</div>
        <div className={`${styles.team} ${styles.teamRight} ${match.team_b_score > match.team_a_score ? styles.teamWin : styles.teamLoss}`}>
          <span className={styles.score}>{match.team_b_score}</span>
          <span className={styles.teamName}>{match.team_b_name}</span>
        </div>
      </div>
      <div className={styles.matchId}>{match.match_id}</div>
    </div>
  );
}

function TournamentStats({ tournament }) {
  const teams = {};
  tournament.matches.forEach(({ team_a_name, team_b_name, winner_id }) => {
    [team_a_name, team_b_name].forEach((t) => {
      if (!teams[t]) teams[t] = { wins: 0, losses: 0 };
    });
    const winner = winner_id === team_a_name || winner_id === team_b_name ? winner_id : null;
    if (winner) teams[winner].wins++;
    const loser = winner === team_a_name ? team_b_name : team_a_name;
    if (teams[loser]) teams[loser].losses++;
  });

  return (
    <div className={styles.teamStats}>
      {Object.entries(teams).sort((a, b) => b[1].wins - a[1].wins).map(([name, { wins, losses }]) => (
        <div key={name} className={styles.teamStatRow}>
          <span className={styles.teamStatName}>{name}</span>
          <span className={styles.teamStatWins}>{wins}W</span>
          <span className={styles.teamStatLosses}>{losses}L</span>
        </div>
      ))}
    </div>
  );
}

function groupByStage(matches) {
  const STAGE_ORDER = ['Finals', 'Semifinals', 'Quarterfinals', 'Group Stage'];
  const groups = {};
  matches.forEach((m) => {
    if (!groups[m.stage]) groups[m.stage] = [];
    groups[m.stage].push(m);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => STAGE_ORDER.indexOf(a) - STAGE_ORDER.indexOf(b))
    .map(([stage, matches]) => ({ stage, matches }));
}
