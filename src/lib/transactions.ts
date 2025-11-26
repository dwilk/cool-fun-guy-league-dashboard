import { LEAGUE_ID } from './sleeper';

const SLEEPER_API = 'https://api.sleeper.app/v1';
const MAX_WEEKS = 18;

type SleeperTransactionType =
  | 'waiver_add'
  | 'waiver_bid'
  | 'free_agent_add'
  | 'free_agent_revoke'
  | 'trade'
  | 'commissioner'
  | 'league_settings'
  | 'draft'
  | 'selly';

interface SleeperTransaction {
  type: SleeperTransactionType;
  status: string;
  week: number;
  adds?: Record<string, number>; // playerId -> rosterId
  drops?: Record<string, number>;
  roster_ids: number[];
  creator: string;
  metadata?: Record<string, any>;
}

export type AcquisitionMethod =
  | 'waiver'
  | 'free_agent'
  | 'trade'
  | 'commissioner'
  | 'draft'
  | 'unknown';

export interface PlayerAcquisition {
  playerId: string;
  rosterId: number;
  method: AcquisitionMethod;
  week: number;
  transactionType: SleeperTransactionType;
}

let acquisitionCache: Map<string, PlayerAcquisition> | null = null;
let cacheWeekCount = 0;

function mapTransactionType(type: SleeperTransactionType): AcquisitionMethod {
  switch (type) {
    case 'waiver_add':
    case 'waiver_bid':
      return 'waiver';
    case 'free_agent_add':
      return 'free_agent';
    case 'trade':
      return 'trade';
    case 'commissioner':
      return 'commissioner';
    case 'draft':
      return 'draft';
    default:
      return 'unknown';
  }
}

async function fetchTransactionsForWeek(week: number): Promise<SleeperTransaction[]> {
  const res = await fetch(`${SLEEPER_API}/league/${LEAGUE_ID}/transactions/${week}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch transactions for week ${week}`);
  }
  return res.json();
}

export async function getPlayerAcquisitionMap(currentWeek: number): Promise<Map<string, PlayerAcquisition>> {
  if (acquisitionCache && cacheWeekCount === currentWeek) {
    return acquisitionCache;
  }

  const weeksToFetch = Math.min(currentWeek || MAX_WEEKS, MAX_WEEKS);
  const weekNumbers = Array.from({ length: weeksToFetch }, (_, idx) => idx + 1);

  const transactionsByWeek = await Promise.all(
    weekNumbers.map(async (week) => {
      try {
        return await fetchTransactionsForWeek(week);
      } catch (err) {
        console.error(err);
        return [];
      }
    })
  );

  const acquisitionMap = new Map<string, PlayerAcquisition>();

  transactionsByWeek.forEach((transactions, weekIndex) => {
    const week = weekIndex + 1;
    transactions.forEach((tx) => {
      if (!tx.adds) return;
      const method = mapTransactionType(tx.type);
      Object.entries(tx.adds).forEach(([playerId, rosterId]) => {
        acquisitionMap.set(playerId, {
          playerId,
          rosterId,
          method,
          week,
          transactionType: tx.type,
        });
      });
    });
  });

  acquisitionCache = acquisitionMap;
  cacheWeekCount = currentWeek;
  return acquisitionMap;
}
