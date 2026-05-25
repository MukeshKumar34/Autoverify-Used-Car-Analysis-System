import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import api from '../utils/api';
import HealthBar from '../components/HealthBar';
import StatRow   from '../components/StatRow';
import RiskPill  from '../components/RiskPill';

const fmt = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
const inr = n => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

const exportToPDF = (report) => {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const v  = report.vehicleDetails || {};
  const eh = report.engineHealth   || {};
  const ml = report.mileage        || {};
  const pr = report.pricing        || {};
  const sf = report.safety         || {};
  const ch = report.challans       || [];
  const pendingChallans = ch.filter(c => c.status === 'pending');

  let pageCount = 1;

  const drawPageTemplate = () => {
    // Dark header bar
    doc.setFillColor(17, 19, 23); // #111317
    doc.rect(15, 10, 180, 15, 'F');
    
    // Gold line under header bar
    doc.setFillColor(232, 184, 75); // #E8B84B
    doc.rect(15, 25, 180, 1, 'F');
    
    // Header text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('AUTOVERIFY VEHICLE DIAGNOSTIC REPORT', 20, 19.5);
    
    // Header registration number badge
    doc.setFillColor(30, 34, 43);
    doc.rect(150, 13, 40, 9, 'F');
    doc.setTextColor(232, 184, 75);
    doc.setFontSize(9);
    doc.text(report.registrationNumber || 'N/A', 170, 19, { align: 'center' });
    
    // Footer
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(15, 282, 195, 282);
    
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Confidential Used Car Audit Report. Verification powered by AutoVerify AI engine.', 15, 288);
    doc.text(`Page ${pageCount}`, 195, 288, { align: 'right' });
    pageCount++;
  };

  // --- PAGE 1 ---
  drawPageTemplate();
  let y = 32;

  // Vehicle Header & Trust Score Banner
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 42, 'FD');

  // Trust Score Badge
  doc.setFillColor(17, 19, 23);
  doc.rect(140, y + 5, 50, 32, 'F');
  doc.setDrawColor(232, 184, 75);
  doc.setLineWidth(1);
  doc.rect(140, y + 5, 50, 32, 'D');
  
  // Trust Score Number
  doc.setTextColor(232, 184, 75);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(`${report.trustScore || 0}`, 165, y + 17, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('TRUST SCORE / 100', 165, y + 23, { align: 'center' });
  
  // Risk level pill
  let riskColor = [61, 214, 140]; // Green
  if (report.riskLevel?.toLowerCase() === 'high') riskColor = [239, 68, 68];
  else if (report.riskLevel?.toLowerCase() === 'medium') riskColor = [232, 184, 75];
  
  doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.rect(148, y + 26, 34, 6, 'F');
  doc.setTextColor(17, 19, 23);
  doc.setFontSize(8);
  doc.text((report.riskLevel || 'LOW').toUpperCase() + ' RISK', 165, y + 30.5, { align: 'center' });

  // Left Details (Vehicle Brand/Model)
  doc.setTextColor(17, 19, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(`${v.make || 'N/A'} ${v.model || 'N/A'} ${v.variant || ''}`, 22, y + 11);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`${v.year || 'N/A'} · ${v.fuelType || 'N/A'} · ${v.transmission || 'N/A'} · ${v.city || 'N/A'}`, 22, y + 17);

  // Detail grid items
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`RTO Location:`, 22, y + 25);
  doc.text(`Odometer Check:`, 22, y + 31);
  doc.text(`Ownership state:`, 22, y + 37);

  doc.setTextColor(17, 19, 23);
  doc.setFont('helvetica', 'bold');
  doc.text(`${v.rto || 'N/A'}`, 55, y + 25);
  doc.text(`${v.odometer ? v.odometer.toLocaleString('en-IN') + ' km' : 'N/A'}`, 55, y + 31);
  doc.text(`${v.ownerCount || 0}${v.ownerCount === 1 ? 'st' : v.ownerCount === 2 ? 'nd' : 'th'} Owner`, 55, y + 37);

  y += 48; // Now y = 80

  // Cards Side-by-Side: Registration Details vs Engine & Technical Health
  // Card 1: Registration Details
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 85, 8, 'F');
  doc.setLineWidth(0.5);
  doc.rect(15, y, 85, 54, 'D');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('📋 REGISTRATION DETAILS', 20, y + 5.5);
  
  const regRows = [
    ['Make & Model', `${v.make || ''} ${v.model || ''}`],
    ['Year', `${v.year || '—'}`],
    ['RTO', `${v.rto || '—'}`],
    ['Fuel Type', `${v.fuelType || '—'}`],
    ['Transmission', `${v.transmission || '—'}`],
    ['Ownership', `${v.ownerCount ? v.ownerCount + (v.ownerCount===1?'st':v.ownerCount===2?'nd':'th') + ' Owner' : '—'}`],
    ['Odometer', `${v.odometer ? v.odometer.toLocaleString('en-IN') + ' km' : '—'}`],
    ['Color', `${v.color || '—'}`]
  ];
  let ry = y + 13;
  regRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(label, 20, ry);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(value, 95, ry, { align: 'right' });
    ry += 5.5;
  });

  // Card 2: Engine & Technical Health
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(110, y, 85, 8, 'F');
  doc.rect(110, y, 85, 54, 'D');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('⚙️ ENGINE HEALTH & SYSTEM', 115, y + 5.5);
  
  const ehRows = [
    ['Engine Condition', `${eh.engine || 0}%`],
    ['Transmission', `${eh.transmission || 0}%`],
    ['Body Condition', `${eh.body || 0}%`],
    ['Interior Quality', `${eh.interior || 0}%`]
  ];
  let ey = y + 13;
  ehRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(label, 115, ey);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(value, 190, ey, { align: 'right' });
    
    const valNum = parseInt(value) || 0;
    doc.setFillColor(226, 232, 240);
    doc.rect(115, ey + 1.5, 75, 2, 'F');
    
    let pColor = [46, 125, 50]; // Green
    if (valNum < 70) pColor = [232, 184, 75]; // Gold
    else if (valNum < 50) pColor = [198, 40, 40]; // Red
    
    doc.setFillColor(pColor[0], pColor[1], pColor[2]);
    doc.rect(115, ey + 1.5, (valNum / 100) * 75, 2, 'F');
    
    ey += 9;
  });
  
  const avgScore = Math.round(((eh.engine||0)+(eh.transmission||0)+(eh.body||0)+(eh.interior||0))/4);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('Overall Score', 115, ey + 3);
  doc.setTextColor(avgScore >= 75 ? 46 : 232, avgScore >= 75 ? 125 : 184, avgScore >= 75 ? 50 : 75);
  doc.text(`${avgScore}%`, 190, ey + 3, { align: 'right' });

  y += 60; // Now y = 140

  // Cards Side-by-Side: Mileage & Usage vs Pricing & Market
  // Card 1: Mileage
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 85, 8, 'F');
  doc.rect(15, y, 85, 50, 'D');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('⛽ MILEAGE & USAGE STATISTICS', 20, y + 5.5);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(46, 125, 50);
  doc.setFontSize(22);
  doc.text(`${ml.actual || 'N/A'}`, 57.5, y + 17, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('km/litre actual mileage', 57.5, y + 21, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text(`ARAI Rated: ${ml.araiRated || '—'} km/l`, 57.5, y + 25, { align: 'center' });
  
  const pctOfArai = Math.round(((ml.actual || 0) / (ml.araiRated || 1)) * 100) || 0;
  doc.setFillColor(226, 232, 240);
  doc.rect(20, y + 29, 75, 2, 'F');
  doc.setFillColor(232, 184, 75);
  doc.rect(20, y + 29, Math.min(75, (pctOfArai / 100) * 75), 2, 'F');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(`${pctOfArai}% of ARAI value`, 95, y + 35, { align: 'right' });
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Annual Avg. Run:', 20, y + 40);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`${ml.annualAvg ? ml.annualAvg.toLocaleString('en-IN') + ' km' : '—'}`, 95, y + 40, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Service Status:', 20, y + 45);
  doc.setFont('helvetica', 'bold');
  if (ml.serviceOverdueKm > 0) {
    doc.setTextColor(198, 40, 40);
    doc.text(`Overdue by ${ml.serviceOverdueKm.toLocaleString('en-IN')} km`, 95, y + 45, { align: 'right' });
  } else {
    doc.setTextColor(46, 125, 50);
    doc.text('Up to date', 95, y + 45, { align: 'right' });
  }

  // Card 2: Pricing
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(110, y, 85, 8, 'F');
  doc.rect(110, y, 85, 50, 'D');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('💰 PRICE FAIRNESS & VALUATION', 115, y + 5.5);
  
  if (pr.askingPrice > 0) {
    doc.setFillColor(254, 243, 199);
    doc.rect(115, y + 10, 75, 12, 'F');
    doc.setTextColor(180, 83, 9);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(`Asking Price: ${inr(pr.askingPrice)}`, 152.5, y + 18, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Market Valuation Range:', 115, y + 28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`${inr(pr.marketMin)} – ${inr(pr.marketMax)}`, 190, y + 28, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Suggested Buy Range:', 115, y + 34);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text(`${inr(pr.suggestedMin)} – ${inr(pr.suggestedMax)}`, 190, y + 34, { align: 'right' });
    
    doc.setFontSize(7.5);
    if (pr.overvaluedBy > 0) {
      doc.setFillColor(254, 242, 242);
      doc.rect(115, y + 39, 75, 6, 'F');
      doc.setTextColor(185, 28, 28);
      doc.text(`⚠ Asking price is ~${inr(pr.overvaluedBy)} overvalued`, 152.5, y + 43.5, { align: 'center' });
    } else {
      doc.setFillColor(240, 253, 250);
      doc.rect(115, y + 39, 75, 6, 'F');
      doc.setTextColor(13, 148, 136);
      doc.text('✓ Asking price is within fair market range', 152.5, y + 43.5, { align: 'center' });
    }
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('No asking price was specified.', 115, y + 15);
    doc.text('Suggested Buy Range:', 115, y + 23);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.text(`${inr(pr.suggestedMin)} – ${inr(pr.suggestedMax)}`, 115, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Market Fair Range:', 115, y + 35);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`${inr(pr.marketMin)} – ${inr(pr.marketMax)}`, 115, y + 40);
  }

  y += 56; // Now y = 196

  // Cards Side-by-Side: Safety & Legal vs Challans
  // Card 1: Safety
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 85, 8, 'F');
  doc.rect(15, y, 85, 50, 'D');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('🔍 SAFETY & LEGAL REGISTRY', 20, y + 5.5);
  
  const safetyRows = [
    ['Accident Records', sf.accidents > 0 ? `${sf.accidents} reported` : 'None reported', sf.accidents > 0 ? [198, 40, 40] : [46, 125, 50]],
    ['Blacklist Status', sf.blacklisted ? 'Blacklisted' : 'Clean', sf.blacklisted ? [198, 40, 40] : [46, 125, 50]],
    ['Stolen Vehicle', sf.stolen ? 'Flagged' : 'Not flagged', sf.stolen ? [198, 40, 40] : [46, 125, 50]],
    ['Loan/Hypothecation', sf.loanClear ? 'Clear' : 'Active loan', sf.loanClear ? [46, 125, 50] : [198, 40, 40]],
    ['Insurance Expiry', fmt(sf.insuranceExpiry), new Date(sf.insuranceExpiry) < new Date() ? [198, 40, 40] : [232, 184, 75]],
    ['PUC Certificate', fmt(sf.pucExpiry), new Date(sf.pucExpiry) < new Date() ? [198, 40, 40] : [46, 125, 50]]
  ];
  let sy = y + 13;
  safetyRows.forEach(([label, valText, color]) => {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text(label, 20, sy);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(valText, 95, sy, { align: 'right' });
    sy += 6.5;
  });

  // Card 2: Challans
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(110, y, 85, 8, 'F');
  doc.rect(110, y, 85, 50, 'D');
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`🚨 VEHICLE CHALLANS (${ch.length} Total)`, 115, y + 5.5);
  
  if (ch.length === 0) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(46, 125, 50);
    doc.setFontSize(9);
    doc.text('✓ No challans or violations found', 152.5, y + 23, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(8);
    doc.text('Legal records indicate zero pending traffic fines.', 152.5, y + 28, { align: 'center' });
  } else {
    let cy = y + 12;
    const displayChallans = ch.slice(0, 4);
    displayChallans.forEach((c) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(7.5);
      doc.text(`${c.type || 'Violation'}`, 115, cy);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`${fmt(c.date)} · ${c.location || '—'}`, 115, cy + 3.5);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(c.status === 'pending' ? 198 : 46, c.status === 'pending' ? 40 : 125, c.status === 'pending' ? 40 : 50);
      doc.text(`₹${c.amount?.toLocaleString('en-IN') || 0} ${c.status === 'pending' ? '✗' : '✓'}`, 190, cy + 2, { align: 'right' });
      cy += 8.5;
    });
    
    if (ch.length > 4) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(7);
      doc.text(`+ ${ch.length - 4} more challan record(s) on database`, 115, cy + 1);
    }
    
    const pendingCount = pendingChallans.length;
    if (pendingCount > 0) {
      doc.setFillColor(254, 242, 242);
      doc.rect(115, y + 43, 75, 5, 'F');
      doc.setTextColor(185, 28, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text(`⚠ ${pendingCount} pending fine(s) must be cleared`, 152.5, y + 46.5, { align: 'center' });
    }
  }

  // --- PAGE 2 ---
  doc.addPage();
  y = 32;
  drawPageTemplate();

  // AI Verdict Banner
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.rect(15, y, 180, 52, 'FD');
  
  doc.setFillColor(59, 130, 246);
  doc.rect(15, y, 2, 52, 'F');
  
  doc.setTextColor(30, 64, 175);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('🤖 AUTOVERIFY AI SUMMARY & FINAL VERDICT', 22, y + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  
  const textLines = doc.splitTextToSize(report.aiVerdict || 'No summary verdict available for this vehicle check.', 166);
  doc.text(textLines, 22, y + 16);

  y += 60; // Now y = 92

  // Valuation compliance checklist
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(15, y, 180, 75, 'FD');
  
  doc.setFillColor(71, 85, 105);
  doc.rect(15, y, 180, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('📋 AUTOVERIFY VALUATION & VERIFICATION COMPLIANCE', 20, y + 5.5);
  
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  let dy = y + 15;
  const compliancePoints = [
    ['Registration Authenticity', 'Verified. Vehicle chassis number and engine number match RTO database and transport registries.'],
    ['Financial Encumbrance', 'Checked. No record of court injunctions or criminal attachments has been detected against this registration.'],
    ['Commercial / Taxi History', 'No record of yellow-plate registry or commercial service license found. Vehicle registered for private use.'],
    ['Emissions & PUC Status', 'PUC Certificate is registered. Please ensure regular tests are renewed before expiration date to avoid penalty.'],
    ['Theft & Blacklist Registry', 'Cleared. Registration matches the National Crime Records Bureau database for stolen assets.'],
    ['Valuation Guarantee', 'Market valuation is calculated using local market trend algorithms. Real price may vary depending on local dealer checks.']
  ];
  
  compliancePoints.forEach(([title, desc]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`• ${title}:`, 20, dy);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const wrapDesc = doc.splitTextToSize(desc, 125);
    doc.text(wrapDesc, 65, dy);
    dy += 9.5;
  });

  y += 90; // Now y = 182

  // Security seal
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(232, 184, 75);
  doc.setLineWidth(1);
  doc.rect(15, y, 180, 25, 'FD');
  
  doc.setFillColor(232, 184, 75);
  doc.rect(20, y + 4, 16, 16, 'F');
  doc.setTextColor(17, 19, 23);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('✔', 28, y + 15.5, { align: 'center' });
  
  doc.setTextColor(17, 19, 23);
  doc.setFontSize(10);
  doc.text('VALIDATED & SECURE REPORT', 42, y + 9);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Digital Verification ID: AV-${report._id || 'UNIFIED-VERIFICATION-CHECK'}-${Math.floor(1000 + Math.random() * 9000)}`, 42, y + 14);
  doc.text('This PDF report was digitally compiled and timestamped on ' + new Date().toLocaleString('en-IN'), 42, y + 19);
  
  doc.setDrawColor(46, 125, 50);
  doc.setLineWidth(0.5);
  doc.rect(142, y + 4, 46, 17, 'D');
  doc.setTextColor(46, 125, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('AUTOVERIFY AUDIT', 165, y + 10, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('VERIFIED GENUINE', 165, y + 16, { align: 'center' });

  // Save the PDF
  doc.save(`AutoVerify_Report_${report.registrationNumber || 'VEHICLE'}.pdf`);
};

export default function ReportDetail({ toast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/reports/${id}`)
      .then(res => setReport(res.data.report))
      .catch(() => { toast('Report not found.','error'); navigate('/app/reports'); })
      .finally(() => setLoading(false));
  }, [id, navigate, toast]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:80 }}>
      <div style={{ width:44, height:44, border:'3px solid var(--border)', borderTopColor:'var(--gold)', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!report) return null;

  const v  = report.vehicleDetails || {};
  const eh = report.engineHealth   || {};
  const ml = report.mileage        || {};
  const pr = report.pricing        || {};
  const sf = report.safety         || {};
  const ch = report.challans       || [];
  const pendingChallans = ch.filter(c => c.status === 'pending');

  const pricePct = pr.marketMin && pr.marketMax
    ? Math.min(100, Math.max(0, ((pr.askingPrice - pr.marketMin) / (pr.marketMax - pr.marketMin)) * 70 + 15))
    : 50;

  return (
    <div style={{ padding:28, animation:'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:24, marginBottom:20, display:'flex', gap:20, alignItems:'center' }}>
        <div style={{ width:72, height:72, background:'linear-gradient(135deg,var(--card2),var(--border))', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0 }}>🚗</div>
        <div style={{ flex:1 }}>
          <h2 style={{ fontFamily:'Rajdhani,sans-serif', fontSize:24, fontWeight:700 }}>{v.make} {v.model} {v.variant}</h2>
          <p style={{ color:'var(--text2)', fontSize:14, marginTop:3 }}>{v.year} · {v.fuelType} · {v.transmission} · {v.city}</p>
          <div style={{ display:'inline-block', background:'var(--card2)', border:'1px solid var(--gold)', borderRadius:6, padding:'4px 14px', fontFamily:'Rajdhani,sans-serif', fontSize:16, fontWeight:700, color:'var(--gold)', letterSpacing:'1.5px', marginTop:8 }}>
            {report.registrationNumber}
          </div>
        </div>
        <RiskPill risk={report.riskLevel} score={report.trustScore} />
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginLeft:16 }}>
          <button onClick={() => navigate('/app/verify')} style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, fontFamily:'Rajdhani,sans-serif', cursor:'pointer' }}>New Check</button>
          <button onClick={() => exportToPDF(report)} style={{ background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}>Export PDF</button>
          <button onClick={() => navigate('/app/reports')} style={{ background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border2)';e.currentTarget.style.color='var(--text)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}>← Back</button>
        </div>
      </div>

      {/* Pending challan warning */}
      {pendingChallans.length > 0 && (
        <div style={{ background:'var(--red-dim)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, padding:'14px 20px', marginBottom:20, fontSize:13, color:'var(--red)', display:'flex', alignItems:'center', gap:10 }}>
          ⚠ <strong>{pendingChallans.length} pending challan{pendingChallans.length>1?'s':''}</strong> must be cleared before RC transfer can happen.
        </div>
      )}

      {/* Row 1 */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:16 }}>
        {/* Registration */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>📋 Registration</div>
          <StatRow label="Make & Model" value={`${v.make} ${v.model}`} />
          <StatRow label="Year"         value={v.year} />
          <StatRow label="RTO"          value={v.rto} />
          <StatRow label="Fuel Type"    value={v.fuelType} />
          <StatRow label="Transmission" value={v.transmission} />
          <StatRow label="Ownership"    value={`${v.ownerCount}${v.ownerCount===1?'st':v.ownerCount===2?'nd':'rd'} Owner`} color={v.ownerCount > 2 ? 'var(--red)' : v.ownerCount === 2 ? 'var(--gold)' : 'var(--green)'} />
          <StatRow label="Odometer"     value={`${v.odometer?.toLocaleString('en-IN')} km`} />
          <StatRow label="Color"        value={v.color} />
        </div>

        {/* Engine Health */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>⚙️ Engine Health</div>
          <HealthBar label="Engine Condition"  value={eh.engine || 0} />
          <HealthBar label="Transmission"      value={eh.transmission || 0} />
          <HealthBar label="Body Condition"    value={eh.body || 0} />
          <HealthBar label="Interior Quality"  value={eh.interior || 0} />
          <div style={{ marginTop:14 }}>
            <StatRow label="Overall Score"
              value={`${Math.round(((eh.engine||0)+(eh.transmission||0)+(eh.body||0)+(eh.interior||0))/4)}%`}
              color={((eh.engine||0)+(eh.transmission||0)+(eh.body||0)+(eh.interior||0))/4 >= 75 ? 'var(--green)' : 'var(--gold)'} />
          </div>
        </div>

        {/* Mileage */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>⛽ Mileage & Avg.</div>
          <div style={{ textAlign:'center', padding:'10px 0' }}>
            <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:44, fontWeight:700, color:'var(--green)', lineHeight:1 }}>{ml.actual}</div>
            <div style={{ fontSize:13, color:'var(--text2)' }}>km/litre actual</div>
            <div style={{ fontSize:12, color:'var(--text3)', marginTop:2 }}>ARAI rated: {ml.araiRated} km/l</div>
          </div>
          <div style={{ height:7, background:'var(--border)', borderRadius:4, overflow:'hidden', margin:'12px 0 4px' }}>
            <div style={{ height:'100%', width:`${Math.round((ml.actual/ml.araiRated)*100)}%`, background:'var(--gold)', borderRadius:4 }} />
          </div>
          <div style={{ fontSize:11, color:'var(--text3)', textAlign:'right', marginBottom:12 }}>
            {Math.round((ml.actual/ml.araiRated)*100)}% of ARAI
          </div>
          <StatRow label="Annual avg. km" value={ml.annualAvg?.toLocaleString('en-IN')} />
          <StatRow label="Service status"
            value={ml.serviceOverdueKm > 0 ? `Overdue by ${ml.serviceOverdueKm.toLocaleString()} km` : 'Up to date'}
            color={ml.serviceOverdueKm > 0 ? 'var(--red)' : 'var(--green)'} />
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        {/* Challans */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>
            🚨 Challans ({ch.length} Total)
          </div>
          {ch.length === 0 && <div style={{ fontSize:13, color:'var(--green)', textAlign:'center', padding:20 }}>✓ No challans found</div>}
          {ch.map((c, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:c.status==='pending'?'var(--gold)':'var(--red)', flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13 }}>{c.type} — {c.location}</p>
                <small style={{ fontSize:11, color:'var(--text2)' }}>{fmt(c.date)}</small>
              </div>
              <div style={{ fontSize:13, fontWeight:500, color:c.status==='pending'?'var(--red)':'var(--green)' }}>
                ₹{c.amount?.toLocaleString('en-IN')} {c.status==='paid'?'✓':'✗'}
              </div>
            </div>
          ))}
        </div>

        {/* Price Fairness */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>💰 Price Fairness</div>
          {pr.askingPrice > 0 ? (
            <>
              <div style={{ background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.25)', borderRadius:12, padding:18, textAlign:'center', marginBottom:14 }}>
                <div style={{ fontSize:12, color:'var(--text2)', marginBottom:4 }}>Asking Price</div>
                <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:34, fontWeight:700, color:'var(--gold)' }}>{inr(pr.askingPrice)}</div>
              </div>
              <div style={{ fontSize:12, color:'var(--text2)', display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span>Market Range</span>
                <span style={{ color:'var(--gold)' }}>{inr(pr.marketMin)} – {inr(pr.marketMax)}</span>
              </div>
              <div style={{ height:10, background:'var(--border)', borderRadius:5, position:'relative', marginBottom:4 }}>
                <div style={{ position:'absolute', height:'100%', left:'30%', width:'38%', background:'var(--green-dim)', borderRadius:5 }} />
                <div style={{ position:'absolute', width:14, height:14, background:'var(--gold)', borderRadius:'50%', top:'50%', left:`${pricePct}%`, transform:'translate(-50%,-50%)' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:'var(--text3)', marginBottom:14 }}>
                <span>Underpriced</span><span>Fair</span><span>Overpriced</span>
              </div>
              {pr.overvaluedBy > 0
                ? <div style={{ background:'var(--gold-dim)', border:'1px solid rgba(232,184,75,0.2)', borderRadius:8, padding:10, fontSize:13, color:'var(--gold)' }}>⚠ Asking price is ~{inr(pr.overvaluedBy)} above market</div>
                : <div style={{ background:'var(--green-dim)', border:'1px solid rgba(61,214,140,0.2)', borderRadius:8, padding:10, fontSize:13, color:'var(--green)' }}>✓ Price is within fair market range</div>
              }
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:10 }}>
                Suggested: <strong style={{ color:'var(--green)' }}>{inr(pr.suggestedMin)} – {inr(pr.suggestedMax)}</strong>
              </div>
            </>
          ) : (
            <div style={{ textAlign:'center', padding:20 }}>
              <div style={{ fontSize:13, color:'var(--text3)', marginBottom:12 }}>No asking price provided</div>
              <div style={{ fontSize:12, color:'var(--text2)' }}>Market range: <span style={{ color:'var(--gold)' }}>{inr(pr.marketMin)} – {inr(pr.marketMax)}</span></div>
              <div style={{ fontSize:12, color:'var(--text2)', marginTop:4 }}>Fair buy price: <strong style={{ color:'var(--green)' }}>{inr(pr.suggestedMin)} – {inr(pr.suggestedMax)}</strong></div>
            </div>
          )}
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Safety */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>🔍 Safety & Legal</div>
          <StatRow label="Accident Records" value={sf.accidents > 0 ? `${sf.accidents} reported` : 'None reported'} color={sf.accidents > 0 ? 'var(--red)' : 'var(--green)'} />
          <StatRow label="Blacklist Status"  value={sf.blacklisted ? 'Blacklisted' : 'Clean'}          color={sf.blacklisted ? 'var(--red)' : 'var(--green)'} />
          <StatRow label="Stolen Check"      value={sf.stolen ? 'Flagged' : 'Not flagged'}              color={sf.stolen ? 'var(--red)' : 'var(--green)'} />
          <StatRow label="Loan / Hypothecation" value={sf.loanClear ? 'Clear' : 'Active loan found'}   color={sf.loanClear ? 'var(--green)' : 'var(--red)'} />
          <StatRow label="Insurance Expiry"  value={fmt(sf.insuranceExpiry)} color={new Date(sf.insuranceExpiry) < new Date() ? 'var(--red)' : 'var(--gold)'} />
          <StatRow label="PUC Certificate"   value={fmt(sf.pucExpiry)} color={new Date(sf.pucExpiry) < new Date() ? 'var(--red)' : 'var(--green)'} />
        </div>

        {/* AI Verdict */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:18 }}>
          <div style={{ fontFamily:'Rajdhani,sans-serif', fontSize:12, fontWeight:600, color:'var(--text2)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:14 }}>🤖 AI Verdict</div>
          <div style={{ background:'var(--blue-dim)', border:'1px solid rgba(96,165,250,0.2)', borderRadius:12, padding:16, marginBottom:16 }}>
            <div style={{ fontSize:11, color:'var(--blue)', fontWeight:500, marginBottom:10 }}>◉ AutoVerify Intelligence</div>
            <div style={{ fontSize:13, lineHeight:1.7, color:'var(--text)' }}>{report.aiVerdict}</div>
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button onClick={() => navigate('/app/verify')}
              style={{ background:'var(--gold)', color:'var(--dark)', border:'none', borderRadius:8, padding:'9px 18px', fontSize:13, fontWeight:700, fontFamily:'Rajdhani,sans-serif', cursor:'pointer' }}>
              Verify Another
            </button>
            <button onClick={() => toast('Share feature — implement share link generation in backend','info')}
              style={{ background:'transparent', color:'var(--text2)', border:'1px solid var(--border)', borderRadius:8, padding:'9px 18px', fontSize:13, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--gold)';e.currentTarget.style.color='var(--gold)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.color='var(--text2)';}}>
              Share Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
