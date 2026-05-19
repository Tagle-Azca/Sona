import { mockSynergies, mockCounters, mockProTeams, mockChampions, mockPlayers } from '../data/mockData.js';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function safeFetch(url, fallback) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.data;
  } catch {
    return fallback;
  }
}

// ─── Champion ─────────────────────────────────────────────────────────────────
// One query: synergies + counters

export async function getChampionGraph(championId) {
  const data = await safeFetch(`${BASE}/api/graph/champion/${championId}`, null);
  if (data) return data;
  return {
    synergies: (mockSynergies[championId] || []),
    counters:  (mockCounters[championId]  || []),
  };
}

// ─── Player ───────────────────────────────────────────────────────────────────
// One query: mains + network

export function getPlayerOverview(puuid) {
  return safeFetch(`${BASE}/api/graph/player/${puuid}/overview`, { mains: [], network: [] });
}

// ─── Pro ──────────────────────────────────────────────────────────────────────
// One query: flat team list with rosters

export async function getProTeams() {
  const data = await safeFetch(`${BASE}/api/graph/pro/teams`, null);
  return data ?? mockProTeams;
}

// One query: career + rivalries

export function getProProfile(proPlayerId) {
  return safeFetch(`${BASE}/api/graph/pro/player/${proPlayerId}`, null);
}

// ─── Full graph ───────────────────────────────────────────────────────────────

function buildMockGraph() {
  const nodesMap = new Map();
  const links    = [];

  function node(id, name, type) {
    if (!nodesMap.has(id)) nodesMap.set(id, { id, name, type });
  }
  function link(source, target, type) {
    links.push({ source, target, type });
  }

  mockChampions.forEach((c) => node(c.championId, c.name, 'Champion'));

  Object.entries(mockSynergies).forEach(([champ, syns]) =>
    syns.forEach((s) => link(champ, s.champion, 'SYNERGIZES_WITH'))
  );
  Object.entries(mockCounters).forEach(([champ, ctrs]) =>
    ctrs.forEach((c) => link(c.champion, champ, 'COUNTERS'))
  );

  Object.values(mockPlayers).forEach((p) => node(p.puuid, p.summonerName, 'Player'));

  mockProTeams.forEach((t) => {
    const orgId = `org-${t.teamId}`;
    node(t.teamId, t.name, 'Team');
    node(orgId, `${t.name} Corp`, 'Organization');
    link(orgId, t.teamId, 'HAS_TEAM');
    t.roster.forEach((p) => {
      node(p.proPlayerId, p.username, 'ProPlayer');
      link(t.teamId, p.proPlayerId, 'HAS_PLAYER');
    });
  });

  return { nodes: [...nodesMap.values()], links };
}

export async function getFullGraph() {
  try {
    const res = await fetch(`${BASE}/api/graph/full`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return buildMockGraph();
  }
}
