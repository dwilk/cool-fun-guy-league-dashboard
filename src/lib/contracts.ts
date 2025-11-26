// Contract data management
// Fetches contract data from Google Sheets

export type ContractType = 'auction' | 'elc' | 'arbitration' | 'buyout';

export interface PlayerContract {
  playerId: string;
  playerName: string;
  salary: number;
  yearsTotal: number;
  yearsRemaining: number;
  signedThrough?: string;
  type: ContractType;
  acquisitionType: 'contract' | 'waiver';
  rosterId: number;
}

export interface BuyoutEntry {
  playerId: string;
  playerName: string;
  amount: number;
  yearsRemaining: number;
  originalSalary: number;
  rosterId: number;
}

export interface ContractsData {
  contracts: Record<string, PlayerContract>;
  buyouts: Record<string, BuyoutEntry>;
}

// Cap constants from the rules
export const CAP_RULES = {
  SOFT_CAP: 200,
  HARD_CAP: 220,
  SOFT_CAP_FEE_MULTIPLIER: 3, // $3 per $1 over soft cap
  BUYOUT_PERCENTAGE: 0.4, // 40% of remaining contract
  MAX_CONTRACT_YEARS: 5,
  TOTAL_CONTRACT_YEARS: 40, // Total years to allocate
  ELC_SALARY: 1, // Entry-level contract salary
  ELC_YEARS: 3, // Entry-level contract term
};

// Google Sheets published CSV URL
const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRbseCsR6jjpZIoyyDES5lbmEvoJ_fg03kSPDfpADEhvxtkWGu3I2IiiBaGwcPVE-nrQRdUR6PTlIbx/pub?gid=990176315&single=true&output=csv';

// Cache for contracts data
let contractsCache: ContractsData | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Parse CSV row (handles commas in values)
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (const char of row) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

// Fetch and parse contracts from Google Sheets
export async function fetchContractsFromSheets(): Promise<ContractsData> {
  // Return cached data if still valid
  if (contractsCache && Date.now() - cacheTime < CACHE_TTL) {
    return contractsCache;
  }

  const response = await fetch(GOOGLE_SHEETS_CSV_URL, {
    next: { revalidate: 300 } // Cache for 5 minutes
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch contracts from Google Sheets');
  }

  const csvText = await response.text();
  const lines = csvText.trim().split('\n');
  
  const contracts: Record<string, PlayerContract> = {};
  const buyouts: Record<string, BuyoutEntry> = {};

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVRow(lines[i]);
    
    const rosterId = parseInt(parts[0]);
    const playerId = parts[2];
    const firstName = parts[3];
    const lastName = parts[4];
    const signedThrough = parts[5];
    const salaryStr = parts[6]?.replace('$', '').replace(',', '').trim();
    
    if (!salaryStr || !playerId) continue;
    
    const salary = parseFloat(salaryStr);
    if (isNaN(salary)) continue;

    const playerName = `${firstName} ${lastName}`;

    // Handle buyouts (CUT players)
    if (signedThrough === 'CUT') {
      const buyoutAmount = salary <= 1.5 ? 0.5 : Math.ceil((salary * 0.4) * 2) / 2;
      buyouts[playerId] = {
        playerId,
        playerName,
        amount: buyoutAmount,
        yearsRemaining: 2,
        originalSalary: salary,
        rosterId
      };
      continue;
    }

    // Calculate years remaining
    let yearsRemaining = 1;
    if (signedThrough === '2025') {
      yearsRemaining = 1;
    } else if (signedThrough === '2026') {
      yearsRemaining = 2;
    } else if (signedThrough === '2027') {
      yearsRemaining = 3;
    } else if (signedThrough === '2028') {
      yearsRemaining = 4;
    } else if (signedThrough === '2029') {
      yearsRemaining = 5;
    }

    // Determine contract type
    let type: ContractType = 'auction';
    if (salary === 1 && yearsRemaining >= 2) {
      type = 'elc';
    }

    const acquisitionType: 'contract' | 'waiver' = signedThrough ? 'contract' : 'waiver';

    contracts[playerId] = {
      playerId,
      playerName,
      salary,
      yearsTotal: yearsRemaining,
      yearsRemaining,
      signedThrough,
      type,
      acquisitionType,
      rosterId
    };
  }

  contractsCache = { contracts, buyouts };
  cacheTime = Date.now();
  
  return contractsCache;
}

// Get contracts for a specific roster
export async function getRosterContracts(rosterId: number): Promise<PlayerContract[]> {
  const data = await fetchContractsFromSheets();
  return Object.values(data.contracts).filter(c => c.rosterId === rosterId);
}

// Get buyouts for a specific roster
export async function getRosterBuyouts(rosterId: number): Promise<BuyoutEntry[]> {
  const data = await fetchContractsFromSheets();
  return Object.values(data.buyouts).filter(b => b.rosterId === rosterId);
}

// Calculate total cap hit for a roster
export async function calculateCapHit(rosterId: number): Promise<{
  salaries: number;
  buyouts: number;
  total: number;
  overSoftCap: number;
  overHardCap: number;
  capFee: number;
}> {
  const contracts = await getRosterContracts(rosterId);
  const buyoutList = await getRosterBuyouts(rosterId);

  const salaries = contracts.reduce((sum, c) => sum + c.salary, 0);
  const buyoutHit = buyoutList.reduce((sum, b) => sum + b.amount, 0);
  const total = salaries + buyoutHit;

  const overSoftCap = Math.max(0, total - CAP_RULES.SOFT_CAP);
  const overHardCap = Math.max(0, total - CAP_RULES.HARD_CAP);
  const capFee = overSoftCap * CAP_RULES.SOFT_CAP_FEE_MULTIPLIER;

  return {
    salaries,
    buyouts: buyoutHit,
    total,
    overSoftCap,
    overHardCap,
    capFee,
  };
}

// Calculate buyout cost for a player
export function calculateBuyout(contract: PlayerContract): {
  totalPenalty: number;
  yearsSpread: number;
  perYearHit: number;
} {
  // Special case for $1 and $1.5 players
  if (contract.salary <= 1.5) {
    return {
      totalPenalty: 0.5 * (contract.yearsRemaining + 1),
      yearsSpread: contract.yearsRemaining + 1,
      perYearHit: 0.5,
    };
  }

  const remainingValue = contract.salary * contract.yearsRemaining;
  const totalPenalty = remainingValue * CAP_RULES.BUYOUT_PERCENTAGE;
  const yearsSpread = contract.yearsRemaining + 1;
  
  // Round up to nearest 0.5
  const perYearHit = Math.ceil((totalPenalty / yearsSpread) * 2) / 2;

  return {
    totalPenalty,
    yearsSpread,
    perYearHit,
  };
}

// Get contract type display label
export function getContractTypeLabel(type: ContractType): string {
  switch (type) {
    case 'auction': return 'Auction';
    case 'elc': return 'ELC';
    case 'arbitration': return 'Arb';
    case 'buyout': return 'Buyout';
    default: return type;
  }
}

// Get contract type color class
export function getContractTypeColor(type: ContractType): string {
  switch (type) {
    case 'auction': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'elc': return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'arbitration': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'buyout': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}
