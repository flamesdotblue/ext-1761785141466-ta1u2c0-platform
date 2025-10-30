import React, { useState } from 'react';
import HeroSection from './components/HeroSection';
import FileUploader from './components/FileUploader';
import AnalysisSummary from './components/AnalysisSummary';
import RequirementsBuilder from './components/RequirementsBuilder';
import { analyzeHLD } from './utils/analyzeText';

export default function App() {
  const [fileInfo, setFileInfo] = useState(null);
  const [rawText, setRawText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleParsed = ({ file, type, text, meta }) => {
    setFileInfo({ name: file.name, size: file.size, type, meta });
    setRawText(text);
    const a = analyzeHLD(text);
    setAnalysis(a);
    setConfirmed(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <HeroSection />
      <main className="mx-auto max-w-6xl px-6 pb-24 -mt-24 relative z-10">
        <section className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <FileUploader onParsed={handleParsed} />
            {fileInfo && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-4">
                <div className="text-sm text-slate-300">Uploaded</div>
                <div className="mt-1 font-medium">{fileInfo.name}</div>
                <div className="text-xs text-slate-400">
                  {fileInfo.type} · {(fileInfo.size / 1024).toFixed(1)} KB
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-7 space-y-6">
            {analysis ? (
              <AnalysisSummary
                analysis={analysis}
                onConfirm={() => setConfirmed(true)}
                confirmed={confirmed}
              />
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-8">
                <h3 className="text-lg font-semibold">Awaiting HLD upload</h3>
                <p className="mt-2 text-slate-400 text-sm">
                  Upload an HLD in Markdown, TXT, PDF, or DOCX. I will parse the content and produce a concise, structured analysis of objectives, key modules, architecture, dependencies, and risks. Then, on your confirmation, I will generate a minimal set of Epics & Features with detailed User Stories.
                </p>
              </div>
            )}

            {confirmed && analysis && (
              <RequirementsBuilder analysis={analysis} rawText={rawText} />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
