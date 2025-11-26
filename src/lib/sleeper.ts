// Sleeper API client for fetching league data

const SLEEPER_API = 'https://api.sleeper.app/v1';
const SLEEPER_CDN = 'https://sleepercdn.com';

export const LEAGUE_ID = '1257434648649146369';

// Types
export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string | null;
  metadata?: {
    team_name?: string;
  };
  is_owner?: boolean;
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  players: string[];
  starters: string[];
  reserve: string[] | null;
  taxi: string[] | null;
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_decimal?: number;
    fpts_against?: number;
    fpts_against_decimal?: number;
    division?: number;
  };
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  status: string;
  season: string;
  total_rosters: number;
  roster_positions: string[];
  settings: {
    divisions?: number;
  };
  metadata?: {
    division_1?: string;
    division_2?: string;
  };
}

export interface SleeperPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  position: string;
  team: string | null;
  age?: number;
  years_exp?: number;
  status?: string;
  injury_status?: string;
}

// Fetch functions
export async function fetchLeague(): Promise<SleeperLeague> {
  const res = await fetch(`${SLEEPER_API}/league/${LEAGUE_ID}`, {
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  if (!res.ok) throw new Error('Failed to fetch league');
  return res.json();
}

export async function fetchUsers(): Promise<SleeperUser[]> {
  const res = await fetch(`${SLEEPER_API}/league/${LEAGUE_ID}/users`, {
    next: { revalidate: 300 }
  });
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function fetchRosters(): Promise<SleeperRoster[]> {
  const res = await fetch(`${SLEEPER_API}/league/${LEAGUE_ID}/rosters`, {
    next: { revalidate: 60 } // Cache for 1 minute (rosters change more often)
  });
  if (!res.ok) throw new Error('Failed to fetch rosters');
  return res.json();
}

// Player data is large (~5MB) - we'll cache it more aggressively
let playersCache: Record<string, SleeperPlayer> | null = null;
let playersCacheTime = 0;
const PLAYERS_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function fetchPlayers(): Promise<Record<string, SleeperPlayer>> {
  // Return cached data if still valid
  if (playersCache && Date.now() - playersCacheTime < PLAYERS_CACHE_TTL) {
    return playersCache;
  }

  const res = await fetch(`${SLEEPER_API}/players/nfl`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  if (!res.ok) throw new Error('Failed to fetch players');
  
  playersCache = await res.json();
  playersCacheTime = Date.now();
  return playersCache!;
}

// Helper to get player headshot URL
export function getPlayerImageUrl(playerId: string): string {
  return `${SLEEPER_CDN}/content/nfl/players/${playerId}.jpg`;
}

// Helper to get team logo URL
export function getTeamLogoUrl(team: string): string {
  return `${SLEEPER_CDN}/images/team_logos/nfl/${team.toLowerCase()}.png`;
}

// Helper to get user avatar URL
export function getUserAvatarUrl(avatarId: string | null): string {
  if (!avatarId) return '/default-avatar.png';
  return `${SLEEPER_CDN}/avatars/${avatarId}`;
}

// Fetch all league data at once
export async function fetchLeagueData() {
  const [league, users, rosters, players] = await Promise.all([
    fetchLeague(),
    fetchUsers(),
    fetchRosters(),
    fetchPlayers(),
  ]);

  // Create user lookup by user_id
  const userMap = new Map(users.map(u => [u.user_id, u]));

  // Enrich rosters with user data
  const enrichedRosters = rosters.map(roster => {
    const user = userMap.get(roster.owner_id);
    return {
      ...roster,
      user,
      teamName: user?.metadata?.team_name || user?.display_name || 'Unknown Team',
    };
  });

  return {
    league,
    users,
    rosters: enrichedRosters,
    players,
  };
}






