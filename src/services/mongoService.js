const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function inferRegionFromTag(tagLine) {
    const tag = (tagLine || '').trim().toUpperCase();

    if (tag.startsWith('KR')) return 'kr';
    if (tag.startsWith('EUW')) return 'euw1';
    if (tag.startsWith('EUN')) return 'eun1';
    if (tag.startsWith('NA')) return 'na1';
    if (tag.startsWith('LA1') || tag.startsWith('LAN')) return 'la1';
    if (tag.startsWith('LA2') || tag.startsWith('LAS')) return 'la2';
    if (tag.startsWith('BR')) return 'br1';
    if (tag.startsWith('JP')) return 'jp1';
    if (tag.startsWith('TR')) return 'tr1';
    if (tag.startsWith('RU')) return 'ru';
    if (tag.startsWith('OC')) return 'oc1';

    return 'la1';
}

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
    return safeFetch(`${BASE}/api/champion`, []);
}

export function getChampionById(championId) {
    return safeFetch(`${BASE}/api/champion/${championId}`, null);
}

export async function syncPlayerProfile(gameName, tagLine) {
    const region = inferRegionFromTag(tagLine);
    const syncUrl = `${BASE}/api/player/profile?region=${encodeURIComponent(region)}&gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;
    const synced = await safeFetch(syncUrl, null);
    if (synced) return synced;

    const localUrl = `${BASE}/api/player/search?gameName=${encodeURIComponent(gameName)}&tagLine=${encodeURIComponent(tagLine)}`;
    return safeFetch(localUrl, null);
}

export function getMatchesByPuuid(puuid) {
    return safeFetch(`${BASE}/api/match/${puuid}`, []);
}

export function getTournamentWinrates(patchId) {
    return safeFetch(`${BASE}/api/tournament/winrates/${patchId}`, []);
}

export function getTournamentPicks(patchId) {
    return safeFetch(`${BASE}/api/tournament/picks/${patchId}`, null);
}

export function getTournamentResults(tournamentId) {
    return safeFetch(`${BASE}/api/tournament/results/${tournamentId}`, []);
}

export function getPlayerStats(puuid) {
    return safeFetch(`${BASE}/api/player/${puuid}/stats`, null);
}

export function getSettings() {
    return safeFetch(`${BASE}/api/settings`, null);
}

export async function updateSettings(id, data) {
    const res = await fetch(`${BASE}/api/settings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
}

export function getMatchById(matchId) {
    return safeFetch(`${BASE}/api/match/detail/${matchId}`, null);
}
