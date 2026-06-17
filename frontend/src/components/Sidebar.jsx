import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, LogOut, Receipt } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 glass-panel border-r border-[var(--color-border)] flex flex-col justify-between h-full p-6">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]">E</div>
          <h1 className="text-xl font-bold tracking-tight text-white">Expense Tracker</h1>
        </div>
        
        <nav className="space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/') ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'}`}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/transactions" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive('/transactions') ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20' : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'}`}>
            <Receipt size={20} />
            <span className="font-medium">Transactions</span>
          </Link>
        </nav>
      </div>

      <div className="space-y-4">
        <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors border border-transparent hover:border-red-400/20">
          <LogOut size={18} />
          <span className="font-medium text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
