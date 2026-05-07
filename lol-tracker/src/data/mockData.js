// Mock data matching backend schemas exactly

export const mockPlayers = {
  "Faker": {
    puuid: "puuid-faker-001",
    summonerName: "Faker",
    tag: "T1",
    profileIconId: 4362,
    summonerLevel: 532,
    region: "KR",
  },
  "Caps": {
    puuid: "puuid-caps-002",
    summonerName: "Caps",
    tag: "G2",
    profileIconId: 6201,
    summonerLevel: 487,
    region: "EUW",
  },
  "Ruler": {
    puuid: "puuid-ruler-003",
    summonerName: "Ruler",
    tag: "GEN",
    profileIconId: 5800,
    summonerLevel: 511,
    region: "KR",
  },
  "Chovy": {
    puuid: "puuid-chovy-004",
    summonerName: "Chovy",
    tag: "GEN",
    profileIconId: 4800,
    summonerLevel: 560,
    region: "KR",
  },
};

export const mockPerformance = {
  "puuid-faker-001": {
    puuid: "puuid-faker-001",
    avgKDA: "8.2/3.1/6.4",
    avgDamage: 24500.5,
    avgCSPerMin: 9.8,
    winrate: 0.68,
    preferredRoles: ["MID", "TOP"],
    recentPerformance: [
      { matchId: "KR_7001", kda: "9/2/5", win: true, timestamp: "2026-05-06T20:00:00Z" },
      { matchId: "KR_7002", kda: "11/4/8", win: true, timestamp: "2026-05-06T18:00:00Z" },
      { matchId: "KR_7003", kda: "3/5/7", win: false, timestamp: "2026-05-05T21:00:00Z" },
      { matchId: "KR_7004", kda: "14/1/6", win: true, timestamp: "2026-05-05T19:00:00Z" },
      { matchId: "KR_7005", kda: "7/3/9", win: true, timestamp: "2026-05-04T20:00:00Z" },
    ],
  },
  "puuid-caps-002": {
    puuid: "puuid-caps-002",
    avgKDA: "7.1/3.8/7.2",
    avgDamage: 22100.3,
    avgCSPerMin: 9.2,
    winrate: 0.61,
    preferredRoles: ["MID"],
    recentPerformance: [
      { matchId: "EUW_5001", kda: "8/4/6", win: true, timestamp: "2026-05-06T21:00:00Z" },
      { matchId: "EUW_5002", kda: "4/6/8", win: false, timestamp: "2026-05-06T19:00:00Z" },
      { matchId: "EUW_5003", kda: "12/2/5", win: true, timestamp: "2026-05-05T20:00:00Z" },
      { matchId: "EUW_5004", kda: "5/5/7", win: false, timestamp: "2026-05-04T22:00:00Z" },
      { matchId: "EUW_5005", kda: "10/3/8", win: true, timestamp: "2026-05-04T19:00:00Z" },
    ],
  },
  "puuid-ruler-003": {
    puuid: "puuid-ruler-003",
    avgKDA: "5.8/2.9/8.1",
    avgDamage: 28900.7,
    avgCSPerMin: 10.4,
    winrate: 0.65,
    preferredRoles: ["BOT"],
    recentPerformance: [
      { matchId: "KR_8001", kda: "6/2/9", win: true, timestamp: "2026-05-06T20:30:00Z" },
      { matchId: "KR_8002", kda: "8/3/7", win: true, timestamp: "2026-05-05T21:00:00Z" },
      { matchId: "KR_8003", kda: "4/4/8", win: false, timestamp: "2026-05-04T19:00:00Z" },
      { matchId: "KR_8004", kda: "7/2/10", win: true, timestamp: "2026-05-03T20:00:00Z" },
      { matchId: "KR_8005", kda: "3/5/6", win: false, timestamp: "2026-05-02T22:00:00Z" },
    ],
  },
  "puuid-chovy-004": {
    puuid: "puuid-chovy-004",
    avgKDA: "9.5/2.7/5.8",
    avgDamage: 26300.2,
    avgCSPerMin: 10.1,
    winrate: 0.71,
    preferredRoles: ["MID"],
    recentPerformance: [
      { matchId: "KR_9001", kda: "12/2/4", win: true, timestamp: "2026-05-06T21:00:00Z" },
      { matchId: "KR_9002", kda: "8/3/6", win: true, timestamp: "2026-05-06T19:00:00Z" },
      { matchId: "KR_9003", kda: "10/2/5", win: true, timestamp: "2026-05-05T20:00:00Z" },
      { matchId: "KR_9004", kda: "4/5/7", win: false, timestamp: "2026-05-04T21:00:00Z" },
      { matchId: "KR_9005", kda: "11/1/3", win: true, timestamp: "2026-05-03T19:00:00Z" },
    ],
  },
};

export const mockChampions = [
  {
    championId: "Ahri",
    name: "Ahri",
    roles: ["MID", "SUPPORT"],
    baseStats: { hp: "526", armor: "21", mr: "30", ad: "53" },
    abilities: { passive: "Essence Theft", q: "Orb of Deception", w: "Fox-Fire", e: "Charm", r: "Spirit Rush" },
    recommendedMaxOrder: ["Q", "E", "W"],
  },
  {
    championId: "Jinx",
    name: "Jinx",
    roles: ["BOT"],
    baseStats: { hp: "610", armor: "24", mr: "30", ad: "57" },
    abilities: { passive: "Get Excited!", q: "Switcheroo!", w: "Zap!", e: "Flame Chompers!", r: "Super Mega Death Rocket!" },
    recommendedMaxOrder: ["Q", "W", "E"],
  },
  {
    championId: "Thresh",
    name: "Thresh",
    roles: ["SUPPORT"],
    baseStats: { hp: "561", armor: "18", mr: "30", ad: "56" },
    abilities: { passive: "Damnation", q: "Death Sentence", w: "Dark Passage", e: "Flay", r: "The Box" },
    recommendedMaxOrder: ["E", "W", "Q"],
  },
  {
    championId: "Yasuo",
    name: "Yasuo",
    roles: ["MID", "TOP"],
    baseStats: { hp: "490", armor: "30", mr: "30", ad: "60" },
    abilities: { passive: "Way of the Wanderer", q: "Steel Tempest", w: "Wind Wall", e: "Sweeping Blade", r: "Last Breath" },
    recommendedMaxOrder: ["Q", "E", "W"],
  },
  {
    championId: "LeeSin",
    name: "Lee Sin",
    roles: ["JUNGLE"],
    baseStats: { hp: "615", armor: "33", mr: "32", ad: "66" },
    abilities: { passive: "Flurry", q: "Sonic Wave / Resonating Strike", w: "Safeguard / Iron Will", e: "Tempest / Cripple", r: "Dragon's Rage" },
    recommendedMaxOrder: ["Q", "W", "E"],
  },
  {
    championId: "Darius",
    name: "Darius",
    roles: ["TOP"],
    baseStats: { hp: "582", armor: "39", mr: "32", ad: "64" },
    abilities: { passive: "Hemorrhage", q: "Decimate", w: "Crippling Strike", e: "Apprehend", r: "Noxian Guillotine" },
    recommendedMaxOrder: ["Q", "E", "W"],
  },
  {
    championId: "Lux",
    name: "Lux",
    roles: ["MID", "SUPPORT"],
    baseStats: { hp: "490", armor: "18", mr: "30", ad: "53" },
    abilities: { passive: "Illumination", q: "Light Binding", w: "Prismatic Barrier", e: "Lucent Singularity", r: "Final Spark" },
    recommendedMaxOrder: ["E", "Q", "W"],
  },
  {
    championId: "Zed",
    name: "Zed",
    roles: ["MID", "JUNGLE"],
    baseStats: { hp: "584", armor: "32", mr: "32", ad: "63" },
    abilities: { passive: "Contempt for the Weak", q: "Razor Shuriken", w: "Living Shadow", e: "Shadow Slash", r: "Death Mark" },
    recommendedMaxOrder: ["Q", "E", "W"],
  },
  {
    championId: "Nautilus",
    name: "Nautilus",
    roles: ["SUPPORT", "JUNGLE"],
    baseStats: { hp: "576", armor: "41", mr: "32", ad: "57" },
    abilities: { passive: "Staggering Blow", q: "Dredge Line", w: "Titan's Wrath", e: "Riptide", r: "Depth Charge" },
    recommendedMaxOrder: ["W", "E", "Q"],
  },
  {
    championId: "Akali",
    name: "Akali",
    roles: ["MID", "TOP"],
    baseStats: { hp: "500", armor: "23", mr: "37", ad: "62" },
    abilities: { passive: "Assassin's Mark", q: "Five Point Strike", w: "Twilight Shroud", e: "Shuriken Flip", r: "Perfect Execution" },
    recommendedMaxOrder: ["Q", "E", "W"],
  },
  {
    championId: "Caitlyn",
    name: "Caitlyn",
    roles: ["BOT"],
    baseStats: { hp: "506", armor: "28", mr: "30", ad: "62" },
    abilities: { passive: "Headshot", q: "Piltover Peacemaker", w: "Yordle Snap Trap", e: "90 Caliber Net", r: "Ace in the Hole" },
    recommendedMaxOrder: ["Q", "W", "E"],
  },
  {
    championId: "Orianna",
    name: "Orianna",
    roles: ["MID"],
    baseStats: { hp: "500", armor: "18", mr: "30", ad: "50" },
    abilities: { passive: "Clockwork Windup", q: "Command: Attack", w: "Command: Dissonance", e: "Command: Protect", r: "Command: Shockwave" },
    recommendedMaxOrder: ["Q", "W", "E"],
  },
];

export const mockProTeams = [
  {
    teamId: "T1",
    name: "T1",
    region: "LCK",
    roster: [
      { proPlayerId: "pp-zeus", username: "Zeus", role: "TOP" },
      { proPlayerId: "pp-oner", username: "Oner", role: "JUNGLE" },
      { proPlayerId: "pp-faker", username: "Faker", role: "MID" },
      { proPlayerId: "pp-gumayusi", username: "Gumayusi", role: "BOT" },
      { proPlayerId: "pp-keria", username: "Keria", role: "SUPPORT" },
    ],
  },
  {
    teamId: "GEN",
    name: "Gen.G",
    region: "LCK",
    roster: [
      { proPlayerId: "pp-kiin", username: "Kiin", role: "TOP" },
      { proPlayerId: "pp-canyon", username: "Canyon", role: "JUNGLE" },
      { proPlayerId: "pp-chovy", username: "Chovy", role: "MID" },
      { proPlayerId: "pp-ruler", username: "Ruler", role: "BOT" },
      { proPlayerId: "pp-lehends", username: "Lehends", role: "SUPPORT" },
    ],
  },
  {
    teamId: "G2",
    name: "G2 Esports",
    region: "LEC",
    roster: [
      { proPlayerId: "pp-brokenblade", username: "BrokenBlade", role: "TOP" },
      { proPlayerId: "pp-jankos", username: "Jankos", role: "JUNGLE" },
      { proPlayerId: "pp-caps", username: "Caps", role: "MID" },
      { proPlayerId: "pp-hans-sama", username: "Hans Sama", role: "BOT" },
      { proPlayerId: "pp-mikyx", username: "Mikyx", role: "SUPPORT" },
    ],
  },
  {
    teamId: "FNC",
    name: "Fnatic",
    region: "LEC",
    roster: [
      { proPlayerId: "pp-oscarinin", username: "Oscarinin", role: "TOP" },
      { proPlayerId: "pp-razork", username: "Razork", role: "JUNGLE" },
      { proPlayerId: "pp-humanoid", username: "Humanoid", role: "MID" },
      { proPlayerId: "pp-noah", username: "Noah", role: "BOT" },
      { proPlayerId: "pp-jun", username: "Jun", role: "SUPPORT" },
    ],
  },
  {
    teamId: "C9",
    name: "Cloud9",
    region: "LCS",
    roster: [
      { proPlayerId: "pp-fudge", username: "Fudge", role: "TOP" },
      { proPlayerId: "pp-blaber", username: "Blaber", role: "JUNGLE" },
      { proPlayerId: "pp-jojopyun", username: "jojopyun", role: "MID" },
      { proPlayerId: "pp-berserker", username: "Berserker", role: "BOT" },
      { proPlayerId: "pp-zven", username: "Zven", role: "SUPPORT" },
    ],
  },
  {
    teamId: "EDG",
    name: "EDward Gaming",
    region: "LPL",
    roster: [
      { proPlayerId: "pp-ale", username: "Ale", role: "TOP" },
      { proPlayerId: "pp-jiejie", username: "JieJie", role: "JUNGLE" },
      { proPlayerId: "pp-scout", username: "Scout", role: "MID" },
      { proPlayerId: "pp-viper", username: "Viper", role: "BOT" },
      { proPlayerId: "pp-meiko", username: "Meiko", role: "SUPPORT" },
    ],
  },
];

// Cassandra: ranking history
export const mockRankHistory = {
  "puuid-faker-001": [
    { date: "2026-04-01", tier: "CHALLENGER", rank: "I", league_points: 1243, wins: 180, losses: 85 },
    { date: "2026-04-08", tier: "CHALLENGER", rank: "I", league_points: 1290, wins: 186, losses: 87 },
    { date: "2026-04-15", tier: "CHALLENGER", rank: "I", league_points: 1185, wins: 191, losses: 92 },
    { date: "2026-04-22", tier: "CHALLENGER", rank: "I", league_points: 1340, wins: 198, losses: 94 },
    { date: "2026-04-29", tier: "CHALLENGER", rank: "I", league_points: 1412, wins: 205, losses: 97 },
    { date: "2026-05-06", tier: "CHALLENGER", rank: "I", league_points: 1388, wins: 210, losses: 99 },
  ],
  "puuid-caps-002": [
    { date: "2026-04-01", tier: "GRANDMASTER", rank: "I", league_points: 842, wins: 140, losses: 89 },
    { date: "2026-04-08", tier: "CHALLENGER", rank: "I", league_points: 130, wins: 146, losses: 91 },
    { date: "2026-04-15", tier: "CHALLENGER", rank: "I", league_points: 280, wins: 153, losses: 95 },
    { date: "2026-04-22", tier: "GRANDMASTER", rank: "I", league_points: 920, wins: 158, losses: 100 },
    { date: "2026-04-29", tier: "CHALLENGER", rank: "I", league_points: 210, wins: 165, losses: 104 },
    { date: "2026-05-06", tier: "CHALLENGER", rank: "I", league_points: 380, wins: 170, losses: 107 },
  ],
};

// Cassandra: meta (champions per patch)
export const mockMetaByPatch = {
  "15.8": [
    { champion_id: "Ahri", global_win_rate: 52.3, global_pick_rate: 18.4, global_ban_rate: 8.1, total_games_analyzed: 145200 },
    { champion_id: "Jinx", global_win_rate: 51.8, global_pick_rate: 15.2, global_ban_rate: 6.3, total_games_analyzed: 145200 },
    { champion_id: "Yasuo", global_win_rate: 49.1, global_pick_rate: 22.7, global_ban_rate: 35.2, total_games_analyzed: 145200 },
    { champion_id: "LeeSin", global_win_rate: 50.4, global_pick_rate: 19.8, global_ban_rate: 12.4, total_games_analyzed: 145200 },
    { champion_id: "Thresh", global_win_rate: 53.1, global_pick_rate: 14.6, global_ban_rate: 9.7, total_games_analyzed: 145200 },
    { champion_id: "Darius", global_win_rate: 54.2, global_pick_rate: 16.9, global_ban_rate: 22.1, total_games_analyzed: 145200 },
    { champion_id: "Lux", global_win_rate: 50.9, global_pick_rate: 17.3, global_ban_rate: 5.8, total_games_analyzed: 145200 },
    { champion_id: "Zed", global_win_rate: 51.5, global_pick_rate: 14.1, global_ban_rate: 18.9, total_games_analyzed: 145200 },
    { champion_id: "Nautilus", global_win_rate: 52.7, global_pick_rate: 13.8, global_ban_rate: 7.4, total_games_analyzed: 145200 },
    { champion_id: "Akali", global_win_rate: 50.2, global_pick_rate: 12.5, global_ban_rate: 14.3, total_games_analyzed: 145200 },
    { champion_id: "Caitlyn", global_win_rate: 51.1, global_pick_rate: 16.7, global_ban_rate: 10.2, total_games_analyzed: 145200 },
    { champion_id: "Orianna", global_win_rate: 53.4, global_pick_rate: 11.2, global_ban_rate: 4.1, total_games_analyzed: 145200 },
  ],
};

// MongoDB: competitive patches
export const mockCompetitivePatches = [
  {
    patchId: "15.8",
    tournament: "MSI 2026",
    picks: [
      { championId: "Orianna", teamId: "T1", items: ["Luden's Tempest", "Shadowflame", "Rabadon's"], runes: ["Electrocute"], win: true },
      { championId: "Ahri", teamId: "GEN", items: ["Luden's Tempest", "Shadowflame", "Zhonya's"], runes: ["Dark Harvest"], win: false },
      { championId: "LeeSin", teamId: "T1", items: ["Goredrinker", "Ravenous Hydra"], runes: ["Conqueror"], win: true },
      { championId: "Thresh", teamId: "GEN", items: ["Locket", "Knight's Vow"], runes: ["Aftershock"], win: false },
      { championId: "Jinx", teamId: "T1", items: ["Kraken Slayer", "Runaan's Hurricane"], runes: ["Lethal Tempo"], win: true },
      { championId: "Darius", teamId: "EDG", items: ["Goredrinker", "Stridebreaker"], runes: ["Conqueror"], win: true },
      { championId: "Orianna", teamId: "EDG", items: ["Luden's Tempest", "Zhonya's"], runes: ["Phase Rush"], win: true },
      { championId: "Nautilus", teamId: "G2", items: ["Locket", "Redemption"], runes: ["Aftershock"], win: false },
      { championId: "Ahri", teamId: "G2", items: ["Luden's Tempest", "Shadowflame"], runes: ["Electrocute"], win: false },
      { championId: "Orianna", teamId: "FNC", items: ["Luden's Tempest", "Shadowflame"], runes: ["Arcane Comet"], win: true },
      { championId: "LeeSin", teamId: "GEN", items: ["Goredrinker", "Death's Dance"], runes: ["Conqueror"], win: true },
      { championId: "Caitlyn", teamId: "FNC", items: ["Kraken Slayer", "Rapid Firecannon"], runes: ["Fleet Footwork"], win: true },
    ],
  },
];

// Cassandra: tournaments
export const mockTournaments = [
  {
    tournament_id: "MSI2026",
    tournament_name: "MSI 2026",
    matches: [
      { match_id: "MSI26_001", match_date: "2026-05-02", team_a_name: "T1", team_b_name: "Gen.G", team_a_score: 3, team_b_score: 1, winner_id: "T1", stage: "Semifinals" },
      { match_id: "MSI26_002", match_date: "2026-05-02", team_a_name: "G2 Esports", team_b_name: "EDward Gaming", team_a_score: 2, team_b_score: 3, winner_id: "EDG", stage: "Semifinals" },
      { match_id: "MSI26_003", match_date: "2026-05-05", team_a_name: "T1", team_b_name: "EDward Gaming", team_a_score: 3, team_b_score: 2, winner_id: "T1", stage: "Finals" },
      { match_id: "MSI26_004", match_date: "2026-04-28", team_a_name: "Cloud9", team_b_name: "Fnatic", team_a_score: 1, team_b_score: 3, winner_id: "FNC", stage: "Quarterfinals" },
      { match_id: "MSI26_005", match_date: "2026-04-28", team_a_name: "Gen.G", team_b_name: "Fnatic", team_a_score: 3, team_b_score: 0, winner_id: "GEN", stage: "Quarterfinals" },
    ],
  },
  {
    tournament_id: "WORLDS2025",
    tournament_name: "Worlds 2025",
    matches: [
      { match_id: "W25_001", match_date: "2025-11-02", team_a_name: "T1", team_b_name: "Gen.G", team_a_score: 3, team_b_score: 2, winner_id: "T1", stage: "Finals" },
      { match_id: "W25_002", match_date: "2025-10-29", team_a_name: "Gen.G", team_b_name: "EDward Gaming", team_a_score: 3, team_b_score: 1, winner_id: "GEN", stage: "Semifinals" },
      { match_id: "W25_003", match_date: "2025-10-29", team_a_name: "T1", team_b_name: "G2 Esports", team_a_score: 3, team_b_score: 0, winner_id: "T1", stage: "Semifinals" },
    ],
  },
];

// Dgraph: champion synergies
export const mockSynergies = {
  "Jinx": [
    { champion: "Thresh", gamesPlayed: 342, winRate: 58.2, avgCombinedDamage: 52400 },
    { champion: "Nautilus", gamesPlayed: 287, winRate: 55.8, avgCombinedDamage: 48200 },
    { champion: "Lux", gamesPlayed: 201, winRate: 54.1, avgCombinedDamage: 49800 },
  ],
  "Orianna": [
    { champion: "LeeSin", gamesPlayed: 198, winRate: 61.1, avgCombinedDamage: 44100 },
    { champion: "Yasuo", gamesPlayed: 156, winRate: 57.4, avgCombinedDamage: 51200 },
  ],
};

// Dgraph: counters
export const mockCounters = {
  "Ahri": [
    { champion: "Zed", matchups: 412, winRateFavor: 54.2, avgKDADifference: 0.8, position: "MID" },
    { champion: "Yasuo", matchups: 321, winRateFavor: 56.1, avgKDADifference: 1.1, position: "MID" },
  ],
  "Yasuo": [
    { champion: "Orianna", matchups: 289, winRateFavor: 53.8, avgKDADifference: 0.5, position: "MID" },
    { champion: "Lux", matchups: 245, winRateFavor: 55.3, avgKDADifference: 0.9, position: "MID" },
  ],
};
