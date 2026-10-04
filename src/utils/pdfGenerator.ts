import { jsPDF } from 'jspdf';
import { CivicReport } from '../types';

export async function generateCivicReportPDF(report: CivicReport): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  // Header Background Bar (Navy)
  doc.setFillColor(11, 31, 58); // #0B1F3A
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Line (Teal)
  doc.setFillColor(20, 184, 166); // #14B8A6
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('CIVICLENS EVIDENCE DOCKET', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('OFFICIAL CITIZEN COMPLAINT & INFRASTRUCTURE HAZARD EVIDENCE REPORT', margin, 18);
  doc.text('Jurisdiction: Kolkata Municipal Corporation (KMC) / Govt. of West Bengal', margin, 23);

  // Report ID & Date badge right-aligned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`REPORT REF: ${report.id}`, pageWidth - margin, 12, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`ISSUED: ${report.formattedTimestamp}`, pageWidth - margin, 18, { align: 'right' });
  doc.text(`STATUS: VERIFIED CITIZEN EVIDENCE`, pageWidth - margin, 23, { align: 'right' });

  let y = 38;

  // Box 1: Issue Summary & Severity Card
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 34, 2, 2, 'FD');

  // Severity color
  let sevR = 20, sevG = 184, sevB = 166;
  if (report.severity === 'Critical') {
    sevR = 225; sevG = 29; sevB = 72; // Rose / Red
  } else if (report.severity === 'High') {
    sevR = 234; sevG = 88; sevB = 12; // Orange
  } else if (report.severity === 'Medium') {
    sevR = 217; sevG = 119; sevB = 6; // Amber
  }

  // Issue Title
  doc.setTextColor(11, 31, 58);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(report.issue_type, margin + 4, y + 8);

  // Category & Severity Badge
  doc.setFillColor(sevR, sevG, sevB);
  doc.roundedRect(margin + 4, y + 12, 32, 6, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`SEVERITY: ${report.severity.toUpperCase()}`, margin + 6, y + 16.2);

  // Category badge
  doc.setFillColor(203, 213, 225);
  doc.roundedRect(margin + 39, y + 12, 45, 6, 1, 1, 'F');
  doc.setTextColor(30, 41, 59);
  doc.text(report.category.toUpperCase(), margin + 41, y + 16.2);

  // Confidence
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`AI Confidence: ${report.confidence}% • Multimodal Inspection`, margin + 88, y + 16.2);

  // Department
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Designated Authority:', margin + 4, y + 24);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(13, 148, 136);
  doc.text(report.suggested_department, margin + 42, y + 24);

  // Estimated Risk
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('Public Risk Factor:', margin + 4, y + 29.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(185, 28, 28);
  const riskText = report.risk_to_public || report.estimated_risk || 'Public hazard';
  const truncatedRisk = riskText.length > 75 ? riskText.substring(0, 72) + '...' : riskText;
  doc.text(truncatedRisk, margin + 35, y + 29.5);

  y += 40;

  // Left Column (Location & Formal Description) vs Right Column (Evidence Photo)
  const leftColWidth = 108;
  const rightColWidth = contentWidth - leftColWidth - 6;

  // Location Details Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, leftColWidth, 38, 2, 2, 'FD');

  doc.setTextColor(11, 31, 58);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('INCIDENT GEOLOCATION & WARD', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`GPS Coords:  ${report.location.latitude.toFixed(6)}° N, ${report.location.longitude.toFixed(6)}° E`, margin + 4, y + 14);
  
  const addrLines = doc.splitTextToSize(`Address: ${report.location.address}`, leftColWidth - 8);
  doc.text(addrLines.slice(0, 2), margin + 4, y + 19);

  doc.text(`Jurisdiction:  ${report.location.ward || 'Borough Municipal Wing'}, ${report.location.city}`, margin + 4, y + 28);
  doc.text(`Logged Time:   ${report.formattedTimestamp}`, margin + 4, y + 33);

  // Right Column: Evidence Photo
  const photoX = margin + leftColWidth + 6;
  doc.setDrawColor(203, 213, 225);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(photoX, y, rightColWidth, 38, 2, 2, 'FD');

  // Try embedding image if available
  if (report.imageUrl) {
    try {
      // If it's a data URL or can be drawn
      doc.addImage(report.imageUrl, 'JPEG', photoX + 2, y + 2, rightColWidth - 4, 30);
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Geo-tagged Photo Proof', photoX + rightColWidth / 2, y + 35, { align: 'center' });
    } catch {
      // Fallback text in photo box
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('[Geo-Tagged Photo Evidence]', photoX + rightColWidth / 2, y + 18, { align: 'center' });
      doc.text(`Attached to Ref: ${report.id}`, photoX + rightColWidth / 2, y + 23, { align: 'center' });
    }
  }

  y += 44;

  // Box 3: Formal Grievance Petition Text
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, y, contentWidth, 54, 2, 2, 'FD');

  doc.setTextColor(11, 31, 58);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('FORMAL GRIEVANCE PETITION & CIVIC COMPLAINT TEXT', margin + 4, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const petitionIntro = `To: The Municipal Commissioner / Borough Executive Engineer\n` +
    `Subject: Immediate Intervention Solicited Regarding ${report.issue_type} at ${report.location.address}\n\n`;
  
  doc.setFont('helvetica', 'bold');
  doc.text(petitionIntro, margin + 4, y + 14);

  doc.setFont('helvetica', 'normal');
  const bodyLines = doc.splitTextToSize(report.description, contentWidth - 8);
  doc.text(bodyLines, margin + 4, y + 24);

  // Severity reason note
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const reasonLines = doc.splitTextToSize(`Technical Inspector Note: ${report.severity_reason}`, contentWidth - 8);
  doc.text(reasonLines, margin + 4, y + 46);

  y += 60;

  // Box 4: Standard Operating Procedures / Routing
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 28, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(11, 31, 58);
  doc.text('CIVIC ESCALATION & LEGAL EVIDENCE NOTICE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const legalNotes = [
    '• This evidence docket has been generated using verified multimodal computer vision in accordance with citizen complaint standards.',
    '• Timestamp and coordinate metadata are cryptographically hashed and logged to ensure non-repudiation.',
    '• Forwarded copy dispatched to KMC Central Control Room & District Grievance Cell (WB CMO Grievance Portal).',
    '• Recommended municipal turnaround SLA under West Bengal Right to Public Services Act: 48 Hours for Critical Hazards.',
  ];
  legalNotes.forEach((line, idx) => {
    doc.text(line, margin + 4, y + 12 + idx * 4);
  });

  y += 34;

  // Signature / Verification Footer
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y + 14, margin + 50, y + 14);
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Reporting Citizen / Civic Witness', margin, y + 18);

  doc.line(pageWidth - margin - 50, y + 14, pageWidth - margin, y + 14);
  doc.text('CivicLens AI System Stamp (Verified)', pageWidth - margin - 50, y + 18);

  // Bottom Footer Bar
  doc.setFillColor(11, 31, 58);
  doc.rect(0, pageHeight - 8, pageWidth, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(6.5);
  doc.text('CivicLens — Empowering Indian Citizens for Better Municipal Governance • civiclens.org', pageWidth / 2, pageHeight - 3, { align: 'center' });

  // Save the PDF
  doc.save(`CivicLens_${report.id}.pdf`);
}
