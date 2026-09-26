'use client';

import React, { useState } from 'react';
import { MOCK_INCIDENTS } from '@/lib/mock-incidents';
import { Incident } from '@/lib/types';
import { IngestionPanel } from '@/components/IngestionPanel';
import { DiagnosticView } from '@/components/DiagnosticView';
import { TriageHistoryTable } from '@/components/TriageHistoryTable';
import { Activity, ShieldCheck, Database, Radio } from 'lucide-react';

export default function DashboardPage() {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [currentIncident, setCurrentIncident] = useState<Incident>(MOCK_INCIDENTS[0]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPreset = (preset: Incident) => {
    setCurrentIncident(preset);
  };

  const handlePayloadChange = (val: string) => {
    setCurrentIncident((prev) => ({
      ...prev,
      rawPayload: val,
    }));
  };

  const handleRunTriage = () => {
    setIsProcessing(true);
    // Simulating deterministic model inference & static analysis
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentIncident((prev) => ({
        ...prev,
        status: 'triaged',
        durationMs: Math.floor(Math.random() * 80) + 110,
      }));
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col font-sans selection:bg-zinc-800">
      {/* Top Header */}
      <header className="h-12 border-b border-zinc-800 bg-[#09090b] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs rounded">
              T
            </div>
            <span className="font-mono text-sm font-semibold tracking-tight text-zinc-100">
              TriageOps
            </span>
          </div>
          <span className="text-zinc-600 text-xs">/</span>
          <span className="text-zinc-400 font-mono text-xs">v1.4.0-engine</span>
        </div>

        {/* Global Cluster Badges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Worker: Online</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
            <Database className="w-3.5 h-3.5 text-zinc-500" />
            <span>Telemetry: Streaming</span>
          </div>
          <div className="flex items-center gap-1.5 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>LLM Fallback: Enabled</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="flex-1 p-4 max-w-7xl w-full mx-auto space-y-4">
        {/* Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="border border-zinc-800 bg-[#0a0a0c] p-3 rounded-lg flex flex-col">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Analysis P95</span>
            <span className="text-lg font-mono font-medium text-zinc-200 mt-0.5">148ms</span>
          </div>
          <div className="border border-zinc-800 bg-[#0a0a0c] p-3 rounded-lg flex flex-col">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Triage Accuracy</span>
            <span className="text-lg font-mono font-medium text-emerald-400 mt-0.5">99.4%</span>
          </div>
          <div className="border border-zinc-800 bg-[#0a0a0c] p-3 rounded-lg flex flex-col">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Patches Verified</span>
            <span className="text-lg font-mono font-medium text-zinc-200 mt-0.5">1,248</span>
          </div>
          <div className="border border-zinc-800 bg-[#0a0a0c] p-3 rounded-lg flex flex-col">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Active Cluster</span>
            <span className="text-lg font-mono font-medium text-zinc-300 mt-0.5">us-east-1</span>
          </div>
        </div>

        {/* Core Interactive Layout: Ingestion vs Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 flex flex-col">
            <IngestionPanel
              currentIncident={currentIncident}
              onSelectPreset={handleSelectPreset}
              onPayloadChange={handlePayloadChange}
              onRunTriage={handleRunTriage}
              isProcessing={isProcessing}
            />
          </div>

          <div className="lg:col-span-6 flex flex-col">
            <DiagnosticView incident={currentIncident} />
          </div>
        </div>

        {/* Bottom Historical Table */}
        <div className="pt-2">
          <TriageHistoryTable
            incidents={incidents}
            activeIncidentId={currentIncident.id}
            onSelect={handleSelectPreset}
          />
        </div>
      </main>
    </div>
  );
}