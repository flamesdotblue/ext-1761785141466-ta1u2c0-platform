import React, { useRef, useState } from 'react';
import { parseFile } from '../utils/parser';

export default function FileUploader({ onParsed }) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [hint, setHint] = useState('PDF, DOCX, MD, or TXT up to ~10MB');
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files) => {
    const file = files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const result = await parseFile(file);
      onParsed(result);
      if (result.type === 'application/pdf' || result.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setHint('Note: PDF/DOCX parsing is best-effort in-browser. For highest accuracy, upload Markdown.');
      } else {
        setHint('Parsed successfully. You can upload a different file to replace.');
      }
    } catch (e) {
      setError(e?.message || 'Failed to parse file');
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`relative rounded-2xl border ${dragActive ? 'border-cyan-400 bg-cyan-400/5' : 'border-slate-800 bg-slate-900/60'} p-6 transition-colors`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".md,.txt,.pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/markdown,text/plain"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold">Upload High-Level Design</h3>
            <p className="text-sm text-slate-400 mt-1">{hint}</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            disabled={loading}
          >
            {loading ? 'Parsing…' : 'Choose File'}
          </button>
        </div>
        <div className="mt-4 text-xs text-slate-500">
          Or drag and drop your file here
        </div>
        {error && (
          <div className="mt-3 text-sm text-rose-400">{error}</div>
        )}
      </div>
    </div>
  );
}
