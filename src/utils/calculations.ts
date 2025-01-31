export const calculatePrincipalFromPayment = (
  monthlyPayment: number,
  annualRate: number,
  termMonths: number
): number => {
  if (monthlyPayment <= 0 || annualRate <= 0 || termMonths <= 0) {
    throw new Error('All values must be positive numbers');
  }

  const monthlyRate = annualRate / 12 / 100;
  
  // Handle 0% interest rate as a special case
  if (annualRate === 0) {
    return monthlyPayment * termMonths;
  }
  
  const principal = monthlyPayment * (1 - Math.pow(1 + monthlyRate, -termMonths)) / monthlyRate;
  
  if (isNaN(principal) || !isFinite(principal) || principal <= 0) {
    throw new Error('Invalid loan parameters');
  }
  
  return principal;
};

export const calculateLoanPayment = (
  principal: number,
  annualRate: number,
  termMonths: number
): number => {
  const monthlyRate = annualRate / 12 / 100;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1)
  );
};

export const calculateTotalInterest = (
  principal: number,
  monthlyPayment: number,
  termMonths: number
): number => {
  return monthlyPayment * termMonths - principal;
};

export const calculateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  termMonths: number,
  extraPayments: { amount: number; date: string }[] = []
): {
  date: string;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  extraPayment?: number;
}[] => {
  const monthlyRate = annualRate / 12 / 100;
  const monthlyPayment = calculateLoanPayment(principal, annualRate, termMonths);
  let balance = principal;
  const schedule = [];
  const startDate = new Date();

  for (let month = 0; month < termMonths && balance > 0; month++) {
    const interest = balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + month);

    const extraPayment = extraPayments.find(
      (p) => p.date === date.toISOString().split('T')[0]
    );

    if (extraPayment) {
      principalPaid += extraPayment.amount;
    }

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance -= principalPaid;

    schedule.push({
      date: date.toISOString().split('T')[0],
      payment: monthlyPayment,
      principal: principalPaid,
      interest,
      remainingBalance: balance,
      extraPayment: extraPayment?.amount,
    });

    if (balance <= 0) break;
  }

  return schedule;
};

export const formatCurrency = (
  amount: number,
  currency: string = 'USD'
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const calculateSavingsFromExtraPayments = (
  loan: {
    principal: number;
    interestRate: number;
    termMonths: number;
  },
  extraPayments: { amount: number; date: string }[]
): {
  totalSaved: number;
  timesSaved: number;
} => {
  const normalSchedule = calculateAmortizationSchedule(
    loan.principal,
    loan.interest_rate,
    loan.term_months
  );
  const acceleratedSchedule = calculateAmortizationSchedule(
    loan.principal,
    loan.interestRate,
    loan.termMonths,
    extraPayments
  );

  const totalSaved =
    normalSchedule.reduce((sum, payment) => sum + payment.interest, 0) -
    acceleratedSchedule.reduce((sum, payment) => sum + payment.interest, 0);

  const timesSaved = normalSchedule.length - acceleratedSchedule.length;

  return { totalSaved, timesSaved };
};