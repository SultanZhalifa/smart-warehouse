// ============================================
// SMART WAREHOUSE — Export Utilities
// ============================================

/**
 * Export data as a CSV file
 */
export function exportToCSV(data, filename, columns) {
  if (!data || data.length === 0) return;

  const headers = columns ? columns.map((c) => c.label) : Object.keys(data[0]);
  const keys = columns ? columns.map((c) => c.key) : Object.keys(data[0]);

  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      keys.map((key) => {
        const val = row[key];
        // Escape commas and quotes
        const escaped = String(val ?? '').replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data as a JSON file
 */
export function exportToJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
}

/**
 * Generate and download a PDF report (simple HTML-to-print)
 */
export function exportToPDF(title, data, columns) {
  const headers = columns ? columns.map((c) => c.label) : Object.keys(data[0]);
  const keys = columns ? columns.map((c) => c.key) : Object.keys(data[0]);

  const tableRows = data.map((row) =>
    `<tr>${keys.map((key) => `<td style="padding:8px;border:1px solid #333;font-size:12px;">${row[key] ?? ''}</td>`).join('')}</tr>`
  ).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 40px; background: #0a0e1a; color: #e2e8f0; }
        h1 { color: #00d4ff; font-size: 24px; margin-bottom: 4px; }
        p { color: #64748b; font-size: 12px; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th { padding: 10px 8px; text-align: left; background: #1f2937; color: #00d4ff; font-size: 12px; font-weight: 700; border: 1px solid #333; }
        td { padding: 8px; border: 1px solid #333; font-size: 12px; }
        tr:nth-child(even) td { background: rgba(255,255,255,0.02); }
        .footer { margin-top: 20px; font-size: 10px; color: #475569; }
        @media print {
          body { background: white; color: #1a1a1a; }
          th { background: #f3f4f6; color: #111; border-color: #d1d5db; }
          td { border-color: #d1d5db; }
          h1 { color: #111; }
        }
      </style>
    </head>
    <body>
      <h1>📦 ${title}</h1>
      <p>Generated on ${new Date().toLocaleString()} — Smart Warehouse System</p>
      <table>
        <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
      <div class="footer">Smart Warehouse — Object Detection System | President University | Group 5</div>
      <script>window.onload = () => window.print();</script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Helper to download a Blob
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
