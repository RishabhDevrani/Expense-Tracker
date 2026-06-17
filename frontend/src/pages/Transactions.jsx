import { useState, useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Transactions = () => {
  const { transactions, addTransaction, deleteTransaction } = useContext(TransactionContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  
  // Form state
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction({ type, amount: Number(amount), category, description });
    setIsModalOpen(false);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Transactions</h1>
          <p className="text-[var(--color-text-muted)]">Manage your income and expenses</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_4px_14px_rgba(99,102,241,0.39)] flex items-center gap-2"
        >
          <Plus size={20} />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-[var(--color-border)] flex gap-2">
          {['all', 'income', 'expense'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f 
                  ? 'bg-[var(--color-primary)] text-white' 
                  : 'bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="divide-y divide-[var(--color-border)]">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              No transactions found.
            </div>
          ) : (
            filteredTransactions.map(t => (
              <div key={t._id} className="p-4 md:p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {t.type === 'income' ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">{t.category}</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">{t.description || 'No description'}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`font-bold text-lg ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => deleteTransaction(t._id)}
                    className="w-8 h-8 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-400/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-white mb-6">New Transaction</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border ${
                    type === 'expense' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <ArrowDownRight size={18} /> Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 border ${
                    type === 'income' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <ArrowUpRight size={18} /> Income
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-all"
                  placeholder={type === 'income' ? 'e.g. Salary, Freelance' : 'e.g. Groceries, Rent'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Description (Optional)</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 px-4 text-white focus:outline-none focus:border-[var(--color-primary)] transition-all"
                  placeholder="Details..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 rounded-xl font-medium text-gray-400 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] shadow-[0_4px_14px_rgba(99,102,241,0.39)] transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Transactions;
