export async function parseFile(file) {
  const type = file.type || guessMimeFromName(file.name);

  if (type.startsWith('text/') || file.name.toLowerCase().endsWith('.md')) {
    const text = await readAsText(file);
    return { file, type, text, meta: { method: 'text' } };
  }

  if (type === 'application/pdf') {
    // Best-effort: try to read as text; many PDFs won't yield readable text without a PDF parser.
    const text = await tryReadAsText(file);
    return { file, type, text, meta: { method: 'best-effort' } };
  }

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    // Best-effort for DOCX: read as binary and extract any readable text chunks.
    const ab = await readAsArrayBuffer(file);
    const text = extractAsciiFromArrayBuffer(ab);
    return { file, type, text, meta: { method: 'best-effort' } };
  }

  // Fallback to text
  const text = await tryReadAsText(file);
  return { file, type, text, meta: { method: 'fallback' } };
}

function guessMimeFromName(name) {
  const n = name.toLowerCase();
  if (n.endsWith('.md')) return 'text/markdown';
  if (n.endsWith('.txt')) return 'text/plain';
  if (n.endsWith('.pdf')) return 'application/pdf';
  if (n.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  return 'application/octet-stream';
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function tryReadAsText(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => resolve('');
    reader.readAsText(file);
  });
}

function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function extractAsciiFromArrayBuffer(ab) {
  try {
    const bytes = new Uint8Array(ab);
    let acc = '';
    let run = '';
    for (let i = 0; i < bytes.length; i++) {
      const b = bytes[i];
      if (b >= 32 && b <= 126) {
        run += String.fromCharCode(b);
      } else {
        if (run.length >= 4) acc += run + '\n';
        run = '';
      }
      if (acc.length > 150000) break; // avoid huge strings
    }
    if (run.length >= 4) acc += run + '\n';
    return acc;
  } catch (e) {
    return '';
  }
}
