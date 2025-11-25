'use client';

import Link from 'next/link';
import { getUserAvatarUrl } from '@/lib/sleeper';
import { CAP_RULES } from '@/lib/contracts';

interface CapHitData {
  salaries: number;
  buyouts: number;
  total: number;
  overSoftCap: number;
  overHardCap: number;
  capFee: number;
}

interface TeamCardProps {
  rosterId: number;
  teamName: string;
  ownerName: string;
  avatar: string | null;
  wins: number;
  losses: number;
  ties: number;
  division: number;
  playerCount: number;
  capHit: CapHitData;
}

export function TeamCard({
  rosterId,
  teamName,
  ownerName,
  avatar,
  wins,
  losses,
  ties,
  division,
  playerCount,
  capHit,
}: TeamCardProps) {
  const capPercentage = (capHit.total / CAP_RULES.HARD_CAP) * 100;
  
  // Determine cap status color
  let capStatusColor = 'bg-green-500';
  let capStatusText = 'text-green-400';
  if (capHit.total > CAP_RULES.HARD_CAP) {
    capStatusColor = 'bg-red-500';
    capStatusText = 'text-red-400';
  } else if (capHit.total > CAP_RULES.SOFT_CAP) {
    capStatusColor = 'bg-yellow-500';
    capStatusText = 'text-yellow-400';
  } else if (capHit.total > CAP_RULES.SOFT_CAP - 20) {
    capStatusColor = 'bg-yellow-500/70';
    capStatusText = 'text-yellow-400';
  }

  const record = `${wins}-${losses}${ties > 0 ? `-${ties}` : ''}`;

  return (
    <Link href={`/team/${rosterId}`}>
      <div className="group bg-dynasty-card border border-dynasty-border rounded-xl p-5 hover:border-dynasty-accent/50 transition-all duration-200 hover:shadow-lg hover:shadow-dynasty-accent/5 cursor-pointer">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {/* Avatar */}
          <div className="relative">
            <img
              src={getUserAvatarUrl(avatar)}
              alt={ownerName}
              className="w-14 h-14 rounded-full bg-dynasty-border object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(ownerName)}&background=1f2937&color=c9a227&size=56`;
              }}
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-dynasty-card border border-dynasty-border flex items-center justify-center">
              <span className="text-xs font-bold text-dynasty-silver">{division}</span>
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate group-hover:text-dynasty-accent transition-colors">
              {teamName}
            </h3>
            <p className="text-sm text-dynasty-silver truncate">@{ownerName}</p>
            <p className="text-sm font-medium text-dynasty-gold mt-1">{record}</p>
          </div>
        </div>

        {/* Cap Space Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-dynasty-silver">Cap Space</span>
            <span className={capStatusText}>
              ${capHit.total.toFixed(1)} / ${CAP_RULES.HARD_CAP}
            </span>
          </div>
          <div className="h-2 bg-dynasty-bg rounded-full overflow-hidden">
            <div
              className={`h-full ${capStatusColor} transition-all duration-300`}
              style={{ width: `${Math.min(100, capPercentage)}%` }}
            />
            {/* Soft cap marker */}
            <div
              className="absolute h-2 w-0.5 bg-dynasty-silver/50"
              style={{ left: `${(CAP_RULES.SOFT_CAP / CAP_RULES.HARD_CAP) * 100}%` }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between text-xs text-dynasty-silver">
          <span>{playerCount} players</span>
          {capHit.overSoftCap > 0 && (
            <span className="text-yellow-400">
              +${capHit.overSoftCap.toFixed(1)} over soft cap
            </span>
          )}
          {capHit.capFee > 0 && (
            <span className="text-red-400">
              ${capHit.capFee.toFixed(0)} fee
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
