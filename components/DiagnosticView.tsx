import React from 'react';
import { Incident } from '@/lib/types';
import { UnifiedDiffViewer } from './UnifiedDiffViewer';
import { AlertCircle, CheckSquare, Layers, Clock } from 'lucide-react';

interface Props {
  incident: Incident;
}

export const DiagnosticView: React.FC<Props> = ({ incident }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Root Cause & Hypothesis Card */}
      <div className="border border-zinc-800 bg-[#0a0a0c] rounded-lg p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-200">
              Root Cause Hypothesis
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Execution Time: {incident.durationMs}ms</span>
          </div>
        </div>
        <p className="text-sm text-zinc-300 leading-relaxed font-sans">
          {incident.hypothesis}
        </p>
      </div>

      {/* Frame Extraction */}
      <div className="border border-zinc-800 bg-[#0a0a0c] rounded-lg p-4">
        <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-zinc-800">
          <Layers className="w-4 h-4 text-zinc-400" />
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-200">
            Resolved Call Frames
          </h3>
        </div>
        <div className="flex flex-col divide-y divide-zinc-900 font-mono text-xs">
          {incident.stackFrames.map((frame, idx) => (
            <div key={idx} className="py-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 w-4 text-right">{idx}</span>
                <span className={frame.isInternal ? 'text-zinc-500' : 'text-zinc-200 font-semibold'}>
                  {frame.file}:{frame.line}
                </span>
                <span className="text-zinc-500 text-[11px]">in {frame.function}()</span>
              </div>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded border ${
                  frame.isInternal
                    ? 'border-zinc-800 text-zinc-600 bg-zinc-950'
                    : 'border-blue-900/50 text-blue-400 bg-blue-950/20'
                }`}
              >
                {frame.isInternal ? 'external' : 'application'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Git Patch */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
            Suggested Patch Proposal
          </span>
          <span className="text-xs text-zinc-500 font-mono">1 file changed</span>
        </div>
        <UnifiedDiffViewer targetFile={incident.patch.targetFile} diff={incident.patch.diff} />
      </div>

      {/* Prevention Checklist */}
      <div className="border border-zinc-800 bg-[#0a0a0c] rounded-lg p-4">
        <div className="flex items-center gap-2 pb-2.5 mb-2.5 border-b border-zinc-800">
          <CheckSquare className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs font-mono font-medium uppercase tracking-wider text-zinc-200">
            Verified Prevention Checklist
          </h3>
        </div>
        <ul className="space-y-2">
          {incident.preventionChecklist.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};