import { Header } from '@/components/Header';
import { fetchLeagueData } from '@/lib/sleeper';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const { league } = await fetchLeagueData();

  return (
    <div className="min-h-screen bg-dynasty-bg">
      <Header leagueName={league.name} season={league.season} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-dynasty-accent to-dynasty-gold mb-4">
            <svg className="w-8 h-8 text-dynasty-bg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Dynasty Rulebook</h1>
          <p className="text-dynasty-silver text-lg">Official league rules and regulations</p>
        </div>

        {/* Table of Contents */}
        <div className="bg-dynasty-card border border-dynasty-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: 'Salary Cap', href: '#salary-cap' },
              { title: 'Rosters & Contracts', href: '#rosters' },
              { title: 'Schedule & Playoffs', href: '#schedule' },
              { title: 'Transactions', href: '#transactions' },
              { title: 'Buyouts', href: '#buyouts' },
              { title: 'Practice Squad', href: '#practice-squad' },
              { title: 'Arbitration', href: '#arbitration' },
              { title: 'Special Rules', href: '#special-rules' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dynasty-accent hover:text-dynasty-gold transition-colors flex items-center gap-2"
              >
                <span className="text-dynasty-silver">→</span>
                {link.title}
              </a>
            ))}
          </div>
        </div>

        {/* Rules Content */}
        <div className="space-y-8">
          {/* Salary Cap */}
          <section id="salary-cap" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">💰 Salary Cap</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Cap Structure</h3>
                <ul className="space-y-2 text-dynasty-silver">
                  <li className="flex items-start gap-3">
                    <span className="text-green-400 mt-1">✓</span>
                    <span><strong className="text-white">Soft Cap:</strong> $200 (minimum payment per franchise)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-400 mt-1">✓</span>
                    <span><strong className="text-white">Hard Cap:</strong> $220 (including IR)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-yellow-400 mt-1">✓</span>
                    <span><strong className="text-white">Real Money:</strong> Any dollar spent counts toward your entry fee</span>
                  </li>
                </ul>
              </div>

              <div className="bg-dynasty-bg rounded-lg p-4">
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Cap Fees</h3>
                <p className="text-dynasty-silver mb-3">
                  For every <strong className="text-white">$1 above the soft cap</strong>, teams pay <strong className="text-red-400">$3 in real money</strong>.
                </p>
                <div className="bg-dynasty-card border border-dynasty-border rounded-lg p-4">
                  <p className="text-sm text-dynasty-accent mb-1">Example:</p>
                  <p className="text-dynasty-silver text-sm">
                    Team spends $220 → owes $200 (base) + $60 (cap fees) = <strong className="text-white">$260 total</strong>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Important Notes</h3>
                <ul className="space-y-2 text-dynasty-silver text-sm">
                  <li>• Cap fees assessed during ACTIVE WEEKS when over soft cap</li>
                  <li>• Teams will NOT be charged twice for exceeding the cap</li>
                  <li>• Exception: Trade to exceed cap, then move below before first game starts</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Rosters & Contracts */}
          <section id="rosters" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">📋 Rosters & Contracts</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Roster Requirements</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dynasty-bg rounded-lg p-4">
                    <p className="text-sm text-dynasty-silver mb-2">Starters</p>
                    <ul className="space-y-1 text-dynasty-silver text-sm">
                      <li>1 QB</li>
                      <li>2 RB</li>
                      <li>4 WR</li>
                      <li>2 TE</li>
                      <li>4 Flex</li>
                    </ul>
                    <p className="text-xs text-dynasty-silver/60 mt-2">1 QB minimum, 2 QB maximum per week</p>
                  </div>
                  <div className="bg-dynasty-bg rounded-lg p-4">
                    <p className="text-sm text-dynasty-silver mb-2">Additional</p>
                    <ul className="space-y-1 text-dynasty-silver text-sm">
                      <li>8 Bench spots</li>
                      <li>Unlimited IR</li>
                      <li>4 Taxi (practice squad)</li>
                      <li>3 QB max (active roster)</li>
                      <li>5 QB total (incl. taxi)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Contract Rules</h3>
                <ul className="space-y-2 text-dynasty-silver">
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent">→</span>
                    <span><strong className="text-white">Total Years:</strong> 40 years to allocate across all players</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent">→</span>
                    <span><strong className="text-white">Maximum Term:</strong> 5 years per player</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent">→</span>
                    <span><strong className="text-white">Minimum Cost:</strong> $1 per year</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent">→</span>
                    <span><strong className="text-white">Allocation:</strong> After auction draft, GMs allocate years as they see fit</span>
                  </li>
                </ul>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-2">Injured Reserve</h4>
                <p className="text-dynasty-silver text-sm">
                  Players eligible for IR: Red flag shows "IR, Long Term IR, Short Term IR, Out or Out Indefinitely."
                  Only players ruled out for the season can free up salary cap space pre-auction.
                </p>
              </div>
            </div>
          </section>

          {/* Schedule & Playoffs */}
          <section id="schedule" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">🏆 Schedule & Playoffs</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Regular Season</h3>
                <ul className="space-y-2 text-dynasty-silver">
                  <li><strong className="text-white">Weeks 1-13:</strong> Division games 2x, other division 1x</li>
                  <li><strong className="text-white">Week 14:</strong> League-wide battle - top 5 scoring teams earn a win</li>
                  <li><strong className="text-white">Divisions:</strong> 7 teams each (AFC West, NFC East)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Playoffs</h3>
                <div className="bg-dynasty-bg rounded-lg p-4 space-y-2 text-dynasty-silver">
                  <p>• <strong className="text-white">6 teams</strong> make playoffs</p>
                  <p>• Top 2 teams per division qualify</p>
                  <p>• Division winners receive <strong className="text-dynasty-accent">bye week</strong></p>
                  <p>• Playoff weeks: <strong className="text-white">15, 16, 17</strong></p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Payouts</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-yellow-500/20 to-dynasty-bg border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-2xl font-bold text-yellow-400">40%</p>
                    <p className="text-sm text-dynasty-silver">1st Place</p>
                  </div>
                  <div className="bg-gradient-to-br from-dynasty-silver/20 to-dynasty-bg border border-dynasty-silver/30 rounded-lg p-3">
                    <p className="text-2xl font-bold text-dynasty-silver">20%</p>
                    <p className="text-sm text-dynasty-silver">2nd Place</p>
                  </div>
                  <div className="bg-dynasty-bg border border-dynasty-border rounded-lg p-3">
                    <p className="text-xl font-bold text-dynasty-accent">10%</p>
                    <p className="text-sm text-dynasty-silver">Division Winners (5% each)</p>
                  </div>
                  <div className="bg-dynasty-bg border border-dynasty-border rounded-lg p-3">
                    <p className="text-xl font-bold text-dynasty-accent">30%</p>
                    <p className="text-sm text-dynasty-silver">Playoff Teams (5% each)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transactions */}
          <section id="transactions" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">🔄 Transactions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Transaction Fees</h3>
                <ul className="space-y-2 text-dynasty-silver">
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent">→</span>
                    <span><strong className="text-white">Trades:</strong> $3 fee per GM involved</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Waiver Pickups - The Deo Rule</h3>
                <div className="bg-dynasty-bg rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-dynasty-border">
                        <th className="text-left py-2 text-dynasty-silver">Pickups</th>
                        <th className="text-right py-2 text-dynasty-silver">Cost Per</th>
                      </tr>
                    </thead>
                    <tbody className="text-dynasty-silver">
                      <tr className="border-b border-dynasty-border/50">
                        <td className="py-2">1-8 pickups</td>
                        <td className="text-right text-green-400 font-semibold">$0</td>
                      </tr>
                      <tr className="border-b border-dynasty-border/50">
                        <td className="py-2">9-15 pickups</td>
                        <td className="text-right text-white font-semibold">$1</td>
                      </tr>
                      <tr className="border-b border-dynasty-border/50">
                        <td className="py-2">16-24 pickups</td>
                        <td className="text-right text-yellow-400 font-semibold">$3</td>
                      </tr>
                      <tr>
                        <td className="py-2">25+ pickups</td>
                        <td className="text-right text-red-400 font-semibold">$5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-dynasty-silver text-sm mt-3">
                  <strong className="text-white">Process:</strong> FAAB system, waivers processed Wednesday 10:00pm EST
                </p>
              </div>
            </div>
          </section>

          {/* Buyouts */}
          <section id="buyouts" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">💸 Buyouts</h2>
            
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-dynasty-silver">
                  <strong className="text-white">Formula:</strong> 40% of remaining contract value, spread over n+1 years (rounded up to nearest $0.5)
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Examples</h3>
                <div className="space-y-3">
                  <div className="bg-dynasty-bg border border-dynasty-border rounded-lg p-4">
                    <p className="text-sm text-dynasty-accent mb-2">Example 1: Mid-Contract Buyout</p>
                    <p className="text-dynasty-silver text-sm mb-2">
                      Player: 5 years @ $10/year, 3 years remaining when cut
                    </p>
                    <p className="text-sm">
                      <span className="text-dynasty-silver">$30 × 40% = $12 ÷ 4 years = </span>
                      <strong className="text-red-400">$3/year for 4 years</strong>
                    </p>
                  </div>

                  <div className="bg-dynasty-bg border border-dynasty-border rounded-lg p-4">
                    <p className="text-sm text-dynasty-accent mb-2">Example 2: Last Year Buyout</p>
                    <p className="text-dynasty-silver text-sm mb-2">
                      Player cut during final contract year (after draft)
                    </p>
                    <p className="text-sm">
                      <strong className="text-green-400">$0 cap hit</strong>
                      <span className="text-dynasty-silver"> - No penalty</span>
                    </p>
                  </div>

                  <div className="bg-dynasty-bg border border-dynasty-border rounded-lg p-4">
                    <p className="text-sm text-dynasty-accent mb-2">Special: $1 and $1.5 Players</p>
                    <p className="text-dynasty-silver text-sm">
                      <strong className="text-white">$0.5 per year</strong> over n+1 years buyout hit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Practice Squad */}
          <section id="practice-squad" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">🎓 Practice Squad</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Eligibility</h3>
                <ul className="space-y-2 text-dynasty-silver">
                  <li>✓ Drafted by or signed to an NFL team</li>
                  <li>✓ 17 games or fewer played in the NFL</li>
                  <li>✓ In FNFL Free Agency</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Contracts (Entry-Level)</h3>
                <div className="bg-dynasty-bg rounded-lg p-4">
                  <ul className="space-y-2 text-dynasty-silver">
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span><strong className="text-white">Term:</strong> 3 years</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span><strong className="text-white">Salary:</strong> $1 (when called up to main roster)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="text-green-400">✓</span>
                      <span><strong className="text-white">Flexibility:</strong> Move up/down freely without waivers</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Prospect Draft</h3>
                <ul className="space-y-2 text-dynasty-silver text-sm">
                  <li>• 4 rounds, held before free agent auction draft</li>
                  <li>• Draft picks are tradeable</li>
                  <li>• Bottom 4 teams enter lottery for picks 1-4</li>
                </ul>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">Guice Rule</h4>
                <p className="text-dynasty-silver text-sm">
                  Players injured before Week 1 of their rookie year have their ELC start date moved to the following year.
                  Does not apply to suspensions, retirement, or legal issues.
                </p>
              </div>
            </div>
          </section>

          {/* Arbitration */}
          <section id="arbitration" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">⚖️ Arbitration & Re-Signing</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">How It Works</h3>
                <ol className="space-y-3 text-dynasty-silver">
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent font-bold">1.</span>
                    <span>Each GM selects <strong className="text-white">5 players</strong> with expiring auction contracts for arbitration</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent font-bold">2.</span>
                    <span>League managers determine fair arbitration price based on performance, age, market value, etc.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent font-bold">3.</span>
                    <span>Each GM may <strong className="text-white">keep up to 3</strong> of their 5 arbitrated players</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-dynasty-accent font-bold">4.</span>
                    <span>Remaining players return to free agent auction draft</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-dynasty-gold mb-3">Key Rules</h3>
                <ul className="space-y-2 text-dynasty-silver">
                  <li>• Maximum term: <strong className="text-white">3 years</strong></li>
                  <li>• Players in final year of arbitration deal must return to auction</li>
                  <li>• Prospects on expiring ELCs get FREE arbitration (doesn't count toward 5 tags)</li>
                  <li>• Trading arbitrated players is allowed</li>
                  <li>• Unused tags do NOT carry over</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Special Rules */}
          <section id="special-rules" className="bg-dynasty-card border border-dynasty-border rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dynasty-border pb-3">⚡ Special Rules</h2>
            
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-red-400 font-semibold mb-2">3 Strike Rule</h3>
                <p className="text-dynasty-silver text-sm">
                  Leaving bye week/injured players in your lineup earns a strike. 
                  3 strikes = <strong className="text-white">$75 penalty</strong> to the pot. Strikes carry over and never reset.
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-blue-400 font-semibold mb-2">IF Rule</h3>
                <p className="text-dynasty-silver text-sm">
                  If a player is ruled out last minute, you can announce in GroupMe: 
                  "Start [Player B] IF [Player A] is out" before game time.
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                <h3 className="text-purple-400 font-semibold mb-2">Sam Rule (QB Limit)</h3>
                <p className="text-dynasty-silver text-sm">
                  Maximum <strong className="text-white">3 QBs on active roster</strong>, 5 total including practice squad.
                  Exception: QBs on bye or IR don't count toward limit.
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-green-400 font-semibold mb-2">Free For All Sunday</h3>
                <p className="text-dynasty-silver text-sm">
                  Players dropped within 24 hours of kickoff can be picked up freely. 
                  If the site blocks it, post your pickup in GroupMe.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-dynasty-silver text-sm">
            For questions about these rules, contact your commissioner - Rocco & Jay
          </p>
          <p className="text-dynasty-silver/60 text-xs mt-2">
            Rules subject to league vote and periodic updates
          </p>
        </div>
      </main>
    </div>
  );
}

