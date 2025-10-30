import React, { useMemo, useState } from 'react';
import { buildRequirements } from '../utils/requirements';

export default function RequirementsBuilder({ analysis, rawText }) {
  const generated = useMemo(() => buildRequirements(analysis, rawText), [analysis, rawText]);
  const [requirements, setRequirements] = useState(generated);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold tracking-tight">Requirements (Draft)</h3>
        <div className="text-xs text-slate-400">Minimal Epics & Features, Detailed User Stories</div>
      </div>

      <div className="mt-4 space-y-6">
        {requirements.epics.map((epic, ei) => (
          <div key={ei} className="rounded-lg border border-slate-800 p-4">
            <div className="font-semibold">Epic: {epic.title}</div>
            {epic.description && (
              <div className="text-sm text-slate-400 mt-1">{epic.description}</div>
            )}
            <div className="mt-3 space-y-4">
              {epic.features.map((f, fi) => (
                <div key={fi} className="rounded-md border border-slate-800 p-3">
                  <div className="font-medium">Feature: {f.title}</div>
                  {f.description && (
                    <div className="text-sm text-slate-400 mt-1">{f.description}</div>
                  )}
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                    {f.userStories.map((us, ui) => (
                      <li key={ui}>
                        <span className="font-medium">{us.id}</span> — As a {us.asA}, I want {us.iWant}, so that {us.soThat}.
                        {us.acceptance && (
                          <ul className="mt-1 list-disc pl-5 space-y-0.5 text-slate-400">
                            {us.acceptance.map((ac, ai) => (
                              <li key={ai}>{ac}</li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <button
          onClick={() => setRequirements(buildRequirements(analysis, rawText))}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-800/60"
        >
          Regenerate
        </button>
        <a
          href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(requirements, null, 2))}`}
          download="requirements.json"
          className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400"
        >
          Download JSON
        </a>
      </div>
    </div>
  );
}
