import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency } from './calculations';

interface LoanSummary {
  totalPrincipal: number;
  totalMonthlyPayment: number;
  totalRemainingBalance: number;
  activeLoanCount: number;
  leasingCount: number;
}

interface Loan {
  name: string;
  type: 'loan' | 'lease';
  principal: number;
  interestRate: number;
  termMonths: number;
  regularPayment: number;
  startDate: string;
  paymentFrequency: 'monthly' | 'biweekly';
  residualValue?: number;
  mileageLimit?: number;
  currentMileage?: number;
}

export function generateLoanPDF(loan: Loan, progress: number, remainingBalance: number) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Add title
  doc.setFontSize(20);
  doc.text('Kreditdetails', pageWidth / 2, 20, { align: 'center' });

  // Add loan name and type
  doc.setFontSize(16);
  doc.text(`${loan.name}${loan.type === 'lease' ? ' (Leasing)' : ''}`, pageWidth / 2, 35, { align: 'center' });

  // Add basic loan information table
  const basicInfo = [
    ['Kreditsumme', formatCurrency(loan.principal)],
    ['Zinssatz', `${loan.interestRate}%`],
    ['Laufzeit', `${loan.termMonths} Monate`],
    ['Startdatum', new Date(loan.startDate).toLocaleDateString()],
    ['Zahlungsintervall', loan.paymentFrequency === 'monthly' ? 'Monatlich' : 'Zweiwöchentlich'],
    ['Rate', `${formatCurrency(loan.regularPayment)}/${loan.paymentFrequency === 'monthly' ? 'Monat' : '2 Wochen'}`],
  ];

  if (loan.paymentFrequency === 'biweekly') {
    basicInfo.push(['Monatliche Rate (ca.)', formatCurrency(loan.regularPayment * 26 / 12)]);
  }

  autoTable(doc, {
    startY: 45,
    head: [['Parameter', 'Wert']],
    body: basicInfo,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add progress information
  const progressInfo = [
    ['Fortschritt', `${Math.round(progress)}%`],
    ['Restbetrag', formatCurrency(remainingBalance)],
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Status', 'Wert']],
    body: progressInfo,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add leasing-specific information if applicable
  if (loan.type === 'lease') {
    const leasingInfo = [
      ['Restwert', loan.residualValue ? formatCurrency(loan.residualValue) : 'Nicht angegeben'],
      ['Kilometerbegrenzung', loan.mileageLimit ? `${loan.mileageLimit.toLocaleString()} km` : 'Nicht angegeben'],
      ['Aktueller Kilometerstand', loan.currentMileage ? `${loan.currentMileage.toLocaleString()} km` : 'Nicht angegeben'],
    ];

    if (loan.mileageLimit && loan.currentMileage) {
      leasingInfo.push(['Kilometerauslastung', `${Math.round((loan.currentMileage / loan.mileageLimit) * 100)}%`]);
    }

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [['Leasing Details', 'Wert']],
      body: leasingInfo,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });
  }

  // Add payment schedule
  const monthlyRate = loan.interestRate / 12 / 100;
  const schedule = [];
  let balance = loan.principal;
  const startDate = new Date(loan.startDate);

  for (let month = 0; month < loan.termMonths && balance > 0; month++) {
    const interest = balance * monthlyRate;
    const principal = loan.regularPayment - interest;
    balance = Math.max(0, balance - principal);

    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + month);

    schedule.push([
      date.toLocaleDateString(),
      formatCurrency(loan.regularPayment),
      formatCurrency(principal),
      formatCurrency(interest),
      formatCurrency(balance),
    ]);

    // Break if we have too many rows to fit on the page
    if (month >= 20) {
      schedule.push(['...', '...', '...', '...', '...']);
      break;
    }
  }

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 15,
    head: [['Datum', 'Rate', 'Tilgung', 'Zinsen', 'Restschuld']],
    body: schedule,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add footer with generation date
  const today = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Erstellt am: ${today}`, 14, doc.internal.pageSize.getHeight() - 10);

  return doc;
}

export function generateLoansOverviewPDF(
  loans: Loan[],
  progressData: { [key: string]: { progress: number; remainingBalance: number } }
) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString();

  // Add title and date
  doc.setFontSize(24);
  doc.text('Kreditübersicht', pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Erstellt am: ${today}`, pageWidth / 2, 30, { align: 'center' });

  // Calculate summary metrics
  const summary: LoanSummary = loans.reduce((acc, loan) => {
    const isActive = new Date(loan.startDate) <= new Date() &&
      new Date(loan.startDate).setMonth(new Date(loan.startDate).getMonth() + loan.termMonths) >= Date.now();

    if (isActive) {
      acc.totalPrincipal += loan.principal;
      acc.totalMonthlyPayment += loan.paymentFrequency === 'monthly'
        ? loan.regularPayment
        : (loan.regularPayment * 26 / 12);
      acc.totalRemainingBalance += progressData[loan.name]?.remainingBalance || 0;
      acc.activeLoanCount++;
      if (loan.type === 'lease') acc.leasingCount++;
    }
    return acc;
  }, {
    totalPrincipal: 0,
    totalMonthlyPayment: 0,
    totalRemainingBalance: 0,
    activeLoanCount: 0,
    leasingCount: 0,
  });

  // Add summary table
  const summaryData = [
    ['Aktive Kredite', `${summary.activeLoanCount} (davon ${summary.leasingCount} Leasing)`],
    ['Gesamtkreditsumme', formatCurrency(summary.totalPrincipal)],
    ['Monatliche Gesamtrate', formatCurrency(summary.totalMonthlyPayment)],
    ['Gesamte Restschuld', formatCurrency(summary.totalRemainingBalance)],
  ];

  autoTable(doc, {
    startY: 40,
    head: [['Übersicht', 'Wert']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  // Add loan details
  doc.setFontSize(16);
  doc.text('Kreditdetails', pageWidth / 2, doc.lastAutoTable.finalY + 20, { align: 'center' });

  loans.forEach((loan, index) => {
    const progress = progressData[loan.name]?.progress || 0;
    const remainingBalance = progressData[loan.name]?.remainingBalance || 0;

    const loanData = [
      ['Name', loan.name],
      ['Typ', loan.type === 'lease' ? 'Leasing' : 'Kredit'],
      ['Kreditsumme', formatCurrency(loan.principal)],
      ['Rate', `${formatCurrency(loan.regularPayment)}/${loan.paymentFrequency === 'monthly' ? 'Monat' : '2 Wochen'}`],
      ['Zinssatz', `${loan.interestRate}%`],
      ['Laufzeit', `${loan.termMonths} Monate`],
      ['Startdatum', new Date(loan.startDate).toLocaleDateString()],
      ['Fortschritt', `${Math.round(progress)}%`],
      ['Restschuld', formatCurrency(remainingBalance)],
    ];

    if (loan.type === 'lease') {
      if (loan.residualValue) {
        loanData.push(['Restwert', formatCurrency(loan.residualValue)]);
      }
      if (loan.mileageLimit) {
        loanData.push(['Kilometerbegrenzung', `${loan.mileageLimit.toLocaleString()} km`]);
      }
      if (loan.currentMileage) {
        loanData.push(['Aktueller Kilometerstand', `${loan.currentMileage.toLocaleString()} km`]);
      }
    }

    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY + 15 || 40,
      head: [[`Kredit ${index + 1}`, 'Details']],
      body: loanData,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
    });
  });

  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Seite ${i} von ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  return doc;
}