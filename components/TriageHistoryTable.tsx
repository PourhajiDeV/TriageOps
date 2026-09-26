import React from 'react';
import { Incident } from '@/lib/types';

interface Props {
  incidents: Incident[];
  activeIncidentId: string;
  onSelect: (inc: Incident) => void;
}

export const TriageHistoryTable: React.FC<Props> = ({ incidents, activeIncidentId, onSelect }) => {
  return (
    <div className="border border-zinc-800 bg-[#0a0a0c] rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-medium">
          Recent Ingestion Runs
        </span>
        <span className="text-xs font-mono text-zinc-500">{incidents.length} events logged</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-zinc-800/80 text-zinc-500 text-[11px] bg-zinc-950/50">
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Service</th>
              <th className="py-2 px-3">Error Code</th>
              <th className="py-2 px-3">Latency</th>
              <th className="py-2 px-3 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {incidents.map((inc) => {
              const isSelected = inc.id === activeIncidentId;
              return (
                <tr
                  key={inc.id}
                  onClick={() => onSelect(inc)}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'bg-zinc-800/40 text-zinc-100' : 'hover:bg-zinc-900/40 text-zinc-400'
                  }`}
                >
                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] uppercase font-medium border ${
                        inc.status === 'resolved'
                          ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-400'
                          : inc.status === 'triaged'
                          ? 'border-amber-900/60 bg-amber-950/20 text-amber-400'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          inc.status === 'resolved'
                            ? 'bg-emerald-400'
                            : inc.status === 'triaged'
                            ? 'bg-amber-400'
                            : 'bg-zinc-400'
                        }`}
                      />
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-semibold text-zinc-200">{inc.service}</td>
                  <td className="py-2 px-3 text-zinc-300">{inc.errorCode}</td>
                  <td className="py-2 px-3 text-zinc-500">{inc.durationMs}ms</td>
                  <td className="py-2 px-3 text-right text-zinc-500">{inc.timestamp.slice(11, 19)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};