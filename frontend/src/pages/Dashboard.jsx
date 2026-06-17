import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AuthContext } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Download, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { downloadDashboardCsv, getDashboardSummary } from '../utils/exportTransactions';

const Dashboard = () => {
  const { transactions } = useContext(TransactionContext);
  const { user } = useContext(AuthContext);

  const { totalIncome, totalExpense, balance } = getDashboardSummary(transactions);
  const recentTransactions = transactions.slice(0, 5);

  const pieData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expense', value: totalExpense }
  ].filter(d => d.value > 0);

  // Simple aggregation for bar chart (last 6 transactions for demo)
  const barData = transactions.slice(0, 6).map(t => ({
    name: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    amount: t.amount,
    fill: t.type === 'income' ? '#10b981' : '#ef4444'
  })).reverse();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-[var(--color-text-muted)]">Welcome back, {user?.name}</p>
        </div>
        <button
          onClick={() => downloadDashboardCsv(transactions)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white shadow-[0_4px_14px_rgba(99,102,241,0.39)] transition-colors hover:bg-[var(--color-primary-hover)]"
        >
          <Download size={18} />
          <span>Download CSV</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-[var(--color-primary)]/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] opacity-10 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Total Balance</p>
              <h3 className="text-3xl font-bold text-white">${balance.toFixed(2)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)]">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Total Income</p>
              <h3 className="text-3xl font-bold text-emerald-400">${totalIncome.toFixed(2)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:border-red-500/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500 opacity-10 rounded-bl-full -mr-8 -mt-8"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-[var(--color-text-muted)] mb-1">Total Expense</p>
              <h3 className="text-3xl font-bold text-red-400">${totalExpense.toFixed(2)}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
              <TrendingDown size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Income vs Expense</h3>
          <div className="h-64">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? '#10b981' : '#ef4444'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e2128', border: '1px solid #374151', borderRadius: '0.5rem', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">No data to display</div>
            )}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 10, left: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    width={54}
                    tickFormatter={(value) => `$${Number(value).toLocaleString('en-US', { notation: 'compact', maximumFractionDigits: 1 })}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#374151', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#1e2128', border: '1px solid #374151', borderRadius: '0.5rem', color: '#fff' }}
                  />
                  <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)]">No activity yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <p className="text-sm text-[var(--color-text-muted)]">Latest income and expense activity</p>
          </div>
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-muted)]">No transactions yet</div>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction._id} className="p-4 md:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    transaction.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {transaction.type === 'income' ? <ArrowUpRight size={22} /> : <ArrowDownRight size={22} />}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-white font-medium truncate">{transaction.category}</h4>
                    <p className="text-sm text-[var(--color-text-muted)] truncate">{transaction.description || 'No description'}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount || 0).toFixed(2)}
                  </span>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{new Date(transaction.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
