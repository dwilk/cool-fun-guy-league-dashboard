'use client';

import { useState } from 'react';
import { SleeperPlayer, getPlayerImageUrl } from '@/lib/sleeper';
import {
  PlayerContract,
  getContractTypeLabel,
  getContractTypeColor,
  calculateBuyout,
} from '@/lib/contracts';

interface RosterTableProps {
  players: Array<{
    player: SleeperPlayer | null;
    playerId: string;
    contract: PlayerContract | null;
    isStarter: boolean;
    isReserve: boolean;
    isTaxi: boolean;
  }>;
}

type SortField = 'position' | 'salary' | 'years' | 'name';
type SortDirection = 'asc' | 'desc';

const POSITION_ORDER: Record<string, number> = {
  QB: 1,
  RB: 2,
  WR: 3,
  TE: 4,
  K: 5,
  DEF: 6,
};

export function RosterTable({ players }: RosterTableProps) {
  const [sortField, setSortField] = useState<SortField>('position');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showBuyoutFor, setShowBuyoutFor] = useState<string | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPlayers = [...players].sort((a, b) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortField) {
      case 'position': {
        const posA = POSITION_ORDER[a.player?.position || 'DEF'] || 99;
        const posB = POSITION_ORDER[b.player?.position || 'DEF'] || 99;
        return (posA - posB) * direction;
      }
      case 'salary': {
        const salA = a.contract?.salary || 0;
        const salB = b.contract?.salary || 0;
        return (salB - salA) * direction; // Default high to low
      }
      case 'years': {
        const yearsA = a.contract?.yearsRemaining || 0;
        const yearsB = b.contract?.yearsRemaining || 0;
        return (yearsA - yearsB) * direction;
      }
      case 'name': {
        const nameA = a.player?.last_name || '';
        const nameB = b.player?.last_name || '';
        return nameA.localeCompare(nameB) * direction;
      }
      default:
        return 0;
    }
  });

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="px-4 py-3 text-left text-xs font-medium text-dynasty-silver uppercase tracking-wider cursor-pointer hover:text-dynasty-accent transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          <span className="text-dynasty-accent">
            {sortDirection === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );

  return (
    <div className="bg-dynasty-card border border-dynasty-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dynasty-bg">
            <tr>
              <SortHeader field="position">Pos</SortHeader>
              <SortHeader field="name">Player</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-dynasty-silver uppercase tracking-wider">
                Team
              </th>
              <SortHeader field="salary">Salary</SortHeader>
              <SortHeader field="years">Years</SortHeader>
              <th className="px-4 py-3 text-left text-xs font-medium text-dynasty-silver uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-dynasty-silver uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dynasty-border">
            {sortedPlayers.map(({ player, playerId, contract, isStarter, isReserve, isTaxi }) => {
              const buyout = contract ? calculateBuyout(contract) : null;
              const isShowingBuyout = showBuyoutFor === playerId;

              return (
                <tr
                  key={playerId}
                  className="hover:bg-dynasty-bg/50 transition-colors"
                >
                  {/* Position */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                      player?.position === 'QB' ? 'bg-red-500/20 text-red-400' :
                      player?.position === 'RB' ? 'bg-blue-500/20 text-blue-400' :
                      player?.position === 'WR' ? 'bg-green-500/20 text-green-400' :
                      player?.position === 'TE' ? 'bg-purple-500/20 text-purple-400' :
                      player?.position === 'K' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {player?.position || 'DEF'}
                    </span>
                  </td>

                  {/* Player */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={getPlayerImageUrl(playerId)}
                        alt={player?.full_name || 'Unknown'}
                        className="w-10 h-10 rounded-full bg-dynasty-border object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${player?.first_name?.[0] || '?'}${player?.last_name?.[0] || ''}&background=1f2937&color=9ca3af&size=40`;
                        }}
                      />
                      <div>
                        <p className="font-medium text-white">
                          {player?.first_name} {player?.last_name}
                        </p>
                        {player?.injury_status && (
                          <span className="text-xs text-red-400">{player.injury_status}</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Team */}
                  <td className="px-4 py-3 text-dynasty-silver">
                    {player?.team || 'FA'}
                  </td>

                  {/* Salary */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        ${contract?.salary?.toFixed(1) || '—'}
                      </span>
                      {contract && contract.yearsRemaining > 0 && (
                        <button
                          onClick={() => setShowBuyoutFor(isShowingBuyout ? null : playerId)}
                          className="text-xs text-dynasty-silver hover:text-dynasty-accent transition-colors"
                          title="Show buyout cost"
                        >
                          ⓘ
                        </button>
                      )}
                    </div>
                    {isShowingBuyout && buyout && (
                      <div className="mt-1 text-xs text-dynasty-silver bg-dynasty-bg rounded px-2 py-1">
                        Buyout: ${buyout.perYearHit}/yr × {buyout.yearsSpread} yrs
                      </div>
                    )}
                  </td>

                  {/* Years */}
                  <td className="px-4 py-3">
                    <span className="text-white">
                      {contract?.yearsRemaining || '—'}
                      <span className="text-dynasty-silver">
                        /{contract?.yearsTotal || '—'}
                      </span>
                    </span>
                  </td>

                  {/* Contract Type */}
                  <td className="px-4 py-3">
                    {contract ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getContractTypeColor(contract.type)}`}>
                        {getContractTypeLabel(contract.type)}
                      </span>
                    ) : (
                      <span className="text-dynasty-silver">—</span>
                    )}
                  </td>

                  {/* Roster Status */}
                  <td className="px-4 py-3">
                    {isStarter && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-dynasty-accent/20 text-dynasty-accent border border-dynasty-accent/30">
                        Starter
                      </span>
                    )}
                    {isReserve && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        IR
                      </span>
                    )}
                    {isTaxi && (
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        Taxi
                      </span>
                    )}
                    {!isStarter && !isReserve && !isTaxi && (
                      <span className="text-dynasty-silver text-sm">Bench</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {players.length === 0 && (
        <div className="px-6 py-12 text-center text-dynasty-silver">
          No players found
        </div>
      )}
    </div>
  );
}



