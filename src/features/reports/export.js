/**
 * Real file exports for the active report. Both libraries are imported on demand, so they
 * stay out of the main bundle until someone clicks Export.
 *
 * A report description looks like:
 * {
 *   title, subtitle, filename,
 *   summary: [["Total income", 12345, "usd"], ...],
 *   tables: [{ name, columns: [{ header, key, format }], rows }],
 * }
 * PDF-only extras (used by the booking invoice): `kicker` replaces "TOURTRIP · ADMIN REPORT",
 * `meta` replaces the "Exported … · Mock data" line, `notes` are paragraphs printed after the
 * tables, and `datedFilename: false` saves as `<filename>.pdf` without the date suffix.
 * Formats: "text" (default), "count", "usd", "percent" (0–100), "signedPercent", "rating" (0–5 or null), "date" (YYYY-MM-DD).
 */

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const count = new Intl.NumberFormat("en-US");
const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

/** Display text for PDF cells (Helvetica only covers Latin-1, so no ★ or − signs). */
function display(value, format) {
  if (value === null || value === undefined || value === "") return "-";
  switch (format) {
    case "usd":
      return usd.format(value);
    case "count":
      return count.format(value);
    case "percent":
      return `${value.toFixed(1)}%`;
    case "signedPercent":
      return `${value >= 0 ? "+" : "-"}${Math.abs(value).toFixed(1)}%`;
    case "rating":
      return `${value.toFixed(1)} / 5`;
    case "date":
      return dateFormat.format(new Date(`${value}T00:00:00Z`));
    default:
      return String(value);
  }
}

const EXCEL_FORMATS = { usd: '"$"#,##0', count: "#,##0", percent: "0.0%", signedPercent: "+0.0%;-0.0%;0.0%", rating: "0.0" };

/** Excel cell value: numbers stay numeric (percent as a fraction) so sheets can be summed and sorted. */
function cellValue(value, format) {
  if (value === null || value === undefined) return "";
  if (format === "percent" || format === "signedPercent") return value / 100;
  if (format === "date") return display(value, "date");
  return value;
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const sheetName = (name) => name.replace(/[\\/?*[\]:]/g, " ").slice(0, 31);

export async function exportReportXlsx(report) {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();

  // Summary sheet: title, period and headline figures.
  const summaryRows = [[report.title], [report.subtitle], [`Exported ${timestamp()} · TourTrip admin (mock data)`], []];
  report.summary.forEach(([label, value, format]) => summaryRows.push([label, cellValue(value, format)]));
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
  report.summary.forEach(([, value, format], index) => {
    const cell = summarySheet[XLSX.utils.encode_cell({ r: summaryRows.length - report.summary.length + index, c: 1 })];
    if (cell && EXCEL_FORMATS[format] && typeof value === "number") cell.z = EXCEL_FORMATS[format];
  });
  summarySheet["!cols"] = [{ wch: 28 }, { wch: 22 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  for (const table of report.tables) {
    const rows = [table.columns.map((column) => column.header), ...table.rows.map((row) => table.columns.map((column) => cellValue(row[column.key], column.format)))];
    const sheet = XLSX.utils.aoa_to_sheet(rows);
    table.columns.forEach((column, columnIndex) => {
      const format = EXCEL_FORMATS[column.format];
      if (!format) return;
      for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
        const cell = sheet[XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex })];
        if (cell && cell.t === "n") cell.z = format;
      }
    });
    sheet["!cols"] = table.columns.map((column) => ({ wch: Math.max(column.header.length + 2, column.width ?? 14) }));
    sheet["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length - 1, c: table.columns.length - 1 } }) };
    XLSX.utils.book_append_sheet(workbook, sheet, sheetName(table.name));
  }

  XLSX.writeFile(workbook, `${report.filename}-${timestamp()}.xlsx`, { compression: true });
}

/** `#c8553d` → [200, 85, 61]; falls back to terracotta if the token cannot be read. */
function tokenRgb(token, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  const hex = value.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(hex)) return fallback;
  return [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

export async function exportReportPdf(report) {
  const [{ jsPDF }, { autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const wide = report.tables.some((table) => table.columns.length > 6);
  const doc = new jsPDF({ orientation: wide ? "landscape" : "portrait", unit: "pt", format: "a4", compress: true });
  const primary = tokenRgb("--primary", [200, 85, 61]);
  const accent = tokenRgb("--accent", [233, 185, 73]);
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  // Header band.
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, 6, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...primary);
  doc.text(report.kicker ?? "TOURTRIP · ADMIN REPORT", margin, 34);
  doc.setFontSize(20);
  doc.setTextColor(26, 31, 33);
  doc.text(report.title, margin, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 117);
  doc.text(`${report.subtitle} · ${report.meta ?? `Exported ${timestamp()} · Mock data`}`, margin, 78);

  // Summary figures in a two-column grid.
  let y = 104;
  const columnWidth = (pageWidth - margin * 2) / 2;
  report.summary.forEach(([label, value, format], index) => {
    const x = margin + (index % 2) * columnWidth;
    if (index % 2 === 0 && index > 0) y += 34;
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 117);
    doc.text(label.toUpperCase(), x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(26, 31, 33);
    doc.text(display(value, format), x, y + 16);
    doc.setFont("helvetica", "normal");
  });
  y += 44;

  for (const table of report.tables) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(26, 31, 33);
    if (y > doc.internal.pageSize.getHeight() - 80) {
      doc.addPage();
      y = 50;
    }
    doc.text(table.name, margin, y);
    autoTable(doc, {
      startY: y + 8,
      margin: { left: margin, right: margin },
      head: [table.columns.map((column) => column.header)],
      body: table.rows.map((row) => table.columns.map((column) => display(row[column.key], column.format))),
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 5, textColor: [26, 31, 33], lineColor: [230, 224, 214], lineWidth: 0.5 },
      headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 245, 240] },
      columnStyles: Object.fromEntries(
        table.columns.map((column, index) => [index, ["usd", "count", "percent", "rating"].includes(column.format) ? { halign: "right" } : {}]),
      ),
      didDrawPage: () => {
        const height = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 117);
        doc.text(`${report.title} · Page ${doc.getNumberOfPages()}`, margin, height - 20);
        doc.setFillColor(...accent);
        doc.rect(pageWidth - margin - 30, height - 24, 30, 2, "F");
      },
    });
    y = doc.lastAutoTable.finalY + 32;
  }

  if (report.notes?.length) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(74, 82, 85);
    for (const note of report.notes) {
      const lines = doc.splitTextToSize(note, pageWidth - margin * 2);
      if (y + lines.length * 13 > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        y = 50;
      }
      doc.text(lines, margin, y);
      y += lines.length * 13 + 8;
    }
  }

  doc.save(report.datedFilename === false ? `${report.filename}.pdf` : `${report.filename}-${timestamp()}.pdf`);
}
