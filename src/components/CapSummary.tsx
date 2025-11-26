import { CAP_RULES } from '@/lib/contracts';

interface CapSummaryProps {
  salaries: number;
  buyouts: number;
  total: number;
  overSoftCap: number;
  overHardCap: number;
  capFee: number;
}

export function CapSummary({
  salaries,
  buyouts,
  total,
  overSoftCap,
  overHardCap,
  capFee,
}: CapSummaryProps) {
  const capPercentage = (total / CAP_RULES.HARD_CAP) * 100;
  const softCapPercentage = (CAP_RULES.SOFT_CAP / CAP_RULES.HARD_CAP) * 100;

  // Determine status
  let statusColor = 'text-green-400';
  let statusBg = 'bg-green-500/10 border-green-500/20';
  let statusText = 'Under Soft Cap';
  
  if (overHardCap > 0) {
    statusColor = 'text-red-400';
    statusBg = 'bg-red-500/10 border-red-500/20';
    statusText = 'Over Hard Cap!';
  } else if (overSoftCap > 0) {
    statusColor = 'text-yellow-400';
    statusBg = 'bg-yellow-500/10 border-yellow-500/20';
    statusText = 'Over Soft Cap';
  }

  return (
    <div className="bg-dynasty-card border border-dynasty-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Salary Cap</h3>
      
      {/* Cap Bar */}
      <div className="mb-6">
        <div className="relative h-4 bg-dynasty-bg rounded-full overflow-hidden">
          {/* Progress */}
          <div
            className={`absolute h-full transition-all duration-500 ${
              overHardCap > 0 ? 'bg-red-500' : overSoftCap > 0 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, capPercentage)}%` }}
          />
          {/* Soft cap line */}
          <div
            className="absolute top-0 h-full w-0.5 bg-dynasty-silver"
            style={{ left: `${softCapPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-dynasty-silver mt-1">
          <span>$0</span>
          <span className="text-dynasty-accent">${CAP_RULES.SOFT_CAP} soft</span>
          <span>${CAP_RULES.HARD_CAP} hard</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-dynasty-silver">Player Salaries</span>
          <span className="text-white font-medium">${salaries.toFixed(1)}</span>
        </div>
        {buyouts > 0 && (
          <div className="flex justify-between">
            <span className="text-dynasty-silver">Dead Cap (Buyouts)</span>
            <span className="text-red-400 font-medium">${buyouts.toFixed(1)}</span>
          </div>
        )}
        <div className="border-t border-dynasty-border pt-3 flex justify-between">
          <span className="text-white font-semibold">Total Cap Hit</span>
          <span className={`font-bold ${statusColor}`}>${total.toFixed(1)}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className={`mt-4 px-4 py-3 rounded-lg border ${statusBg}`}>
        <div className="flex items-center justify-between">
          <span className={`font-medium ${statusColor}`}>{statusText}</span>
          {overSoftCap > 0 && (
            <span className="text-sm text-dynasty-silver">
              ${CAP_RULES.HARD_CAP - total > 0 ? (CAP_RULES.HARD_CAP - total).toFixed(1) : 0} remaining
            </span>
          )}
        </div>
        {capFee > 0 && (
          <p className="text-sm text-dynasty-silver mt-2">
            Cap Fee: <span className="text-red-400 font-medium">${capFee.toFixed(0)}</span> 
            <span className="text-dynasty-silver/60"> (${overSoftCap.toFixed(1)} × $3)</span>
          </p>
        )}
      </div>
    </div>
  );
}






