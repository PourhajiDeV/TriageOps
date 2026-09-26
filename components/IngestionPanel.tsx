'use client';

import React from 'react';
import { MOCK_INCIDENTS } from '@/lib/mock-incidents';
import { Incident } from '@/lib/types';
import { Terminal, Play, RotateCcw } from 'lucide-react';

interface Props {
  currentIncident: Incident;
  onSelectPreset: (incident: Incident) => void;
  onPayloadChange: (val: string) => void;
  onRunTriage: () => void;
  isProcessing: boolean;
}

export const IngestionPanel: React.FC<Props> = ({
  currentIncident,
  onSelectPreset,
  onPayloadChange,
  onRunTriage,
  isProcessing,
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0a0a0c] border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-2.5 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <span className="text-xs font-mono font-medium text-zinc-200 uppercase tracking-wider">
            Raw Ingest Payload
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-mono">Sample Presets:</span>
          <div className="flex gap-1.5">
            {MOCK_INCIDENTS.map((inc) => (
              <button
                key={inc.id}
                onClick={() => onSelectPreset(inc)}
                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                  currentIncident.id === inc.id
                    ? 'border-zinc-500 bg-zinc-800 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                }`}
              >
                {inc.errorCode.replace('ERR_', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Editor & Metadata */}
      <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-zinc-800 min-h-[340px]">
        {/* Code Input */}
        <div className="flex-1 relative flex flex-col">
          <textarea
            value={currentIncident.rawPayload}
            onChange={(e) => onPayloadChange(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-transparent p-3 text-xs font-mono text-zinc-300 resize-none outline-none leading-relaxed placeholder-zinc-700 select-text"
            placeholder="Paste raw stack trace, syslog entry, or JSON exception payload..."
          />
        </div>

        {/* Structured Context Fields */}
        <div className="w-full md:w-64 bg-zinc-950/50 p-3.5 flex flex-col gap-3 font-mono text-xs">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Target Service
            </label>
            <input
              type="text"
              readOnly
              value={currentIncident.service}
              className="w-full bg-zinc-900/60 border border-zinc-800 px-2 py-1 text-zinc-300 rounded text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Environment
            </label>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/60 border border-zinc-800 rounded text-xs text-zinc-300">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentIncident.environment === 'production'
                    ? 'bg-rose-500'
                    : currentIncident.environment === 'staging'
                    ? 'bg-amber-500'
                    : 'bg-blue-500'
                }`}
              />
              <span>{currentIncident.environment}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Severity Level
            </label>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/60 border border-zinc-800 rounded text-xs text-zinc-300">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  currentIncident.severity === 'critical'
                    ? 'bg-rose-500'
                    : currentIncident.severity === 'degraded'
                    ? 'bg-amber-500'
                    : 'bg-zinc-400'
                }`}
              />
              <span className="uppercase">{currentIncident.severity}</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
              Ingest Timestamp
            </label>
            <div className="px-2 py-1 bg-zinc-900/60 border border-zinc-800 rounded text-[11px] text-zinc-400 truncate">
              {currentIncident.timestamp}
            </div>
          </div>

          <div className="mt-auto pt-2">
            <button
              onClick={onRunTriage}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-medium py-1.5 px-3 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Triaging Trace...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Triage</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};