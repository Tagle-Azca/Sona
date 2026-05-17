import { useState, useEffect } from 'react';
  import { useParams, Link } from 'react-router-dom';
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
   } from 'recharts';
  import { getMatchById } from '../services/mongoService';

  export default function MatchDetail() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);

    useEffect(() => {
      getMatchById(matchId).then(setMatch);
    }, [matchId]);

    if (!match) return <p>Cargando partida...</p>;

    return (
      <div style={{ padding: '2rem' }}>
        <Link to="/">← Volver</Link>
        <h1>Partida: {match.matchId}</h1>
        <p>Duración: {Math.floor(match.duration / 60)} min — Modo: {match.gameMode}</p>

        <h2>Gold por equipo</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={match.goldGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="minute" label={{ value: 'Minuto', position: 'insideBottom' }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="blueTeam" stroke="#4a90d9" name="Blue Team"
  dot={false} />
            <Line type="monotone" dataKey="redTeam" stroke="#e84057" name="Red Team" 
  dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h2>Daño por equipo</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={match.damageGraph}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="minute" label={{ value: 'Minuto', position: 'insideBottom' }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="blueTeam" stroke="#4a90d9" name="Blue Team" dot={false} />
            <Line type="monotone" dataKey="redTeam" stroke="#e84057" name="Red Team" dot={false} />
          </LineChart>
        </ResponsiveContainer>

        <h2>Participantes</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Campeón</th><th>K</th><th>D</th><th>A</th><th>CS</th><th>Daño</th><th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            {match.participants?.map((p) => (
              <tr key={p.puuid} style={{ color: p.win ? '#00d4a0' : '#e84057' }}>
                <td>{p.champion}</td>
                <td>{p.kills}</td><td>{p.deaths}</td><td>{p.assists}</td>
                <td>{p.cs}</td><td>{p.damage.toLocaleString()}</td>
                <td>{p.win ? 'Victoria' : 'Derrota'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }