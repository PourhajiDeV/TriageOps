export type SeverityLevel = 'critical' | 'degraded' | 'warning';
export type Environment = 'production' | 'staging' | 'canary';
export type TriageStatus = 'resolved' | 'triaged' | 'pending';

export interface StackFrame {
  file: string;
  line: number;
  column?: number;
  function: string;
  isInternal: boolean;
}

export interface DiffChunk {
  type: 'add' | 'delete' | 'context';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface PatchProposal {
  targetFile: string;
  description: string;
  diff: DiffChunk[];
}

export interface Incident {
  id: string;
  service: string;
  environment: Environment;
  severity: SeverityLevel;
  timestamp: string;
  errorMessage: string;
  errorCode: string;
  rawPayload: string;
  durationMs: number;
  status: TriageStatus;
  hypothesis: string;
  stackFrames: StackFrame[];
  patch: PatchProposal;
  preventionChecklist: string[];
}