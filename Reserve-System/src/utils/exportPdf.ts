import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import type { Reservation } from '../types/reservation';

function fmtDate(d: string): string {
  return new Date(d).toLocaleDateString('cs-CZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

function fmtPrice(n: number): string {
  return new Intl.NumberFormat('cs-CZ').format(n) + ' Kc';
}

function calcNights(a: string, b: string): number {
  return Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

export async function exportToPdf(res: Reservation): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const ml = 25;
  const mr = W - ml;
  let y = 0;

  // ─── Background ───
  doc.setFillColor(10, 10, 11);
  doc.rect(0, 0, W, H, 'F');

  // ─── Gold top bar ───
  doc.setFillColor(201, 168, 76);
  doc.rect(0, 0, W, 1.2, 'F');

  // ─── Header area ───
  doc.setFillColor(14, 14, 16);
  doc.rect(0, 0, W, 50, 'F');

  y = 16;

  // Brand
  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(201, 168, 76);
  doc.text('GRAND SEJOUR', W / 2, y, { align: 'center' });

  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(90, 84, 71);
  doc.text('LUXURY HOTEL RESERVATIONS', W / 2, y, { align: 'center', charSpace: 2.5 });

  y += 7;
  doc.setDrawColor(201, 168, 76);
  doc.setLineWidth(0.25);
  doc.line(ml + 20, y, mr - 20, y);

  y += 6;
  doc.setFontSize(7);
  doc.setTextColor(120, 115, 100);
  doc.text('POTVRZENI REZERVACE', W / 2, y, { align: 'center', charSpace: 3 });

  // ─── Reservation meta ───
  y = 62;
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 66, 56);
  doc.text('CISLO REZERVACE', ml, y);
  doc.text('DATUM VYTVORENI', mr, y, { align: 'right' });

  y += 5;
  doc.setFont('times', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(210, 205, 190);
  doc.text('#' + res.id, ml, y);
  doc.text(fmtDate(res.createdAt.split('T')[0]), mr, y, { align: 'right' });

  y += 7;
  doc.setDrawColor(32, 30, 28);
  doc.setLineWidth(0.15);
  doc.line(ml, y, mr, y);

  // ─── Section helper ───
  const drawSection = (title: string, rows: [string, string][]) => {
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(201, 168, 76);
    doc.text(title, ml, y, { charSpace: 2 });
    y += 2;
    doc.setDrawColor(201, 168, 76);
    doc.setLineWidth(0.2);
    doc.line(ml, y, ml + 16, y);
    y += 5;

    for (const [label, value] of rows) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(80, 75, 65);
      doc.text(label, ml + 2, y);

      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(210, 200, 175);
      const lines = doc.splitTextToSize(value, mr - ml - 68);
      doc.text(lines, ml + 70, y);
      y += Math.max(6.5, (lines.length - 1) * 5 + 6.5);
    }

    y += 1;
    doc.setDrawColor(26, 24, 22);
    doc.setLineWidth(0.12);
    doc.line(ml, y, mr, y);
  };

  const n = calcNights(res.checkIn, res.checkOut);

  drawSection('UBYTOVANI', [
    ['Typ pokoje', res.place],
    ['Cislo pokoje', res.roomNumber || '—'],
  ]);

  drawSection('HLAVNI HOST', [
    ['Jmeno a prijmeni', res.customerName],
    ['Dospeli', String(res.adults)],
    ['Deti', String(res.children)],
    ['Hostu celkem', String(res.adults + res.children)],
  ]);

  drawSection('TERMIN POBYTU', [
    ['Datum prijezdu', fmtDate(res.checkIn)],
    ['Datum odjezdu', fmtDate(res.checkOut)],
    ['Pocet noci', String(n)],
  ]);

  drawSection('CENA', [
    ['Cena za noc', fmtPrice(res.pricePerNight)],
    ['Pocet noci', String(n) + 'x'],
    ['CELKOVA CENA', fmtPrice(res.totalPrice)],
  ]);

  if (res.specialRequests.trim()) {
    drawSection('SPECIALNI POZADAVKY', [
      ['Poznamky', res.specialRequests],
    ]);
  }

  // ─── QR Code ───
  try {
    const qrValue = JSON.stringify({
      id: res.id, guest: res.customerName, room: res.place,
      roomNumber: res.roomNumber, checkIn: res.checkIn, checkOut: res.checkOut,
      nights: n, totalPrice: res.totalPrice,
    });
    const qrDataUrl = await QRCode.toDataURL(qrValue, {
      width: 120, margin: 1,
      color: { dark: '#8B1F2E', light: '#0A0A0B' },
    });
    const qrSize = 28;
    const qrX = (W - qrSize) / 2;
    const qrY = H - 56;
    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(70, 66, 56);
    doc.text('SKENUJTE PRO OVERENI', W / 2, qrY + qrSize + 4, { align: 'center', charSpace: 1.5 });
  } catch {
    // skip QR if generation fails
  }

  // ─── Footer ───
  doc.setDrawColor(32, 30, 28);
  doc.setLineWidth(0.15);
  doc.line(ml, H - 18, mr, H - 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(50, 48, 42);
  doc.text(
    'Tento dokument slouzi jako potvrzeni rezervace.  Grand Sejour (c) 2026',
    W / 2, H - 12, { align: 'center' },
  );

  // Gold bottom bar
  doc.setFillColor(201, 168, 76);
  doc.rect(0, H - 1.2, W, 1.2, 'F');

  doc.save(`GrandSejour-Rezervace-${res.id}.pdf`);
}
