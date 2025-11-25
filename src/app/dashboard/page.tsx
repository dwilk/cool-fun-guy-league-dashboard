import { fetchLeagueData } from '@/lib/sleeper';
import { calculateCapHit } from '@/lib/contracts';
import { Header } from '@/components/Header';
import { TeamCard } from '@/components/TeamCard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { league, rosters } = await fetchLeagueData();

  // Fetch cap hit data for all rosters
  const capHitsPromises = rosters.map(r => calculateCapHit(r.roster_id));
  const capHitsArray = await Promise.all(capHitsPromises);
  const capHitsMap = new Map(rosters.map((r, i) => [r.roster_id, capHitsArray[i]]));

  // Group rosters by division
  const division1Name = league.metadata?.division_1 || 'Division 1';
  const division2Name = league.metadata?.division_2 || 'Division 2';

  const division1Teams = rosters.filter(r => r.settings.division === 1);
  const division2Teams = rosters.filter(r => r.settings.division === 2);

  // Sort each division by wins (descending)
  const sortByWins = (a: typeof rosters[0], b: typeof rosters[0]) => {
    const aWins = a.settings.wins || 0;
    const bWins = b.settings.wins || 0;
    if (bWins !== aWins) return bWins - aWins;
    return (b.settings.fpts || 0) - (a.settings.fpts || 0);
  };

  division1Teams.sort(sortByWins);
  division2Teams.sort(sortByWins);

  return (
    <div className="min-h-screen bg-dynasty-bg">
      <Header leagueName={league.name} season={league.season} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* League Stats Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Team Overview</h2>
              <p className="text-dynasty-silver mt-1">
                {league.total_rosters} teams • {league.season} Season
              </p>
            </div>
            <div className="text-right text-sm text-dynasty-silver">
              <p>Soft Cap: <span className="text-dynasty-accent font-medium">$200</span></p>
              <p>Hard Cap: <span className="text-white font-medium">$220</span></p>
            </div>
          </div>
        </div>

        {/* Division Sections */}
        <div className="space-y-10">
          {/* Division 1 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">{division1Name}</h3>
              <span className="text-sm text-dynasty-silver bg-dynasty-card px-3 py-1 rounded-full">
                {division1Teams.length} teams
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {division1Teams.map((roster) => (
                <TeamCard
                  key={roster.roster_id}
                  rosterId={roster.roster_id}
                  teamName={roster.teamName}
                  ownerName={roster.user?.display_name || 'Unknown'}
                  avatar={roster.user?.avatar || null}
                  wins={roster.settings.wins || 0}
                  losses={roster.settings.losses || 0}
                  ties={roster.settings.ties || 0}
                  division={roster.settings.division || 1}
                  playerCount={roster.players?.length || 0}
                  capHit={capHitsMap.get(roster.roster_id) || { salaries: 0, buyouts: 0, total: 0, overSoftCap: 0, overHardCap: 0, capFee: 0 }}
                />
              ))}
            </div>
          </section>

          {/* Division 2 */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-semibold text-white">{division2Name}</h3>
              <span className="text-sm text-dynasty-silver bg-dynasty-card px-3 py-1 rounded-full">
                {division2Teams.length} teams
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {division2Teams.map((roster) => (
                <TeamCard
                  key={roster.roster_id}
                  rosterId={roster.roster_id}
                  teamName={roster.teamName}
                  ownerName={roster.user?.display_name || 'Unknown'}
                  avatar={roster.user?.avatar || null}
                  wins={roster.settings.wins || 0}
                  losses={roster.settings.losses || 0}
                  ties={roster.settings.ties || 0}
                  division={roster.settings.division || 2}
                  playerCount={roster.players?.length || 0}
                  capHit={capHitsMap.get(roster.roster_id) || { salaries: 0, buyouts: 0, total: 0, overSoftCap: 0, overHardCap: 0, capFee: 0 }}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-dynasty-border text-center text-sm text-dynasty-silver">
          <p>Cool Fun Guy League Dashboard</p>
          <p className="mt-1 text-dynasty-silver/60">
            Data from Sleeper API • Contract data from Google Sheets
          </p>
        </footer>
      </main>
    </div>
  );
}
