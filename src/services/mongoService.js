const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function safeFetch(url, fallback) {
    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json.data ?? json;
    } catch {
        return fallback;
    }
}

export function getAllChampions() {
    return safeFetch(
        `${BASE}/api/mongo/champions`, []);
};

export function getChampionById(championId) {
    return safeFetch(
        `${BASE}/api/mongo/champions/${championId}`, null);
}

export function syncPlayerProfile(gameName, tagLine) {
    return safeFetch(
        `${BASE}/api/mongo/players/profile?region=la1&gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`, null);
}

export function getMatchesByPuuid(puuid) {
    return safeFetch(`${BASE}/api/mongo/matches/${puuid}`, []);
}

export function getTournamentWinrates(patchId) {
    return safeFetch(`${BASE}/api/mongo/tournaments/winrates/${patchId}`, []);
}

export function getTournamentPicks(patchId) {
    return safeFetch(`${BASE}/api/mongo/tournaments/picks/${patchId}`, null);
}

export function getTournamentResults(tournamentId) {
    return safeFetch(`${BASE}/api/mongo/tournaments/results/${tournamentId}`, []);
}