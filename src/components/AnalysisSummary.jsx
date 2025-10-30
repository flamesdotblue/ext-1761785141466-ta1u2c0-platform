import React from 'react';

export default function AnalysisSummary({ analysis, onConfirm, confirmed }) {
  const Section = ({ title, children }) => (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-6">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <div className="mt-3 text-sm text-slate-300 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Section title="Business Context & Objectives">
        {analysis.objectives.length ? (
          <ul className="list-disc pl-5 space-y-1">
            {analysis.objectives.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">No explicit objectives found.</p>
        )}
      </Section>

      <Section title="Key Functional Areas / Modules">
        {analysis.modules.length ? (
          <ul className="list-disc pl-5 space-y-1">
            {analysis.modules.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">No modules detected.</p>
        )}
      </Section>

      {analysis.architecture.length > 0 && (
        <Section title="System Architecture Overview">
          <ul className="list-disc pl-5 space-y-1">
            {analysis.architecture.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Dependencies & Constraints">
        {analysis.dependencies.length || analysis.constraints.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 mb-1">Dependencies</div>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.dependencies.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Constraints</div>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No dependencies or constraints found.</p>
        )}
      </Section>

      <Section title="Risks / Assumptions">
        {analysis.risks.length || analysis.assumptions.length ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-slate-400 mb-1">Risks</div>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.risks.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Assumptions</div>
              <ul className="list-disc pl-5 space-y-1">
                {analysis.assumptions.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No risks or assumptions identified.</p>
        )}
      </Section>

      <div className="flex items-center justify-end gap-3">
        <button
          className={`rounded-xl px-4 py-2 text-sm font-semibold border ${confirmed ? 'border-emerald-500 text-emerald-300' : 'border-slate-700 text-slate-300'}`}
          disabled
        >
          Step 1: Analysis Complete
        </button>
        <button
          onClick={onConfirm}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400"
        >
          {confirmed ? 'Confirmed' : 'Confirm to Generate Requirements'}
        </button>
      </div>
    </div>
  );
}
