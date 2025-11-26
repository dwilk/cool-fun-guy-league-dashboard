import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchLeagueData, getUserAvatarUrl } from '@/lib/sleeper';
import { Header } from '@/components/Header';
import { RosterTable } from '@/components/RosterTable';
import { CapSummary } from '@/components/CapSummary';
import { AvatarImage } from '@/components/PlayerImage';
import { calculateCapHit, getRosterContracts, CAP_RULES } from '@/lib/contracts';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ rosterId: string }>;
}

export default async function TeamPage({ params }: PageProps) {
  const { rosterId: rosterIdParam } = await params;
  const rosterId = parseInt(rosterIdParam, 10);

  if (isNaN(rosterId)) {
    notFound();
  }

  const { league, rosters, players } = await fetchLeagueData();

  const roster = rosters.find(r => r.roster_id === rosterId);
  if (!roster) {
    notFound();
  }

  // Fetch contract data (now async)
  const [contracts, capHit] = await Promise.all([
    getRosterContracts(rosterId),
    calculateCapHit(rosterId)
  ]);
  
  const contractMap = new Map(contracts.map(c => [c.playerId, c]));

  // Build player list with contract info
  const playerList = (roster.players || []).map(playerId => {
    const player = players[playerId] || null;
    const contract = contractMap.get(playerId) || null;
    const isStarter = roster.starters?.includes(playerId) || false;
    const isReserve = roster.reserve?.includes(playerId) || false;
    const isTaxi = roster.taxi?.includes(playerId) || false;

    return {
      player,
      playerId,
      contract,
      isStarter,
      isReserve,
      isTaxi,
    };
  }).sort((a, b) => {
    const aHasContract = a.contract && a.contract.acquisitionType !== 'waiver' ? 1 : 0;
    const bHasContract = b.contract && b.contract.acquisitionType !== 'waiver' ? 1 : 0;

    if (aHasContract != bHasContract) {
      return bHasContract - aHasContract;
    }

    if (a.isStarter != b.isStarter) {
      return a.isStarter ? -1 : 1;
    }

    if (a.isReserve != b.isReserve) {
      return a.isReserve ? 1 : -1;
    }

    return 0;
  });

  // Calculate contract year allocation
  const totalYearsUsed = contracts.reduce((sum, c) => sum + c.yearsRemaining, 0);
  const yearsRemaining = CAP_RULES.TOTAL_CONTRACT_YEARS - totalYearsUsed;

  // Get division name
  const divisionName = roster.settings.division === 1
    ? league.metadata?.division_1 || 'Division 1'
    : league.metadata?.division_2 || 'Division 2';

  return (
    <div className="min-h-screen bg-dynasty-bg">
      <Header leagueName={league.name} season={league.season} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-dynasty-silver hover:text-white transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Teams
        </Link>

        {/* Team Header */}
        <div className="bg-dynasty-card border border-dynasty-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <AvatarImage
              src={getUserAvatarUrl(roster.user?.avatar || null)}
              alt={roster.teamName}
              fallbackName={roster.teamName}
              className="w-24 h-24 rounded-full bg-dynasty-border object-cover ring-4 ring-dynasty-accent/20"
              size={96}
            />

            {/* Team Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {roster.teamName}
                </h1>
                <span className="text-sm px-3 py-1 rounded-full bg-dynasty-bg text-dynasty-silver">
                  {divisionName}
                </span>
              </div>
              <p className="text-dynasty-silver mb-4">
                @{roster.user?.display_name || 'Unknown Owner'}
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-dynasty-silver">Record</p>
                  <p className="text-2xl font-bold text-dynasty-gold">
                    {roster.settings.wins}-{roster.settings.losses}
                    {roster.settings.ties > 0 && `-${roster.settings.ties}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dynasty-silver">Points For</p>
                  <p className="text-2xl font-bold text-white">
                    {(roster.settings.fpts || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dynasty-silver">Points Against</p>
                  <p className="text-2xl font-bold text-dynasty-silver">
                    {(roster.settings.fpts_against || 0).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dynasty-silver">Roster Size</p>
                  <p className="text-2xl font-bold text-white">
                    {roster.players?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Roster Table */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Roster</h2>
              <RosterTable players={playerList} />
            </div>

            {/* Contract Years Info */}
            <div className="bg-dynasty-card border border-dynasty-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Contract Years</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-dynasty-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-dynasty-accent transition-all"
                      style={{ width: `${(totalYearsUsed / CAP_RULES.TOTAL_CONTRACT_YEARS) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{totalYearsUsed}</span>
                  <span className="text-dynasty-silver">/{CAP_RULES.TOTAL_CONTRACT_YEARS} years used</span>
                </div>
              </div>
              <p className="text-sm text-dynasty-silver mt-3">
                <span className="text-dynasty-accent font-medium">{yearsRemaining}</span> contract years remaining to allocate
              </p>
            </div>
          </div>

          {/* Sidebar - Cap Summary */}
          <div className="lg:col-span-1">
            <CapSummary
              salaries={capHit.salaries}
              buyouts={capHit.buyouts}
              total={capHit.total}
              overSoftCap={capHit.overSoftCap}
              overHardCap={capHit.overHardCap}
              capFee={capHit.capFee}
            />

            {/* Quick Stats */}
            <div className="bg-dynasty-card border border-dynasty-border rounded-xl p-6 mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-dynasty-silver">Active Players</span>
                  <span className="text-white font-medium">
                    {playerList.filter(p => !p.isReserve && !p.isTaxi).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dynasty-silver">On IR</span>
                  <span className="text-red-400 font-medium">
                    {roster.reserve?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dynasty-silver">Taxi Squad</span>
                  <span className="text-purple-400 font-medium">
                    {roster.taxi?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dynasty-silver">Avg Salary</span>
                  <span className="text-white font-medium">
                    ${contracts.length > 0 ? (capHit.salaries / contracts.length).toFixed(1) : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
