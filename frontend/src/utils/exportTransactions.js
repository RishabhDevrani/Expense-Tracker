const formatAmount = (amount) => Number(amount || 0).toFixed(2);

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildRow = (values) => values.map(escapeCsvValue).join(',');

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US');
};

export const getDashboardSummary = (transactions) => {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((total, transaction) => total + Number(transaction.amount || 0), 0);

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
  };
};

export const downloadDashboardCsv = (transactions) => {
  const { totalIncome, totalExpense, balance } = getDashboardSummary(transactions);
  const recentTransactions = transactions.slice(0, 10);

  const rows = [
    ['Dashboard Summary'],
    ['Metric', 'Amount'],
    ['Total Income', formatAmount(totalIncome)],
    ['Total Expense', formatAmount(totalExpense)],
    ['Balance', formatAmount(balance)],
    [],
    ['Chart Data'],
    ['Type', 'Amount'],
    ['Income', formatAmount(totalIncome)],
    ['Expense', formatAmount(totalExpense)],
    [],
    ['Recent Transactions'],
    ['Date', 'Type', 'Category', 'Description', 'Amount'],
    ...recentTransactions.map((transaction) => [
      formatDate(transaction.date),
      transaction.type,
      transaction.category,
      transaction.description || '',
      formatAmount(transaction.amount),
    ]),
    [],
    ['All Transactions'],
    ['Date', 'Type', 'Category', 'Description', 'Amount'],
    ...transactions.map((transaction) => [
      formatDate(transaction.date),
      transaction.type,
      transaction.category,
      transaction.description || '',
      formatAmount(transaction.amount),
    ]),
  ];

  const csv = rows.map(buildRow).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `expense-dashboard-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  window.dispatchEvent(new CustomEvent('app:toast', {
    detail: { message: 'Dashboard CSV downloaded successfully' },
  }));
};
