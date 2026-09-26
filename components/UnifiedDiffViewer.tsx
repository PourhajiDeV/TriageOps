import React from 'react';
import { DiffChunk } from '@/lib/types';
import { FileCode2, Copy, Check } from 'lucide-react';

interface Props {
  targetFile: string;
  diff: DiffChunk[];
}

export const UnifiedDiffViewer: React.FC<Props> = ({ targetFile, diff }) => {
  const [copied, setCopied] = React.useState(false);

  const rawDiffText = diff.map((chunk) => chunk.content).join('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawDiffText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-zinc-800 bg-[#0c0c0e] rounded-md overflow-hidden text-xs font-mono">
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/70 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-zinc-300">
          <FileCode2 className="w-3.5 h-3.5 text-zinc-400" />
          <span>{targetFile}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-100 transition-colors px-1.5 py-0.5 rounded border border-zinc-800 hover:border-zinc-700 bg-zinc-950"
        >
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Copied' : 'Copy Patch'}</span>
        </button>
      </div>

      <div className="overflow-x-auto divide-y divide-zinc-900/40">
        {diff.map((line, idx) => {
          const isAdd = line.type === 'add';
          const isDel = line.type === 'delete';

          return (
            <div
              key={idx}
              className={`flex items-stretch leading-5 transition-colors ${
                isAdd
                  ? 'bg-emerald-950/25 text-emerald-300 hover:bg-emerald-950/40'
                  : isDel
                  ? 'bg-rose-950/25 text-rose-300 hover:bg-rose-950/40'
                  : 'text-zinc-400 hover:bg-zinc-900/30'
              }`}
            >
              <div className="w-9 px-2 py-0.5 text-right select-none text-zinc-600 border-r border-zinc-900 text-[10px]">
                {line.oldLineNumber ?? ''}
              </div>
              <div className="w-9 px-2 py-0.5 text-right select-none text-zinc-600 border-r border-zinc-900 text-[10px]">
                {line.newLineNumber ?? ''}
              </div>
              <div className="w-5 text-center select-none font-semibold text-[11px]">
                {isAdd ? '+' : isDel ? '-' : ' '}
              </div>
              <div className="flex-1 px-2 py-0.5 whitespace-pre overflow-x-visible">
                {line.content.replace(/^[+-]/, '')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};