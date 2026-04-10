function escapeCsvValue(value) {
  const normalized =
    value == null
      ? ""
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function toCsv(rows, columns) {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(",");

  const body = rows.map((row) =>
    columns
      .map((column) => escapeCsvValue(column.value(row)))
      .join(","),
  );

  return [header, ...body].join("\n");
}

export function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

export function downloadCsvFile(filename, rows, columns) {
  const csv = toCsv(rows, columns);
  downloadTextFile(filename, csv, "text/csv;charset=utf-8");
}

export function downloadJsonFile(filename, payload) {
  downloadTextFile(filename, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

const PDF_PAGE_WIDTH = 595.28;
const PDF_PAGE_HEIGHT = 841.89;
const PDF_MARGIN = 36;

function sanitizePdfText(value) {
  return String(value ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)")
    .replaceAll(/\r?\n/g, " ")
    .replace(/[^\x20-\x7E]/g, "?");
}

function wrapPdfText(text, maxChars) {
  const words = sanitizePdfText(text).split(/\s+/).filter(Boolean);
  if (words.length === 0) {
    return [""];
  }

  const lines = [];
  let current = words[0];

  for (let index = 1; index < words.length; index += 1) {
    const word = words[index];
    if ((current + " " + word).length <= maxChars) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }

  lines.push(current);
  return lines;
}

function createPdfLayout() {
  const pages = [];

  function newPage() {
    pages.push({ commands: [], y: PDF_PAGE_HEIGHT - PDF_MARGIN });
  }

  function currentPage() {
    if (pages.length === 0) {
      newPage();
    }

    return pages[pages.length - 1];
  }

  function ensureSpace(heightNeeded) {
    if (currentPage().y - heightNeeded < PDF_MARGIN) {
      newPage();
    }
  }

  function addText(text, x, fontSize = 12, font = "F1", lineHeight = 1.35, maxWidth = PDF_PAGE_WIDTH - PDF_MARGIN * 2 - x) {
    const approxChars = Math.max(24, Math.floor(maxWidth / (fontSize * 0.52)));
    const lines = wrapPdfText(text, approxChars);

    lines.forEach((line) => {
      ensureSpace(fontSize * lineHeight);
      const page = currentPage();
      page.commands.push(`BT /${font} ${fontSize} Tf 1 0 0 1 ${x.toFixed(2)} ${page.y.toFixed(2)} Tm (${sanitizePdfText(line)}) Tj ET`);
      page.y -= fontSize * lineHeight;
    });
  }

  function addRule() {
    ensureSpace(14);
    const page = currentPage();
    page.commands.push(`0.85 w 0.90 0.92 0.95 RG ${PDF_MARGIN.toFixed(2)} ${page.y.toFixed(2)} m ${(PDF_PAGE_WIDTH - PDF_MARGIN).toFixed(2)} ${page.y.toFixed(2)} l S`);
    page.y -= 14;
  }

  function addTitle(title, subtitle, generatedAt) {
    addText(title, PDF_MARGIN, 21, "F2", 1.15);
    if (subtitle) {
      addText(subtitle, PDF_MARGIN, 10.5, "F1", 1.25, PDF_PAGE_WIDTH - PDF_MARGIN * 2);
    }
    if (generatedAt) {
      addText(`Generated: ${generatedAt}`, PDF_MARGIN, 9.5, "F1", 1.25);
    }
    addRule();
  }

  function addCards(cards = []) {
    if (cards.length === 0) return;

    const cardWidth = (PDF_PAGE_WIDTH - PDF_MARGIN * 2 - 12) / 2;
    const cardHeight = 58;
    const xPositions = [PDF_MARGIN, PDF_MARGIN + cardWidth + 12];

    for (let index = 0; index < cards.length; index += 2) {
      ensureSpace(cardHeight + 12);
      const page = currentPage();
      const rowCards = cards.slice(index, index + 2);
      const topY = page.y;

      rowCards.forEach((card, cardIndex) => {
        const x = xPositions[cardIndex];
        const y = topY - cardHeight;
        page.commands.push(`0.8 w 0.88 0.90 0.94 RG ${x.toFixed(2)} ${y.toFixed(2)} ${cardWidth.toFixed(2)} ${cardHeight.toFixed(2)} re S`);
        page.commands.push(`BT /F1 9.5 Tf 0.45 0.48 0.55 rg 1 0 0 1 ${(x + 10).toFixed(2)} ${(topY - 18).toFixed(2)} Tm (${sanitizePdfText(card.label)}) Tj ET`);
        page.commands.push(`BT /F2 16 Tf 0.10 0.12 0.18 rg 1 0 0 1 ${(x + 10).toFixed(2)} ${(topY - 36).toFixed(2)} Tm (${sanitizePdfText(card.value)}) Tj ET`);
        if (card.note) {
          page.commands.push(`BT /F1 8.5 Tf 0.45 0.48 0.55 rg 1 0 0 1 ${(x + 10).toFixed(2)} ${(topY - 50).toFixed(2)} Tm (${sanitizePdfText(card.note)}) Tj ET`);
        }
      });

      page.y = topY - cardHeight - 14;
    }
  }

  function addSection(section) {
    if (!section) return;

    ensureSpace(28);
    addText(section.title, PDF_MARGIN, 14, "F2", 1.25);

    if (section.subtitle) {
      addText(section.subtitle, PDF_MARGIN, 9.5, "F1", 1.25);
    }

    if (section.rows && section.rows.length > 0) {
      section.rows.forEach((row) => {
        const value = row.value == null || row.value === "" ? "N/A" : row.value;
        addText(`- ${row.label}: ${value}`, PDF_MARGIN + 10, 10.5, "F1", 1.28, PDF_PAGE_WIDTH - PDF_MARGIN * 2 - 12);
      });
    } else if (section.table && section.table.headers && section.table.rows) {
      const tableWidth = PDF_PAGE_WIDTH - PDF_MARGIN * 2;
      const columnCount = section.table.headers.length || 1;
      const colWidth = tableWidth / columnCount;
      const fontSize = 8.8;

      ensureSpace(20);
      const headerPage = currentPage();
      const headerY = headerPage.y;
      headerPage.commands.push(`0.8 w 0.88 0.90 0.94 RG ${PDF_MARGIN.toFixed(2)} ${(headerY - 16).toFixed(2)} ${tableWidth.toFixed(2)} 18 re S`);
      section.table.headers.forEach((header, index) => {
        const x = PDF_MARGIN + index * colWidth + 6;
        headerPage.commands.push(`BT /F2 ${fontSize} Tf 0.18 0.20 0.25 rg 1 0 0 1 ${x.toFixed(2)} ${(headerY - 4).toFixed(2)} Tm (${sanitizePdfText(header)}) Tj ET`);
      });
      headerPage.y -= 22;

      section.table.rows.forEach((row, rowIndex) => {
        const rowText = row.map((cell, index) => `${section.table.headers[index]}: ${cell}`).join(" | ");
        addText(rowText, PDF_MARGIN + 6, 9.3, "F1", 1.24, PDF_PAGE_WIDTH - PDF_MARGIN * 2 - 12);
        if (rowIndex !== section.table.rows.length - 1) {
          addRule();
        }
      });
    } else if (section.items && section.items.length > 0) {
      section.items.forEach((item) => {
        const title = item.title || item.label || "Item";
        const subtitle = item.subtitle || item.meta || "";
        addText(`- ${title}${subtitle ? `: ${subtitle}` : ""}`, PDF_MARGIN + 10, 10.5, "F1", 1.28, PDF_PAGE_WIDTH - PDF_MARGIN * 2 - 12);
      });
    }

    addRule();
  }

  function build() {
    const objectMap = [];
    objectMap[1] = "<< /Type /Catalog /Pages 2 0 R >>";
    objectMap[2] = `<< /Type /Pages /Kids [${pages.map((_, index) => `${6 + index * 2} 0 R`).join(" ")}] /Count ${pages.length} >>`;
    objectMap[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
    objectMap[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";
    objectMap[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>";

    const contentStreams = pages.map((page) => page.commands.join("\n"));

    pages.forEach((_, index) => {
      const pageObjectNum = 6 + index * 2;
      const contentObjectNum = pageObjectNum + 1;
      objectMap[pageObjectNum] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PDF_PAGE_WIDTH} ${PDF_PAGE_HEIGHT}] /Resources << /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >> /Contents ${contentObjectNum} 0 R >>`;
      objectMap[contentObjectNum] = `<< /Length ${contentStreams[index].length} >>\nstream\n${contentStreams[index]}\nendstream`;
    });

    const objectNumbers = Object.keys(objectMap)
      .map((key) => Number(key))
      .filter((key) => Number.isFinite(key))
      .sort((a, b) => a - b);

    let pdf = "%PDF-1.4\n%\xFF\xFF\xFF\xFF\n";
    const offsets = { 0: 0 };

    objectNumbers.forEach((number) => {
      offsets[number] = pdf.length;
      pdf += `${number} 0 obj\n${objectMap[number]}\nendobj\n`;
    });

    const xrefOffset = pdf.length;
    const highestObjectNumber = objectNumbers[objectNumbers.length - 1] || 0;
    pdf += `xref\n0 ${highestObjectNumber + 1}\n`;
    pdf += "0000000000 65535 f \n";
    for (let index = 1; index <= highestObjectNumber; index += 1) {
      pdf += `${String(offsets[index] ?? 0).padStart(10, "0")} 00000 n \n`;
    }
    pdf += `trailer\n<< /Size ${highestObjectNumber + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return pdf;
  }

  return {
    addTitle,
    addCards,
    addSection,
    build,
  };
}

export function downloadPdfReport(filename, report) {
  const layout = createPdfLayout();
  layout.addTitle(report.title, report.subtitle, report.generatedAt);
  layout.addCards(report.cards);

  (report.sections || []).forEach((section) => {
    layout.addSection(section);
  });

  const pdf = layout.build();
  downloadTextFile(filename, pdf, "application/pdf");
}
