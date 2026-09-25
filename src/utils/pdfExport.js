import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { S_PROFILE_URL } from './config';

/**
 * Generates and downloads a formatted PDF report of the given filtered startups.
 * Note: Maximum 10 records allowed for export. Redirects to social dev for more data.
 */
export function exportStartupsToPDF(startups, filters = {}) {
  const MAX_RECORDS = 10;
  const limitedStartups = startups.slice(0, MAX_RECORDS);

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const now = new Date();
  const dateString = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 297, 26, 'F');

  // Brand Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('startupio — Bengaluru Startup Directory Report', 14, 12);

  // Subtitle / Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text(`Exported on: ${dateString} | Exported: ${limitedStartups.length} of ${startups.length} records (Limit: ${MAX_RECORDS})`, 14, 19);

  // Active Filters Summary Line
  const activeFilterTexts = [];
  if (filters.area && filters.area !== 'all') activeFilterTexts.push(`Area: ${filters.area}`);
  if (filters.sector && filters.sector !== 'all') activeFilterTexts.push(`Sector: ${filters.sector}`);
  if (filters.employeeSize && filters.employeeSize !== 'all') activeFilterTexts.push(`Size: ${filters.employeeSize}`);
  if (filters.precision && filters.precision !== 'all') activeFilterTexts.push(`Precision: ${filters.precision}`);
  if (filters.verifiedOnly) activeFilterTexts.push(`Verified Only`);
  if (filters.searchQuery) activeFilterTexts.push(`Query: "${filters.searchQuery}"`);

  const filterSummary = activeFilterTexts.length > 0
    ? `Active Filters: ${activeFilterTexts.join(' | ')}`
    : `Active Filters: All Startups (No Filters Applied)`;

  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.setFont('helvetica', 'bold');
  doc.text(filterSummary, 14, 32);

  // Prepare table data (limited to 10 records)
  const tableData = limitedStartups.map((s, index) => {
    const foundersStr = Array.isArray(s.founders) && s.founders.length > 0
      ? s.founders.join(', ')
      : 'Not disclosed';

    const confidenceStr = s.confidence
      ? s.confidence.toUpperCase()
      : s.verified ? 'HIGH' : 'MEDIUM';

    const websiteStr = s.websiteUrl || 'N/A';

    return [
      index + 1,
      s.name || 'N/A',
      s.sector || 'N/A',
      s.area || 'Bengaluru',
      s.employees || 'N/A',
      foundersStr,
      s.address || 'Address pending verification',
      confidenceStr,
      websiteStr
    ];
  });

  // Render Table
  autoTable(doc, {
    startY: 36,
    head: [['#', 'Startup Name', 'Sector', 'Area', 'Employees', 'Founders', 'Address', 'Confidence', 'Website']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [14, 116, 144], // Cyan / Sky 700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59], // Slate 800
      cellPadding: 2.5
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252] // Slate 50
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },   // #
      1: { cellWidth: 36, fontStyle: 'bold' }, // Name
      2: { cellWidth: 32 },                    // Sector
      3: { cellWidth: 26 },                    // Area
      4: { cellWidth: 22 },                    // Employees
      5: { cellWidth: 32 },                    // Founders
      6: { cellWidth: 62 },                    // Address
      7: { cellWidth: 20, halign: 'center' },  // Confidence
      8: { cellWidth: 32 }                     // Website
    },
    didDrawPage: (data) => {
      // Footer page numbering
      const totalPages = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Page ${data.pageNumber} of ${totalPages} — startupio Directory Data`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 8
      );
    }
  });

  // Render "Contact the social dev to download more data" notice inside the PDF
  const finalY = (doc.lastAutoTable ? doc.lastAutoTable.finalY : 120) + 8;

  doc.setFillColor(241, 245, 249); // Slate 100
  doc.setDrawColor(203, 213, 225); // Slate 300
  doc.rect(14, finalY, 269, 14, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Contact the social dev to download more data.', 18, finalY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(2, 132, 199); // Sky 600
  doc.textWithLink(S_PROFILE_URL, 18, finalY + 11, { url: S_PROFILE_URL });

  // Save File
  const filenameStr = filters.area && filters.area !== 'all' 
    ? `startups-${filters.area.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`
    : `startups-report.pdf`;

  doc.save(filenameStr);

  // If total records exceed 10, open social dev website in a new tab to contact
  if (startups.length > 10) {
    window.open(S_PROFILE_URL, '_blank');
  }
}
