import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-primary)] opacity-20 blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600 opacity-20 blur-[100px]"></div>

      <div className="glass-panel w-full max-w-md p-8 rounded-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center font-bold text-white text-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] mx-auto mb-4">E</div>
          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-[var(--color-text-muted)]">Start managing your finances today</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-medium py-3 rounded-xl transition-all shadow-[0_4px_14px_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] flex items-center justify-center mt-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
          Already have an account? <Link to="/login" className="text-[var(--color-primary)] hover:text-indigo-400 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
